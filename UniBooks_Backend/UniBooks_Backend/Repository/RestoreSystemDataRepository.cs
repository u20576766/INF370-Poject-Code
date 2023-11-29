using System;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Repository;
using System.IO;
using Microsoft.SqlServer.Management.Common;
using Microsoft.SqlServer.Management.Smo;
using Azure.Storage.Blobs;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.Models;
using Microsoft.EntityFrameworkCore;
using Azure.Storage.Blobs.Models;

public class DatabaseRestoreRepository
{
    private readonly BlobServiceClient _blobServiceClient;
    private BlobContainerClient helpClient;
    private readonly BlobRepository _blobRepository;
    private readonly AppDbContext _appDbContext;
    public DatabaseRestoreRepository(AppDbContext appDbContext,BlobServiceClient blobServiceClient, BlobRepository blobRepository)
    {
        _appDbContext = appDbContext;
        _blobRepository = blobRepository;
        _blobServiceClient = blobServiceClient;
        helpClient = _blobServiceClient.GetBlobContainerClient("uni-books-db-backups");

    }
    public async Task RestoreDatabaseAsync(string backupUrl)
    {
       
        try
        {
           
           
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            throw;
        }
    }

    private void Restore_PercentComplete(object sender, PercentCompleteEventArgs e)
    {
        // You can handle the progress of the restoration here
        Console.WriteLine($"Restoration progress: {e.Percent}");
    }

    internal Task RestoreDatabaseAsync()
    {
        throw new NotImplementedException();
    }
}


