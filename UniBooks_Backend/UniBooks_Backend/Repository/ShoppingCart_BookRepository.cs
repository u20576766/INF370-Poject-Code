using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Repository
{
    public class ShoppingCart_BookRepository : IShoppingCart_BookRepository
    {
        private readonly AppDbContext _appDbContext;

        public ShoppingCart_BookRepository(AppDbContext appDbContext)
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
        public async Task<ShoppingCart_Book[]> GetShoppingCart_BooksAsync(int cartId)
        {
            IQueryable<ShoppingCart_Book> query = _appDbContext.ShoppingCartBook.Where(b => b.ShoppingCart_ID == cartId);
            return await query.ToArrayAsync();
        }


        public async Task<ShoppingCart_Book> GetByBookIdAndCartId(int bookId, int cartId)
        {
            return await _appDbContext.ShoppingCartBook.FirstOrDefaultAsync(sb => sb.Book_ID == bookId && sb.ShoppingCart_ID == cartId);
        }

        public async Task AddOrUpdateBookInCart(ShoppingCart_Book cartBook)
        {
            var existingCartBook = await GetByBookIdAndCartId(cartBook.Book_ID, cartBook.ShoppingCart_ID);
            if (existingCartBook != null)
            {
                existingCartBook.Quantity += cartBook.Quantity;
            }
            else
            {
                _appDbContext.ShoppingCartBook.Add(cartBook);
            }
        }

        public async Task UpdateQuantity(int bookId, int cartId, int newQuantity)
        {
            var cartBook = await _appDbContext.ShoppingCartBook.FirstOrDefaultAsync(sb => sb.Book_ID == bookId && sb.ShoppingCart_ID == cartId);
            if (cartBook != null)
            {
                cartBook.Quantity = newQuantity;
                await _appDbContext.SaveChangesAsync();
            }
        }


        // Add this method to your ShoppingCart_BookRepository class
        public async Task<decimal> CalculateCartTotal(int cartId)
        {
            var cartBooks = await _appDbContext.ShoppingCartBook
                .Where(sb => sb.ShoppingCart_ID == cartId)
                .Include(sb => sb.Books)
                .ToListAsync();

            decimal total = 0;

            foreach (var cartBook in cartBooks)
            {
                decimal itemTotal = cartBook.Quantity * cartBook.Price; // Assuming Books has a property Price
                total += itemTotal;
            }

            return total;
        }



    }
}
