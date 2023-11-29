using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;


namespace UniBooks_Backend.InterfaceRepositories
{
    public interface IHelpRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

        Task<Help[]> GetAllHelpTipsAsync();
        Task<Help> GetAHelpTipAsync(int Help_ID);


        Task<Help[]> GetSearchedHelpTipAsync(string enteredQuery);

        Task<BlobObject> GetBlobFile(string name);
        Task<BlobObject> GetABlobFile(string fileName);
        Task<string> UploadBlobFile(string fileName, byte[] fileData);

        void DeleteBlob(string name);
        Task<List<string>> ListBlobs();
    }
}
