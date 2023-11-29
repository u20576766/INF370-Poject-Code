using Microsoft.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repositories
{
    public class EmployeeTypeRepository: IEmployeeTypeRepository
    {
        private readonly AppDbContext _appDbContext;

        public EmployeeTypeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // Add item
        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }

        // Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        // Get All saved
        public async Task<Employee_Type[]> GetAllEmployeeTypesAsync()
        {
            IQueryable<Employee_Type> query = _appDbContext.EmployeeTypes;
            return await query.ToArrayAsync();
        }

        // Get by ID
        public async Task<Employee_Type> GetAnEmployeeTypeAsync(int employeeTypeId)
        {
            IQueryable<Employee_Type> query = _appDbContext.EmployeeTypes.Where(c => c.Employee_Type_ID == employeeTypeId);
            return await query.FirstOrDefaultAsync();
        }

        // Get by string
        public async Task<Employee_Type[]> SearchEmployeeTypeAsync(string input)
        {
            IQueryable<Employee_Type> query = _appDbContext.EmployeeTypes.Where(c => c.Name.Contains(input) );
            return await query.ToArrayAsync();
        }

        // Get by string
        public async Task<Employee_Type> CheckIfEmpTypeExists(string empTypeName)
        {
            IQueryable<Employee_Type> query = _appDbContext.EmployeeTypes.Where(c => c.Name == empTypeName);
            return await query.FirstOrDefaultAsync();
        }

        // Save changes to database
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }
    }
}
