using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IEquipmentRepository
    {
        void AddEquipment(Equipment equipment);
        void AddPrice(Price price);
        Task<bool> SaveChangesAsync();

        Task<Equipment[]> GetEquipmentByString(string text);
        void Delete<T>(T entity) where T : class;
        Task<Equipment> GetEquipmentByIDAsync(int Equipment_ID);
        Task<Price[]> GetPriceByEquipmentIDAsync(int equipmentId);
        Task<List<GetEquipmentViewModel>> GetAllEquipmentViewModels();
        Task<Equipment[]> GetAllEquipments();
        Task<Price> GetOnePriceByEquipmentIDAsync(int equipmentId);



        Task<bool> HasRelatedRecordsAsync(Equipment equipment);
        Task<List<Equipment>> GetAllEquipmentsWithPrices();
        
    }
}
