using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleController : ControllerBase
    {
        private readonly IModuleRepository _moduleRepository;

        public ModuleController(IModuleRepository moduleRepository)
        {
            _moduleRepository = moduleRepository;
        }

        [HttpGet]
        [Route("GetAllModules")]
        public async Task<IActionResult> GetAllModules()
        {
            try
            {
                var results = await _moduleRepository.GetAllModulesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

        }
        [HttpPost]
        [Route("AddModule")]
        public async Task<IActionResult> AddModule(ModuleViewModel moduleviewmodel)
        {
            var newModule = new Module
            {
                Module_Code = moduleviewmodel.Module_Code,
                Department_ID = moduleviewmodel.Department_ID,
                Description = moduleviewmodel.Description
            };

            try
            {
                _moduleRepository.Add(newModule);
                await _moduleRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request");
            }
            return Ok(newModule);


        }


        [HttpGet]
        [Route("GetModuleInput/{input}")]
        public async Task<IActionResult> GetModuleInputAsync(string input)
        {
            try
            {
                var answer = await _moduleRepository.GetModuleInputAsync(input);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetModule/{Module_ID}")]
        public async Task<IActionResult> GetModuleAsync(int Module_ID)
        {
            try
            {
                var answer = await _moduleRepository.GetModuleAsync(Module_ID);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPut]
        [Route("EditModule/{Module_ID}")]
        public async Task<ActionResult<ModuleViewModel>> EditModule(int Module_ID, ModuleViewModel ModuleModel)
        {
            try
            {
                var existingModule = await _moduleRepository.GetModuleAsync(Module_ID);
                if (existingModule == null) return NotFound($"The Module does not exist");

                existingModule.Module_Code = ModuleModel.Module_Code;
                existingModule.Department_ID = ModuleModel.Department_ID;
                existingModule.Description = ModuleModel.Description;

                if (await _moduleRepository.SaveChangesAsync())
                {
                    return Ok(existingModule);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteModule/{Module_ID}")]
        public async Task<IActionResult> DeleteModule(int Module_ID)
        {
            try
            {
                var existingModule = await _moduleRepository.GetModuleAsync(Module_ID);

                if (existingModule == null) return NotFound($"The Equipment Type does not exist");

                _moduleRepository.Delete(existingModule);

                if (await _moduleRepository.SaveChangesAsync()) return Ok(existingModule);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

    }
}
