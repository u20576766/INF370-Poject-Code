using UniBooks_Backend.Models;

namespace UniBooks_Backend
{
    public interface IFacultyRepository
    {
        Task<bool> SaveChangesAsync();

        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<Faculty[]> GetAllFacultiesAsync();
        Task<Faculty> GetFacultyAsync(int Faculty_ID);
        Task<Faculty[]> GetFacultyInputAsync(string input);
    }
}
