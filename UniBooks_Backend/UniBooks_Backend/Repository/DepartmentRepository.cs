using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend.Repository
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _appDbContext;

        public DepartmentRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        //Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);
        }

        public async Task<Department[]> GetAllDepartmentsAsync()
        {
            IQueryable<Department> query = _appDbContext.Departments;
            return await query.ToArrayAsync
                ();
        }

        //Get by ID
        public async Task<Department> GetDepartmentAsync(int Department_ID)
        {
            IQueryable<Department> query = _appDbContext.Departments.Where(c => c.Department_ID == Department_ID);
            return await query.FirstOrDefaultAsync();
        }

        //Get by string
        public async Task<Department[]> GetDepartmentInputAsync(string input)
        {
            IQueryable<Department> query = _appDbContext.Departments.Where(c => c.Department_Name.Contains(input));
            return await query.ToArrayAsync();
        }
    }
}
