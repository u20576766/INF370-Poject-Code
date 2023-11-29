using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Model;
using System.Linq;
using System.Collections.Generic;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class EquipmentRepository : IEquipmentRepository
    {
        private readonly AppDbContext
            _appDbContext;

        public EquipmentRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<bool> HasRelatedRecordsAsync(Equipment equipment)
        {
            // Check if the equipment is connected to sales
            bool hasSales = await _appDbContext.WalkinsaleEquipment
                .AnyAsync(e => e.Equipment_ID == equipment.Equipment_ID);

            // Check if the equipment is connected to orders
            bool hasOrders = await _appDbContext.OrderLine
                .AnyAsync(ol => ol.Equipment != null && ol.Equipment.Equipment_ID == equipment.Equipment_ID);

            return hasSales || hasOrders;
        }
        //add new equipment and price 
        public void AddEquipment(Equipment equipment)
        {
            _appDbContext.Equipments.Add(equipment);
        }

        public void AddPrice(Price price)
        {
            _appDbContext.Prices.Add(price);
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        //delete equipment 
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }








        public async Task<List<GetEquipmentViewModel>> GetAllEquipmentViewModels()
        {
            var result = await _appDbContext.VATs
                .Where(v => v.VAT_ID == 1)
                .Select(v => v.Percent)
                .FirstOrDefaultAsync();

            var equipmentList = await (from e in _appDbContext.Equipments
                                       join et in _appDbContext.EquipmentType on e.EquipmentType_ID equals et.EquipmentType_ID
                                       join m in _appDbContext.Modules on e.Module_ID equals m.Module_ID
                                       select new GetEquipmentViewModel
                                       {
                                           Equipment_ID = e.Equipment_ID,
                                           Name = e.Name,
                                           Description = e.Description,
                                           Quantity_On_Hand = e.Quantity_On_Hand,
                                           Image = e.Image,
                                           EquipmentType_ID = et.EquipmentType_ID,
                                           EquipmentType_Name = et.Name,
                                           Price_ID = e.Prices.FirstOrDefault().Price_ID,
                                           AmountWithVAT = e.Prices.FirstOrDefault().Amount * ((100 + result) / 100), // Corrected
                                           AmountWithoutVAT = e.Prices.FirstOrDefault().Amount,
                                           VATAmount = e.Prices.FirstOrDefault().Amount * (result / 100), // Corrected
                                           Module_Code = m.Module_Code,
                                           Module_ID = m.Module_ID
                                       }).ToListAsync();

            return equipmentList;
        }


        //search by string 
        public async Task<Equipment[]> GetEquipmentByString(string text)
        {
            IQueryable<Equipment> query = _appDbContext.Equipments.Where(y => y.Name.Contains(text) || y.Description.Contains(text));

            return await query.ToArrayAsync();
        }

        //get all the equipment 
        public async Task<Equipment[]> GetAllEquipments()
        {
            IQueryable<Equipment> query = _appDbContext.Equipments;
            return await query.ToArrayAsync();
        }

        //search by id 
        public async Task<Equipment> GetEquipmentByIDAsync(int Equipment_ID)
        {
            // Use Include to eager load the "Prices", "Modules", and "EquipmentType" related to the equipment object
            var equipment = await _appDbContext.Equipments
                .Include(e => e.Prices)
                .Include(e => e.Modules)
            .Include(e => e.Equipment_Types)
                .FirstOrDefaultAsync(e => e.Equipment_ID == Equipment_ID);

            return equipment;

        }

        public async Task<List<Equipment>> GetAllEquipmentsWithPrices()
        {
            // Use Include to eager load the "Prices", "Module", and "EquipmentType" related to each equipment object
            var equipmentList = await _appDbContext.Equipments
                .Include(e => e.Prices)
                .Include(e => e.Modules)
                .Include(e => e.Equipment_Types)
                .ToListAsync();

            return equipmentList;
        }

        public async Task<Price>GetOnePriceByEquipmentIDAsync(int equipmentId)
        {
            return await _appDbContext.Prices.Where(p => p.Equipment_ID == equipmentId).FirstOrDefaultAsync(); 
        }

        public async Task<Price[]> GetPriceByEquipmentIDAsync(int equipmentId)
        {
            return await _appDbContext.Prices
                .Where(p => p.Equipment_ID == equipmentId)
                .ToArrayAsync();
        }




    }
}