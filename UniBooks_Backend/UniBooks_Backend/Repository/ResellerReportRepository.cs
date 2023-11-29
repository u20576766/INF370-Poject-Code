using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;

using UniBooks_Backend.Models;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repository;

namespace UniBooks_Backend.Repository
{
    public class ResellerReportRepository: IResellerReportRepository
    {
        private readonly AppDbContext _appDbContext;
        public ResellerReportRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public ResellerReportViewModel GetResellerReport()
        {
            // Implement the logic to gather data and populate the view model
            // Use LINQ queries to retrieve the necessary data from your database

            // Example:
            var mostResoldBook = _appDbContext.ResellerBook
                .GroupBy(rb => rb.ISBN)
                .OrderByDescending(group => group.Count())
                .FirstOrDefault();

            var leastResoldBook = _appDbContext.ResellerBook
                .GroupBy(rb => rb.ISBN)
                .OrderBy(group => group.Count())
                .FirstOrDefault();

            // Populate other sections of the report as well

            var report = new ResellerReportViewModel
            {
                MostResoldBookCount = mostResoldBook?.Count() ?? 0,
                MostResoldBookISBN = mostResoldBook?.Key ?? "",

                LeastResoldBookCount = leastResoldBook?.Count() ?? 0,
                LeastResoldBookISBN = leastResoldBook?.Key ?? "",

                // Populate other properties
            };

            return report;
        }
    }
}
