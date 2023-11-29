using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.InterfaceRepositories
{
    public interface IBlobRepository
    {
        Task<BlobObject> GetBlobFile(string name);
        //Task<string> UploadBlobFile(string fileName, string filePath);
        void DeleteHelpBlob(string name);
        Task<List<string>> ListBlobs();
        Task<string> UploadBlobFile(string fileName, byte[] fileData);
        Task<string> GenerateBlobStreamLinkAsync(string fileName);
        Task<string> UploadNewsletterBlob(string fileName, byte[] fileData);

    }
}
