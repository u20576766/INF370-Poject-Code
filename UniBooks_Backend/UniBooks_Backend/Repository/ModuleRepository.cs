using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend.Repository
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly AppDbContext _appDbContext;

        public ModuleRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        //Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }


        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);

        }

        public async Task<Module[]> GetAllModulesAsync()
        {
            IQueryable<Module> query = _appDbContext.Modules;
            return await query.ToArrayAsync();
        }

        //Get by ID
        public async Task<Module> GetModuleAsync(int ModuleID)
        {
            IQueryable<Module> query = _appDbContext.Modules.Where(c => c.Module_ID == ModuleID);
            return await query.FirstOrDefaultAsync();
        }

        //Get by string
        public async Task<Module[]> GetModuleInputAsync(string input)
        {
            IQueryable<Module> query = _appDbContext.Modules.Where(c => c.Module_Code.Contains(input) || c.Description.Contains(input));
            return await query.ToArrayAsync();
        }

        public void Delete(Module existingModule)
        {
            throw new NotImplementedException();
        }

        public async Task<Module> GetModuleByCodeAsync(string moduleCode)
        {
            IQueryable<Module> query = _appDbContext.Modules.Where(c => c.Module_Code == moduleCode);
            return await query.FirstOrDefaultAsync();
        }


    }
}
