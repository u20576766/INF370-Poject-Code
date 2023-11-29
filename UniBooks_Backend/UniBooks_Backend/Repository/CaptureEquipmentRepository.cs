using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class CaptureEquipmentRepository:ICaptureEquipment
    {
        private readonly AppDbContext _appDbContext;

        public CaptureEquipmentRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        //get supplier 
        public async Task<Supplier>GetSupplierByIdAsync(int suppid)
        {
            IQueryable<Supplier>query = _appDbContext.Suppliers.Where( i => i.Supplier_ID ==suppid)
                ;
            return await query.FirstOrDefaultAsync();

        }

        //Saving  changes
        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                return await _appDbContext.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                // Log the exception for debugging purposes
                // This will help identify the exact cause of the issue
                Console.WriteLine($"Error saving changes: {ex}");

                // Optionally, you can also include the error message in the return value
                throw;
            }
        }

        //Add new entity
        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);
        }
        public void AddEquipmentOrderCaptured(EquipmentOrder_Captured equipmentOrderCaptured)
        {
            _appDbContext.EquipmentOrder_CapturedEntity.Add(equipmentOrderCaptured);
        }




        //find order 
        public async Task<EquipmentOrder> GetEquipmentOrderByIdAsync(int orderid)
        {
            IQueryable<EquipmentOrder> query = _appDbContext.EquipmentOrders.Where(i => i.EquipmentOrder_ID == orderid)
                ;
            return await query.FirstOrDefaultAsync();

        }
        //find equipment
        public async Task<Equipment> GetEquipmentByIdAsync(int equipmentid)
        {
            IQueryable<Equipment> query = _appDbContext.Equipments.Where(i => i.Equipment_ID == equipmentid);
            return await query.FirstOrDefaultAsync();

        }

        public async Task<Employee>GetEmployeeByIdAsync(int empid)
        {
            IQueryable<Employee> query = _appDbContext.Employees.Where(i => i.Employee_ID == empid);
            return await query.FirstOrDefaultAsync();
        }
        public void Update(Equipment equipment)
        {
            _appDbContext.Equipments.Update(equipment);
        }

        
            public async Task<EquipmentOrder> GetLatestEquipmentOrderAsync()
            {
                return await _appDbContext.EquipmentOrders.OrderByDescending(k => k.EquipmentOrder_ID)
                    .FirstOrDefaultAsync();
            }

        



    }
}
