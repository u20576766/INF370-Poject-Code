using System.Collections.Generic;
using System.Threading.Tasks;
using UniBooks_Backend.Models;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IBook_InventoryRepository
    {
        Task<IEnumerable<Book_Inventory>> GetAllBooksAsync();
        Task<Book_Inventory> GetBookByISBNAsync(string isbn);
        Task AddBookAsync(Book_Inventory book);
        Task UpdateBookAsync(Book_Inventory book);
        Task DeleteBookAsync(Book_Inventory book);
        Task<bool> BookExistsAsync(string isbn);
        Task AddPrice(Price price);
        Task<Price> GetPriceByBookIdAsync(int bookId);
        Task UpdatePriceAsync(Price price);
        Task<List<Price>> GetPricesByBookIdAsync(int bookId);
        Task<Book_Inventory> GetBookByIdAsync(int bookId);
        Task DeletePricesAsync(Book_Inventory book);
        Task<bool> HasRelatedRecordsAsync(Book_Inventory book);


    }
}
