using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _appDbContext;

        public EmployeeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);
        }

        public async Task<Employee[]> GetAllEmployeesAsync()
        {
            IQueryable<Employee> query = _appDbContext.Employees;
            return await query.ToArrayAsync();
        }

        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            IQueryable<Employee> query = _appDbContext.Employees.Where(e => e.Employee_ID == id);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Employee[]> GetEmployeeInputAsync(string input)
        {
            IQueryable<Employee> query = _appDbContext.Employees.Where(e => e.Name.Contains(input) || e.Surname.Contains(input));
            return await query.ToArrayAsync();
        }

        public async Task AddEmployeeAsync(Employee employee)
        {
            await _appDbContext.Employees.AddAsync(employee);
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            _appDbContext.Employees.Update(employee);
            await Task.CompletedTask; // You can also use `return Task.CompletedTask;`
        }

        public async Task DeleteEmployeeAsync(int Employee_ID)
        {
            var employee = await _appDbContext.Employees.FirstOrDefaultAsync(e => e.Employee_ID == Employee_ID);
            if (employee != null)
            {
                _appDbContext.Employees.Remove(employee);
            }
        }
    }
}
