using UniBooks_Backend.Model;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface ISupplierRepository
    {
        //Adding to repository
        void Add<T>(T entity) where T : class;

        //Deleting from repository
        void Delete<T>(T entity) where T : class;

        //Saving to repository
        Task<bool> SaveChangesAsync();


        //Getting all/specific Equipment Type from repository
        Task<Supplier[]> GetAllSuppliersAsync();
        Task<Supplier> GetSupplierAsync(int Supplier_ID);
        Task<Supplier[]> GetSupplierInputAsync(string input);
    }
}
