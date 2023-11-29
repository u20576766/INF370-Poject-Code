using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;
using System.Threading.Tasks;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockTakeController : ControllerBase
    {
        private readonly IStockTakeRepository _stockTakeRepository;

        public StockTakeController(IStockTakeRepository stockTakeRepository)
        {
            _stockTakeRepository = stockTakeRepository;
        }

        [HttpPost("UpdateBookStock")]
        public async Task<IActionResult> UpdateBookStock(StockTakeViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data provided");
                }

                var result = await _stockTakeRepository.UpdateBookStockAsync(model);

                if (result)
                {
                    return Ok("Stock take for book updated successfully");
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update stock take for book");
            }
            catch (Exception ex)
            {
              

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing the request.");
            }
        }


        [HttpPost("UpdateEquipmentStock")]
        public async Task<IActionResult> UpdateEquipmentStock(StockTakeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data provided");
            }

            var result = await _stockTakeRepository.UpdateEquipmentStockAsync(model);

            if (result)
            {
                return Ok("Stock take for equipment updated successfully");
            }

            return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update stock take for equipment");
        }
    }
}
