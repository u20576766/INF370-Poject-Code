using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Security.Policy;

using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;
using Azure.Storage.Sas;
using Azure.Storage;

namespace UniBooks_Backend.Repositories
{
    public class BlobRepository : IBlobRepository
    {
        private readonly BlobServiceClient _blobServiceClient;
        private BlobContainerClient helpClient, newsletterClient;
        public static readonly List<string> VideoExtensions = new List<string> { ".MP4", ".MOV" };

        public BlobRepository(BlobServiceClient blobServiceClient, AppDbContext appDbContext)
        {
            _blobServiceClient = blobServiceClient;
            helpClient = _blobServiceClient.GetBlobContainerClient("blobcontainerhelptip");
            newsletterClient = _blobServiceClient.GetBlobContainerClient("newslettercontainer");

        }

        public async Task<BlobObject> GetBlobFile(string url)
        {
            var fileName = new Uri(url).Segments.LastOrDefault();
            var blobClient = helpClient.GetBlobClient(fileName);
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

        public async Task<string> GenerateBlobStreamLinkAsync(string fileName)
        {
            var blobClient = helpClient.GetBlobClient(fileName);
            BlobSasBuilder sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = "blobcontainerhelptip",
                BlobName = fileName,
                Resource = "b",
                StartsOn = DateTime.UtcNow,
                ExpiresOn = DateTime.UtcNow.AddHours(1),
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            UriBuilder sasUri = new UriBuilder(blobClient.Uri)
            {
                Query = sasBuilder.ToSasQueryParameters(new StorageSharedKeyCredential("unibooksstorageacc", "H1i/w5q/aqlY7WnwpKyl3TFz+dPvWTn2mrzPYSBNisf8AHZwPDhwgTv4M0A8rlzf5v/9VP7VyDSz+ASt3qZVAQ==")).ToString()
            };

            return sasUri.Uri.ToString();
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
            var blobClient = helpClient.GetBlobClient(fileName);
            var status = await blobClient.UploadAsync(new MemoryStream(fileData));

            // This returns a string of where exactly your file is stored
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<string> UploadNewsletterBlob(string fileName, byte[] fileData)
        {
            // Check if the file data is empty
            if (fileData == null || fileData.Length == 0)
                throw new ArgumentException("File data is empty.");

            // Upload the file to Blob storage
            var blobClient = newsletterClient.GetBlobClient(fileName);
            var status = await blobClient.UploadAsync(new MemoryStream(fileData));

            // This returns a string of where exactly your file is stored
            return blobClient.Uri.AbsoluteUri;
        }


        public async void DeleteHelpBlob(string path)
        {
            var fileName = path;
            //new Uri(path).Segments.LastOrDefault();
            var blobClient = helpClient.GetBlobClient(fileName);
            await blobClient.DeleteIfExistsAsync();

        }
        public async Task<List<string>> ListBlobs()
        {
            List<string> lst = new List<string>();
            await foreach (var blobItem in helpClient.GetBlobsAsync())
            {
                lst.Add(blobItem.Name);
            }
            return lst;
        }
        public async Task<string> UploadSQLFile(string containerName, string fileName, byte[] fileData)
        {
            // Check if the file data is empty
            if (fileData == null || fileData.Length == 0)
                throw new ArgumentException("File data is empty.");

            // Get the blob container client
            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            if (!await blobContainerClient.ExistsAsync())
            {
                // Create the container if it doesn't exist
                await blobContainerClient.CreateAsync();
            }

            // Upload the file to the container
            var blobClient = blobContainerClient.GetBlobClient(fileName);
            var status = await blobClient.UploadAsync(new MemoryStream(fileData));

            // This returns a string of where exactly your file is stored
            return blobClient.Uri.AbsoluteUri;
        }



    }
}