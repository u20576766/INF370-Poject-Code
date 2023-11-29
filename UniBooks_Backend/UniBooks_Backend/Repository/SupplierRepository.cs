using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class SupplierRepository:ISupplierRepository
    {
        private readonly AppDbContext _appDbContext;

        public SupplierRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        //Add item
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
        public async Task<Supplier[]> GetAllSuppliersAsync()
        {
            IQueryable<Supplier> query = _appDbContext.Suppliers;
            return await query.ToArrayAsync();
        }

        //Get by ID
        public async Task<Supplier> GetSupplierAsync(int Supplier_ID)
        {
            IQueryable<Supplier> query = _appDbContext.Suppliers.Where(c => c.Supplier_ID == Supplier_ID);
            return await query.FirstOrDefaultAsync();
        }

        //Get by ID
        public async Task<Supplier[]> GetSupplierInputAsync(string input)
        {

            IQueryable<Supplier> query = _appDbContext.Suppliers.Where(c => c.Supplier_Name.Contains(input) || c.Supplier_Address.Contains(input) || c.Supplier_Email.Contains(input) || c.Supplier_CellNumber.Contains(input));
            return await query.ToArrayAsync();
        }



        //Save changes to database
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }
    }
}
