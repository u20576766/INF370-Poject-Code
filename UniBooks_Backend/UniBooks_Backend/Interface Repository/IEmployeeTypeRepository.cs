using UniBooks_Backend.Models;

namespace UniBooks_Backend.InterfaceRepositories
{
    public interface IEmployeeTypeRepository
    {
        void Add<T>(T entity) where T : class;

        // Deleting from repository
        void Delete<T>(T entity) where T : class;

        // Saving to repository
        Task<bool> SaveChangesAsync();

        // Getting all/specific Employee Types from repository
        Task<Employee_Type[]> GetAllEmployeeTypesAsync();
        Task<Employee_Type> GetAnEmployeeTypeAsync(int employeeTypeId);
        Task<Employee_Type[]> SearchEmployeeTypeAsync(string input);
        Task<Employee_Type> CheckIfEmpTypeExists(string empTypeName);

    }
}
