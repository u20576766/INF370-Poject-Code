using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using System;
using System.Threading.Tasks;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentTypeController : ControllerBase
    {
        private readonly IEquipmentTypeRepository _etrepository;

        public EquipmentTypeController(IEquipmentTypeRepository repository)
        {
            _etrepository = repository;
        }

        [HttpGet]
        [Route("GetAllEquipmentTypes")]
        public async Task<IActionResult> GetAllEquipmentTypes()
        {
            try
            {
                var answers = await _etrepository.GetAllEquipmentTypesAsync();

                if (answers == null)
                {
                    return NotFound("No equipment types found");
                }

                return Ok(answers);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetEquipmentTypeInput/{input}")]
        public async Task<IActionResult> GetEquipmentTypeInputAsync(string input)
        {
            try
            {
                var answer = await _etrepository.GetEquipmentTypeInputAsync(input);

                if (answer == null)
                {
                    return NotFound("Equipment type does not exist");
                }

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetEquipmentType/{EquipmentType_ID}")]
        public async Task<IActionResult> GetEquipmentTypeAsync(int EquipmentType_ID)
        {
            try
            {
                var answer = await _etrepository.GetEquipmentTypeAsync(EquipmentType_ID);

                if (answer == null)
                {
                    return NotFound("Equipment type does not exist");
                }

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddEquipmentType")]
        public async Task<IActionResult> AddEquipmentType(EquipmentTypeViewModel etvm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data provided");
            }

            var type = new Equipment_Type
            {
                Name = etvm.Name,
                Description = etvm.Description
            };

            try
            {
                _etrepository.Add(type);
                await _etrepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }

            return Ok(type);
        }

        [HttpPut]
        [Route("EditEquipmentType/{EquipmentType_ID}")]
        public async Task<IActionResult> EditEquipmentType(int EquipmentType_ID, EquipmentTypeViewModel EquipmentTypeModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data provided");
            }

            try
            {
                var existingEquipmentType = await _etrepository.GetEquipmentTypeAsync(EquipmentType_ID);
                if (existingEquipmentType == null)
                {
                    return NotFound("The EquipmentType does not exist");
                }

                existingEquipmentType.Name = EquipmentTypeModel.Name;
                existingEquipmentType.Description = EquipmentTypeModel.Description;

                if (await _etrepository.SaveChangesAsync())
                {
                    return Ok(existingEquipmentType);
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }

            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteEquipmentType/{EquipmentType_ID}")]
        public async Task<IActionResult> DeleteEquipmentType(int EquipmentType_ID)
        {
            try
            {
                var existingEquipmentType = await _etrepository.GetEquipmentTypeAsync(EquipmentType_ID);

                if (existingEquipmentType == null)
                {
                    return NotFound($"The Equipment Type with ID {EquipmentType_ID} does not exist");
                }

                _etrepository.Delete(existingEquipmentType);

                if (await _etrepository.SaveChangesAsync())
                {
                    return Ok(existingEquipmentType);
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }
    }
}
