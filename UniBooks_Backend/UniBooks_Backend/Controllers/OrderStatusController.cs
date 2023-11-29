using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Controllers;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using UniBooks.ViewModels;


namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderStatusController : ControllerBase
    {
        private readonly IOrderStatusRepository _OrderStatusRepository;

        public OrderStatusController(IOrderStatusRepository OrderStatusRepository)
        {
            _OrderStatusRepository = OrderStatusRepository;
        }

        [HttpGet]
        [Route("GetAllOrderStatuss")]
        public async Task<IActionResult> GetAllOrderStatuss()
        {
            try
            {
                var results = await _OrderStatusRepository.GetAllOrderStatusAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

        }

        [HttpGet]
        [Route("GetOrderStatus/{OrderStatus_ID}")]
        public async Task<IActionResult> GetOrderStatusAsync(int OrderStatus_ID)
        {
            try
            {
                var answer = await _OrderStatusRepository.GetOrderStatusAsync(OrderStatus_ID);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }
    }
}
