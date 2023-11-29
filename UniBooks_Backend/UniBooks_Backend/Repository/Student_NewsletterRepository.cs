using Azure.Storage.Blobs;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repositories
{
    public class Student_NewsletterRepository : IStudent_NewsletterRepository
    {
        private readonly AppDbContext _appDbContext;

        public Student_NewsletterRepository(AppDbContext appDbContext, BlobServiceClient blobServiceClient)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);

        }
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;

        }

    }
}
