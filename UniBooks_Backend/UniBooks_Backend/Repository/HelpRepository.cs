using System;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.EntityFrameworkCore;

using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;


namespace UniBooks_Backend.Repositories
{
    public class HelpRepository : IHelpRepository
    {
            private readonly AppDbContext _appDbContext;

            //BLOB CODE
            private readonly BlobServiceClient _blobServiceClient;
            private BlobContainerClient client;
            public static readonly List<string> VideoExtensions = new List<string> { ".MP4", ".MOV" };


            public HelpRepository(AppDbContext appDbContext, BlobServiceClient blobServiceClient)
            {
                _appDbContext = appDbContext;
                _blobServiceClient = blobServiceClient;
                client = _blobServiceClient.GetBlobContainerClient("blobcontainerhelptip");
            }

            //OG HELP TIP CODE FUNCTIONS
            public void Add<T>(T entity) where T : class
            {
                _appDbContext.Add(entity);
            }
            public void Delete<T>(T entity) where T : class
            {
                _appDbContext.Remove(entity);
            }

            public async Task<Help[]> GetAllHelpTipsAsync()
            {
                IQueryable<Help> query = _appDbContext.Help;
                return await query.ToArrayAsync();
            }

            public async Task<Help> GetAHelpTipAsync(int Help_ID)
            {
                IQueryable<Help> query = _appDbContext.Help.Where(c => c.Help_ID == Help_ID);
                return await query.FirstOrDefaultAsync();
            }

            public async Task<Help[]> GetSearchedHelpTipAsync(string enteredQuery)
            {
                IQueryable<Help> query = _appDbContext.Help.Where(c => c.Name.Contains(enteredQuery)
                                                                    || c.Description.Contains(enteredQuery) );
                return await query.ToArrayAsync();
            }

            public async Task<bool> SaveChangesAsync()
            {
                return await _appDbContext.SaveChangesAsync() > 0;
            }

            //BLOB CODE 
            public async Task<BlobObject> GetBlobFile(string url)
            {
                //https://unibooksstorageacc.blob.core.windows.net/blobcontainerHelp/How To Whiten Teeth.mp4
                var fileName = new Uri(url).Segments.LastOrDefault();
                var blobClient = client.GetBlobClient(fileName);
                //check if this file exists
                if (await blobClient.ExistsAsync())
                {
                    BlobDownloadResult content = await blobClient.DownloadContentAsync();
                    var downloadedData = content.Content.ToStream();

                        var extension = Path.GetExtension(fileName);
                        return new BlobObject
                        {
                            Content = downloadedData,
                            ContentType = "video/" + extension.Remove(0, 1)
                        };
                 }
                else
                {
                    return null;
                }

            }

        public async Task<BlobObject> GetABlobFile(string fileName)
        {
            //var fileName = new Uri(url).Segments.LastOrDefault();
            // Replace spaces with underscores and remove other special characters
            var blobClient = client.GetBlobClient(fileName);
            //check if this file exists
            if (await blobClient.ExistsAsync())
            {
                BlobDownloadResult content = await blobClient.DownloadContentAsync();
                var downloadedData = content.Content.ToStream();

                if (VideoExtensions.Contains(Path.GetExtension(fileName.ToUpperInvariant())))
                {
                    var extension = Path.GetExtension(fileName);
                    return new BlobObject
                    {
                        Content = downloadedData,
                        ContentType = "video/" + extension.Remove(0, 1)
                    };
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

            public async Task<string> UploadBlobFile(string fileName, byte[] fileData)
            {
                // Check if the file data is empty
                if (fileData == null || fileData.Length == 0)
                    throw new ArgumentException("File data is empty.");

                // Check if the file is a video
                var fileExtension = Path.GetExtension(fileName).ToUpperInvariant();
                if (!VideoExtensions.Contains(fileExtension))
                    throw new ArgumentException("Only video files are allowed.");

                // Upload the video file to Blob storage
                var blobClient = client.GetBlobClient(fileName);
                var status = await blobClient.UploadAsync(new MemoryStream(fileData));

                // This returns a string of where exactly your file is stored
                return blobClient.Uri.AbsoluteUri;
            }

        public async void DeleteBlob(string path)
            {
                var fileName = new Uri(path).Segments.LastOrDefault();
                var blobClient = client.GetBlobClient(fileName);
                await blobClient.DeleteIfExistsAsync();

            }
            public async Task<List<string>> ListBlobs()
            {
                List<string> lst = new List<string>();
                await foreach (var blobItem in client.GetBlobsAsync())
                {
                    lst.Add(blobItem.Name);
                }
                return lst;
            }

        }
    }
