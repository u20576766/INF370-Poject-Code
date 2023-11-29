using System.Threading.Tasks;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public interface IPrescribedBookRepository
    {
        Task<Prescribed_Book[]> GetAllPrescribedBooksAsync();
        Task<Prescribed_Book> GetPrescribedBookByISBNAsync(string isbn);
        Task AddPrescribedBookAsync(Prescribed_Book prescribedBook);
        Task<bool> SaveChangesAsync();
        void DeletePrescribedBook(Prescribed_Book prescribedBook);
        Task<Prescribed_Book[]> GetPrescribedBooksBySearchAsync(string searchText);
    }
}
