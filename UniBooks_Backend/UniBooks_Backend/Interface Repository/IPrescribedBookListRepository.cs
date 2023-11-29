using System.Collections.Generic;
using System.Threading.Tasks;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public interface IPrescribedBookListRepository
    {
        void AddPrescribedBookList(Prescribed_Book_List prescribedBookList);
        Task<bool> SaveChangesAsync();
        List<Prescribed_Book> GetPrescribedBooksByListId(int listId);
        void RemovePrescribedBooks(List<Prescribed_Book> prescribedBooks);
        Task<Prescribed_Book> GetPrescribedBookByISBNAsync(string isbn);
        Task<string> GetModuleCodeByModuleIdAsync(int moduleId);
    }
}
