using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interfaces;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WriteOffController : ControllerBase
    {
        private readonly IWriteOffRepository _writeOffRepository;

        public WriteOffController(IWriteOffRepository writeOffRepository)
        {
            _writeOffRepository = writeOffRepository;
        }

        [HttpGet]
        [Route("GetWriteOffById")]
        public IActionResult GetWriteOffById(int id)
        {
            var writeOff = _writeOffRepository.GetWriteOffById(id);
            if (writeOff == null)
            {
                return NotFound();
            }

            return Ok(writeOff);
        }

        [HttpGet]
        [Route("GetAllWriteOffs")]
        public IActionResult GetAllWriteOffs()
        {
            var writeOffs = _writeOffRepository.GetAllWriteOffs();
            return Ok(writeOffs);
        }

        [HttpPost]
        [Route("WriteOffStock")]
        public IActionResult WriteOffStock(WriteOffViewModel writeOffViewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _writeOffRepository.WriteOffStock(writeOffViewModel);
                return Ok("Write-off successful!");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Handle other exceptions here, if necessary
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}
