using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface ICaptureEquipment
    {
        Task<EquipmentOrder> GetLatestEquipmentOrderAsync();
        void AddEquipmentOrderCaptured(EquipmentOrder_Captured equipmentOrderCaptured);
        void Add<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<Supplier> GetSupplierByIdAsync(int suppid);
        Task<EquipmentOrder> GetEquipmentOrderByIdAsync(int orderid);
        Task<Equipment> GetEquipmentByIdAsync(int equipmentid);
        void Update(Equipment equipment);
        Task<Employee> GetEmployeeByIdAsync(int empid);
    }
}
