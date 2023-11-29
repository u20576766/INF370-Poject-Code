using System.Collections.Generic;
using System.Threading.Tasks;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IEmployeeRepository
    {
        Task<Employee[]> GetAllEmployeesAsync();
        Task<Employee> GetEmployeeByIdAsync(int Employee_ID);
        Task<Employee[]> GetEmployeeInputAsync(string input);
        Task AddEmployeeAsync(Employee employee);
        Task UpdateEmployeeAsync(Employee employee);
        Task DeleteEmployeeAsync(int Employee_ID);
        Task<bool> SaveChangesAsync();
    }
}
