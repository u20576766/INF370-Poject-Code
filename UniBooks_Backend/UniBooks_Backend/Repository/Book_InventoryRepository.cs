using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class Book_InventoryRepository: IBook_InventoryRepository
    {
        private readonly AppDbContext _context;

        public Book_InventoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasRelatedRecordsAsync(Book_Inventory book)
        {
            // Check if the book has related records in orders
            bool hasRelatedOrders = await _context.OrderLine
                .AnyAsync(ol => ol.Book_Inventory.Book_ID == book.Book_ID);

            // Check if the book has related records in sales
            bool hasRelatedSales = await _context.walkinsalebooks
                .AnyAsync(sale => sale.Books.Book_ID == book.Book_ID);

            // Return true if there are related records in orders or sales
            return hasRelatedOrders || hasRelatedSales;
        }

        public async Task<IEnumerable<Book_Inventory>> GetAllBooksAsync()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<Book_Inventory> GetBookByISBNAsync(string isbn)
        {
            // Fetch the book by its ISBN and eagerly load the PrescribedBook navigation property
            return await _context.Books
                .Include(book => book.PrescribedBook)
                .FirstOrDefaultAsync(book => book.ISBN == isbn);
        }


        public async Task AddBookAsync(Book_Inventory book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBookAsync(Book_Inventory book)
        {
            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBookAsync(Book_Inventory book)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> BookExistsAsync(string isbn)
        {
            return await _context.Books.AnyAsync(b => b.ISBN == isbn);
        }

        public async Task AddPrice(Price price)
        {
            _context.Prices.Add(price);
            await _context.SaveChangesAsync();
        }

        public async Task<Price> GetPriceByBookIdAsync(int bookId)
        {
            return await _context.Prices.FirstOrDefaultAsync(p => p.Book_ID == bookId);
        }

        // Update Price method
        public async Task UpdatePriceAsync(Price price)
        {
            _context.Prices.Update(price);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Price>> GetPricesByBookIdAsync(int bookId)
        {
            return await _context.Prices
                .Where(p => p.Book_ID == bookId)
                .ToListAsync();
        }
        public async Task DeletePricesAsync(Book_Inventory book)
        {
            
            var pricesToDelete = await _context.Prices
                .Where(p => p.Books.Book_ID == book.Book_ID)
                .ToListAsync();

            if (pricesToDelete.Count > 0)
            {
                _context.Prices.RemoveRange(pricesToDelete);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteModulesAsync(Module module)
        {
            // Assuming there's a Modules DbSet in your DbContext
          
        }
        public async Task<Book_Inventory> GetBookByIdAsync(int bookId)
        {
            return await _context.Books.FirstOrDefaultAsync(b => b.Book_ID == bookId);
        }
    }
}
