using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleReportController : ControllerBase
    {
        private readonly ISaleReportRepository _saleReportRepository;

        public SaleReportController(ISaleReportRepository saleReportRepository)
        {
            _saleReportRepository = saleReportRepository;
        }

        [HttpGet]
        public async Task<ActionResult<SaleReportViewModel>> GetSalesReportAsync()
        {
            try
            {
                var salesReport = await _saleReportRepository.GetSalesReportAsync();
                return Ok(salesReport);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
