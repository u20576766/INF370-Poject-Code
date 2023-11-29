
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;
namespace UniBooks_Backend.Repository
{
    public class BookInventoryReportRepository: IBookInventoryReportRepository
    {
        private readonly AppDbContext _dbContext;

        public BookInventoryReportRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

       


        public async Task<List<Book_Inventory>> GetInventoryReportAsync()
        {
            return await _dbContext.Books
                .Include(b => b.PrescribedBook)
                .Include(b => b.Prices) // Include Prices navigation property
                .ToListAsync();
        }
    }
}

