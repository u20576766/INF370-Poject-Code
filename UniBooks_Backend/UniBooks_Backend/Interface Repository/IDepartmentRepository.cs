using UniBooks_Backend.Models;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend
{
    public interface IDepartmentRepository
    {
        Task<Department[]> GetAllDepartmentsAsync();

        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();
        Task<Department> GetDepartmentAsync(int Department_ID);
        Task<Department[]> GetDepartmentInputAsync(string input);
    }
}
