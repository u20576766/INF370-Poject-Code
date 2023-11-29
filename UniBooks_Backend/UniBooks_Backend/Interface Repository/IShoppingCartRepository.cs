using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface IShoppingCartRepository
    {
        Task<List<ShoppingCart>> GetAllShoppingCartsAsync();

        Task<bool> SaveChangesAsync();

        void Add(ShoppingCart shoppingCart);

        void ClearShoppingAllCarts(int shoppingCartId);

        decimal CalculateSubTotal(ShoppingCart cart);

        void DeleteBookItem(int bookID);

        void DeleteEquipmentItem(int equipID);

        Task<Voucher> GetVoucherPercentageAsync(string? voucher_Code);

        Task<ShoppingCart> GetShoppingCartAsync(int cartId);

        Task<ShoppingCart_Equipment[]> GetCartEquipmentAsync(int studentId);

        Task<ShoppingCart_Book[]> GetCartBookAsync(int studentId);

        Task<ShoppingCart> GetShoppingCartByStudentIdAsync(int studentId);

        Task<ShoppingCart_Equipment> GetEquipmentItem(int equipid);

        Task<ShoppingCart_Book> GetBookItem(int bookid);

    }
}
