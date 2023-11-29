using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IMakeSaleRepository
    {
        Task<List<Payment_Type>> GetAllPaymentTypesAsync();
        Task<bool> SaveChangesAsync();
        void Delete<T>(T entity) where T : class;
        void Add<T>(T entity) where T : class;
        void AddWalkInSale(WalkInSale s);

        Task UpdateEquipmentQuantityAsync(int equipmentId, int quantityChange);

        Task UpdateBookQuantityAsync(int bookId, int quantityChange);

        Task<List<ViewSaleViewModel>> GetSaleSummary();
    }
}
