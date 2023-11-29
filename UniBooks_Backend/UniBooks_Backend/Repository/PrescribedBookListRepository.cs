using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class PrescribedBookListRepository : IPrescribedBookListRepository
    {
        private readonly AppDbContext _appDbContext;

        public PrescribedBookListRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void AddPrescribedBookList(Prescribed_Book_List prescribedBookList)
        {
            _appDbContext.PrescribedBookList.Add(prescribedBookList);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public List<Prescribed_Book> GetPrescribedBooksByListId(int listId)
        {
            return _appDbContext.PrescribedBookList
                .Include(p => p.PrescribedBook)
                .Where(p => p.Prescribed_Book_List_ID == listId)
                .SelectMany(p => p.PrescribedBook)
                .ToList();
        }

        public void RemovePrescribedBooks(List<Prescribed_Book> prescribedBooks)
        {
            _appDbContext.PrescribedBook.RemoveRange(prescribedBooks);
        }

        public async Task<Prescribed_Book> GetPrescribedBookByISBNAsync(string isbn)
        {
            return await _appDbContext.PrescribedBook
                .FirstOrDefaultAsync(p => p.ISBN == isbn);
        }

        public async Task<string> GetModuleCodeByModuleIdAsync(int moduleId)
        {
            return await _appDbContext.Modules
                .Where(m => m.Module_ID == moduleId)
                .Select(m => m.Module_Code)
                .FirstOrDefaultAsync();
        }
    }
}
