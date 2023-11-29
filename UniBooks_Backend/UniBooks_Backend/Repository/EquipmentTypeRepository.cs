using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class EquipmentTypeRepository : IEquipmentTypeRepository
    {
        private readonly AppDbContext _appDbContext;

        public EquipmentTypeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }

        //Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        //Get All saved
        public async Task<Equipment_Type[]> GetAllEquipmentTypesAsync()
        {
            IQueryable<Equipment_Type> query = _appDbContext.EquipmentType;
            return await query.ToArrayAsync();
        }

        //Get by ID
        public async Task<Equipment_Type> GetEquipmentTypeAsync(int EquipmentType_ID)
        {
            IQueryable<Equipment_Type> query = _appDbContext.EquipmentType.Where(c => c.EquipmentType_ID == EquipmentType_ID);
            return await query.FirstOrDefaultAsync();
        }

        //Get by string
        public async Task<Equipment_Type[]> GetEquipmentTypeInputAsync(string input)
        {
            IQueryable<Equipment_Type> query = _appDbContext.EquipmentType.Where(c => c.Name.Contains(input) || c.Description.Contains(input));
            return await query.ToArrayAsync();
        }

        //Save changes to database
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }
    }

}
