using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface IShoppingCart_EquipmentRepository
    {
        void Add<T>(T entity) where T : class;

        Task<ShoppingCart_Equipment[]> GetShoppingCart_EquipmentsAsync(int cartId);

        Task<bool> SaveChangesAsync();

        Task<ShoppingCart_Equipment> GetByEquipmentIdAndCartId(int equipmentId, int cartId);

        Task AddOrUpdateEquipmentInCart(ShoppingCart_Equipment cartEquipment);

        
    }
}
