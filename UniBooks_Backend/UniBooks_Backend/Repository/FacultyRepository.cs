using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend.Repository
{
    public class FacultyRepository : IFacultyRepository
    {
        private readonly AppDbContext _appDbContext;

        public FacultyRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);
        }

        //Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        //Get by ID
        public async Task<Faculty> GetFacultyAsync(int Faculty_ID)
        {
            IQueryable<Faculty> query = _appDbContext.Faculties.Where(c => c.Faculty_ID == Faculty_ID);
            return await query.FirstOrDefaultAsync();
        }

        //Get by string
        public async Task<Faculty[]> GetFacultyInputAsync(string input)
        {
            IQueryable<Faculty> query = _appDbContext.Faculties.Where(c => c.Faculty_Name.Contains(input));
            return await query.ToArrayAsync();
        }

        //Get All saved
        public async Task<Faculty[]> GetAllFacultiesAsync()
        {
            IQueryable<Faculty> query = _appDbContext.Faculties;
            return await query.ToArrayAsync();
        }
    }
}
