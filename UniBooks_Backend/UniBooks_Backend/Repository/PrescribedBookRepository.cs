using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class PrescribedBookRepository : IPrescribedBookRepository
    {
        private readonly AppDbContext _appDbContext;

        public PrescribedBookRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<Prescribed_Book[]> GetAllPrescribedBooksAsync()
        {
            return await _appDbContext.PrescribedBook.ToArrayAsync();
        }

        public async Task<Prescribed_Book> GetPrescribedBookByISBNAsync(string isbn)
        {
            return await _appDbContext.PrescribedBook.FirstOrDefaultAsync(b => b.ISBN == isbn);
        }

        public async Task AddPrescribedBookAsync(Prescribed_Book prescribedBook)
        {
            await _appDbContext.PrescribedBook.AddAsync(prescribedBook);
        }

        public void DeletePrescribedBook(Prescribed_Book prescribedBook)
        {
            _appDbContext.PrescribedBook.Remove(prescribedBook);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<Prescribed_Book[]> GetPrescribedBooksBySearchAsync(string searchText)
        {
            return await _appDbContext.PrescribedBook
                .Where(b => b.Title.Contains(searchText) || b.AuthorName.Contains(searchText) || b.PublisherName.Contains(searchText))
                .ToArrayAsync();
        }
    }
}
