using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface IShoppingCart_BookRepository
    {
        void Add<T>(T entity) where T : class;

        Task<ShoppingCart_Book[]> GetShoppingCart_BooksAsync(int cartId);

        Task<bool> SaveChangesAsync();

        Task<ShoppingCart_Book> GetByBookIdAndCartId(int bookId, int cartId);

        Task AddOrUpdateBookInCart (ShoppingCart_Book cartBook);

        Task<decimal> CalculateCartTotal(int cartId);

        Task UpdateQuantity(int bookId, int cartId, int newQuantity);
    }
}
