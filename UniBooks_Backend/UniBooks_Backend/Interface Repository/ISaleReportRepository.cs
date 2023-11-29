using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface ISaleReportRepository
    {
        Task<SaleReportViewModel> GetSalesReportAsync();
    }
}
