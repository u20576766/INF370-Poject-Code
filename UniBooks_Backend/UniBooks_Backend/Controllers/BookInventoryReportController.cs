using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookInventoryReportController : ControllerBase
    {
        private readonly  IBookInventoryReportRepository  _reportRepository;

        public BookInventoryReportController(IBookInventoryReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<BookInventoryReportViewModel>>> GetInventoryReport()
        {
            var reportData = await _reportRepository.GetInventoryReportAsync();

            var viewModelList = reportData.Select(item => new BookInventoryReportViewModel
            {
                Quantity_On_Hand = item.Quantity_On_Hand,
                ISBN = item.ISBN,
                Title = item.PrescribedBook?.Title,
                BasePrice = item.PrescribedBook?.BasePrice,
                Price = item.Prices.OrderByDescending(p => p.Date).FirstOrDefault()?.Amount ?? 0

            }).ToList();



            return Ok(viewModelList);
        }

    }

}
