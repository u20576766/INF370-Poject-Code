using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Management.Common;
using Microsoft.SqlServer.Management.Smo;
using System;
using System.Collections.Specialized;
using System.Data;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Timers;
using UniBooks_Backend.Repositories;
using Timer = System.Timers.Timer;

namespace UniBooks_Backend.Models
{
    public class SystemDataRepository
    {

        private readonly BlobServiceClient _blobServiceClient;
        private BlobContainerClient helpClient;
        private readonly BlobRepository _blobRepository;
        SqlConnection sqlConnection = new SqlConnection("Server=.\\SQLEXPRESS;Database=UniBooks;Trusted_Connection=True;MultipleActiveResultSets=True;Encrypt=False");
        private System.Timers.Timer _backupTimer;
        private int _backupIntervalValue; // Interval in minutes
        private TimeUnit _selectedTimeUnit = TimeUnit.Seconds;
        public SystemDataRepository(BlobServiceClient blobServiceClient, BlobRepository blobRepository)
        {
            _blobRepository = blobRepository;
            _blobServiceClient = blobServiceClient;
            helpClient = _blobServiceClient.GetBlobContainerClient("uni-books-db-backups");
            _backupIntervalValue = 1;

            SetupTimer();
        }
        public enum TimeUnit
        {
            Seconds,
            Minutes,
            Hours,
            Days,
            Weeks,
            Months
        }


        public void SetBackupInterval(int intervalValue)
        {
            _backupIntervalValue = intervalValue;
            SetupTimer();
        }
        private void SetupTimer()
        {
            
            // Stop and reconfigure the timer
            _backupTimer?.Stop();
            _backupTimer?.Dispose();
            _backupTimer = new System.Timers.Timer();


            // Calculate the interval based on the selected time unit
            int intervalMilliseconds = 0;
            switch (_selectedTimeUnit)
            {
                case TimeUnit.Seconds:
                    intervalMilliseconds = _backupIntervalValue; // Convert seconds to milliseconds
                    break;
                case TimeUnit.Minutes:
                    intervalMilliseconds = _backupIntervalValue * 60; // Convert minutes to milliseconds
                    break;
                case TimeUnit.Hours:
                    intervalMilliseconds = _backupIntervalValue * 60 * 60; // Convert hours to milliseconds
                    break;
                case TimeUnit.Days:
                    intervalMilliseconds = _backupIntervalValue * 24 * 60 * 60; // Convert days to milliseconds
                    break;
                case TimeUnit.Weeks:
                    intervalMilliseconds = _backupIntervalValue * 7 * 24 * 60 * 60; // Convert weeks to milliseconds
                    break;
                case TimeUnit.Months:
                    // Assume a month is 30 days for simplicity (adjust as needed)
                    intervalMilliseconds = _backupIntervalValue * 30 * 24 * 60 * 60; // Convert months to milliseconds
                    break;
            }


            _backupTimer.Interval = intervalMilliseconds;
            _backupTimer.Elapsed += BackupTimerElapsed;
            _backupTimer.AutoReset = true;
            _backupTimer.Start();
        }

        private void BackupTimerElapsed(object sender, ElapsedEventArgs e)
        {
            // This method will be called when the timer elapses
            string backupResult = Backup();
            Console.WriteLine(backupResult);
        }
        public string Backup()
        {
            try
            {
                // SQL Server connection settings
                string serverName = ".\\SQLEXPRESS";
                string databaseName = "UniBooks";
                string scriptFolderPath = "C:\\Scripts"; // local folder

                // Set up server connection
                ServerConnection serverConnection = new ServerConnection(serverName);
                Server server = new Server(serverConnection);
                Database database = server.Databases[databaseName];

                // Create folder if it doesn't exist
                Directory.CreateDirectory(scriptFolderPath);

                // Generate script for all tables
                StringBuilder scriptBuilder = new StringBuilder();
                foreach (Table table in database.Tables)
                {
                    // Generate CREATE TABLE script
                    StringCollection scriptCollection = table.Script();
                    foreach (string line in scriptCollection)
                    {
                        scriptBuilder.AppendLine(line);
                    }

                    // Generate INSERT statements for data

                    using (SqlDataAdapter dataAdapter = new SqlDataAdapter($"SELECT * FROM {table.Name}", sqlConnection)) // Replace yourSqlConnection
                    {
                        DataTable dataTable = new DataTable();
                        dataAdapter.Fill(dataTable);

                        foreach (DataRow row in dataTable.Rows)
                        {
                            scriptBuilder.AppendLine(GenerateInsertStatement(table, row));
                            string insertStatement = GenerateInsertStatement(table, row);
                            Console.WriteLine($"Generated INSERT statement: {insertStatement}");
                        }
                    }


                    scriptBuilder.AppendLine("GO"); // Add a batch separator
                }

                // Save the script to a file
                string scriptFileName = $"{DateTime.Now.ToString("yyyyMMddHHmmss")}_{databaseName}_Tables.sql";
                string scriptFilePath = Path.Combine(scriptFolderPath, scriptFileName);
                File.WriteAllText(scriptFilePath, scriptBuilder.ToString());
                string localBackupResult = "Local backup saved at: " + scriptFilePath;
                Console.WriteLine(localBackupResult);
                if (scriptFileName == null)
                {
                   return $"Database backup dailed at";
                }
                else
                {

                    if (File.Exists(scriptFilePath))
                    {
                        byte[] fileData = File.ReadAllBytes(scriptFilePath);

                        string containerName = "uni-books-db-backups"; // Replace with the actual container name

                        BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

                        string blobName = $"{DateTime.Now.ToString("yyyyMMddHHmmss")}_{scriptFileName}"; // Add a timestamp to the blob name

                        containerClient.UploadBlob(blobName, new MemoryStream(fileData));

                        Console.WriteLine($"File '{scriptFileName}' uploaded to Azure Blob Storage as '{blobName}'.");
                    }
                    else
                    {
                        Console.WriteLine("Script file doesn't exist.");
                    }

                }

                return $"Database script for all tables in '{scriptFileName}' uploaded successfully";
                
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }
        // Function to generate INSERT statement
        private string GenerateInsertStatement(Table table, DataRow row)
        {
            StringBuilder insertBuilder = new StringBuilder();
            insertBuilder.Append($"INSERT INTO {table.Name} (");

            foreach (DataColumn column in row.Table.Columns)
            {
                insertBuilder.Append(column.ColumnName);
                if (column.Ordinal < row.Table.Columns.Count - 1)
                {
                    insertBuilder.Append(", ");
                }
            }

            insertBuilder.AppendLine(") VALUES (");

            foreach (DataColumn column in row.Table.Columns)
            {
                insertBuilder.Append(SqlString(row[column]));
                if (column.Ordinal < row.Table.Columns.Count - 1)
                {
                    insertBuilder.Append(", ");
                }
            }

            insertBuilder.Append(");");
            return insertBuilder.ToString();
        }

        //  function to convert values to SQL-safe strings
        private string SqlString(object value)
        {
            if (value == null || value == DBNull.Value)
            {
                return "NULL";
            }
            else if (value is string || value is char)
            {
                return $"'{value.ToString().Replace("'", "''")}'";
            }
            else if (value is DateTime)
            {
                return $"'{((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss")}'";
            }
            else
            {
                return value.ToString();
            }
        }
        private string GetCreateDatabaseScript(string databaseName)
        {
            return $@"
        CREATE DATABASE [{databaseName}]
        CONTAINMENT = NONE
        ON PRIMARY
        (
            NAME = N'{databaseName}',
            FILENAME = N'C:\Path\To\Data\{databaseName}.mdf',
            SIZE = 8192KB,
            FILEGROWTH = 65536KB
        )
        LOG ON
        (
            NAME = N'{databaseName}_log',
            FILENAME = N'C:\Path\To\Logs\{databaseName}_log.ldf',
            SIZE = 8192KB,
            FILEGROWTH = 65536KB
        );
        ALTER DATABASE [{databaseName}] SET COMPATIBILITY_LEVEL = 140;
        ALTER DATABASE [{databaseName}] SET ANSI_NULL_DEFAULT OFF;
        ALTER DATABASE [{databaseName}] SET ANSI_NULLS OFF;
        ALTER DATABASE [{databaseName}] SET ANSI_PADDING OFF;
        ALTER DATABASE [{databaseName}] SET ANSI_WARNINGS OFF;
        ALTER DATABASE [{databaseName}] SET ARITHABORT OFF;
        ALTER DATABASE [{databaseName}] SET AUTO_CLOSE OFF;
        -- Additional settings and schema creation go here
    ";
        }

        private bool CheckIfDatabaseExists(Server server, string databaseName)
        {
            return server.Databases.Contains(databaseName);
        }
        private bool CheckIfTableHasIdentity(Server server, string tableName)
        {
            Database database = server.Databases["UniBooks"]; // Replace with your database name
            Table table = database.Tables[tableName];

            foreach (Column column in table.Columns)
            {
                if (column.Identity)
                {
                    return true; // Table has an identity column
                }
            }

            return false; // Table does not have an identity column
        }

        public string RestoreDatabase(string connectionString)
        {
            connectionString = "Server=.\\SQLEXPRESS;Database=UniBooks;Trusted_Connection=True;MultipleActiveResultSets=True;Encrypt=False";
            try
            {
                // Set up SQL Server connection
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    ServerConnection serverConnection = new ServerConnection(sqlConnection);
                    Server server = new Server(serverConnection);

                    // Check if the database exists
                    bool databaseExists = CheckIfDatabaseExists(server, "UniBooks");

                    if (!databaseExists)
                    {
                        // Execute the script to create the database and restore data
                        string createDatabaseScript = GetCreateDatabaseScript("UniBooks");
                        server.ConnectionContext.ExecuteNonQuery(createDatabaseScript);
                    }

                    // Get the list of blob names from Azure Blob Storage
                    var blobNames = helpClient.GetBlobs().Select(blob => blob.Name).ToList();

                    if (blobNames.Any())
                    {
                        // Choose the first blob as the backup blob name
                        string backupBlobName = blobNames.First();

                        // Get the backup data from Azure Blob Storage
                        BlobClient blobClient = helpClient.GetBlobClient(backupBlobName);
                        BlobDownloadInfo blobDownloadInfo = blobClient.Download();

                        // Read the backup script from the blob
                        using (StreamReader reader = new StreamReader(blobDownloadInfo.Content))
                        {
                            string backupScript = reader.ReadToEnd();

                            // Find all table names mentioned in the backup script
                            List<string> tableNames = new List<string>();
                            int startIndex = backupScript.IndexOf("INSERT INTO [") + 13;
                            while (startIndex != -1)
                            {
                                int endIndex = backupScript.IndexOf("]", startIndex);
                                if (endIndex != -1)
                                {
                                    string tableName = backupScript.Substring(startIndex, endIndex - startIndex);
                                    tableNames.Add(tableName);
                                    startIndex = backupScript.IndexOf("INSERT INTO [", endIndex) + 13;
                                }
                                else
                                {
                                    break;
                                }
                            }

                            // Modify the script to include SET IDENTITY_INSERT for each identity table
                            foreach (string tableName in tableNames)
                            {
                                // Check if the table has an identity column
                                if (CheckIfTableHasIdentity(server, tableName))
                                {
                                    // Set IDENTITY_INSERT ON for the table
                                    backupScript = backupScript.Replace($"INSERT INTO [{tableName}]", $"SET IDENTITY_INSERT [{tableName}] ON;\nINSERT INTO [{tableName}]");

                                    // Set IDENTITY_INSERT OFF for the table
                                    backupScript = backupScript.Replace("GO", $"SET IDENTITY_INSERT [{tableName}] OFF;\nGO");
                                }
                            }

                            // Execute the modified backup script on the SQL Server
                            server.ConnectionContext.ExecuteNonQuery(backupScript);
                        }

                        return "Database restore completed successfully";
                    }
                    else
                    {
                        return "No backup blobs found in Azure Blob Storage.";
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        
    }
}
