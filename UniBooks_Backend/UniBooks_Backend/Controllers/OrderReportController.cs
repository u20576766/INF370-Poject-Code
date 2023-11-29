using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderReportController : ControllerBase
    {
        private readonly IOrderReportRepository _orderReportRepository;

        public OrderReportController(IOrderReportRepository orderReportRepository)
        {
            _orderReportRepository = orderReportRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderReport()
        {
            try
            {
                var report = await _orderReportRepository.GenerateOrderReportAsync();
                return Ok(report);
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during report generation
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
