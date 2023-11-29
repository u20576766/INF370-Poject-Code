using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Repository
{
    public class ShoppingCart_EquipmentRepository : IShoppingCart_EquipmentRepository
    {
        private readonly AppDbContext _appDbContext;

        public ShoppingCart_EquipmentRepository(AppDbContext appDbContext)
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

        //Get All
        public async Task<ShoppingCart_Equipment[]> GetShoppingCart_EquipmentsAsync(int cartId)
        {
            IQueryable<ShoppingCart_Equipment> query = _appDbContext.ShoppingCartEquipment.Where(c => c.ShoppingCart_ID == cartId);
            return await query.ToArrayAsync();
        }

        public async Task<ShoppingCart_Equipment> GetByEquipmentIdAndCartId(int equipmentId, int cartId)
        {
            return await _appDbContext.ShoppingCartEquipment.FirstOrDefaultAsync(sb => sb.Equipment_ID == equipmentId && sb.ShoppingCart_ID == cartId);
        }

        public async Task AddOrUpdateEquipmentInCart(ShoppingCart_Equipment cartEquipment)
        {
            var existingCartEquipment = await GetByEquipmentIdAndCartId(cartEquipment.Equipment_ID, cartEquipment.ShoppingCart_ID);
            if (existingCartEquipment != null)
            {
                existingCartEquipment.Quantity += cartEquipment.Quantity;
            }
            else
            {
                _appDbContext.ShoppingCartEquipment.Add(cartEquipment);
            }
        }

    }
}