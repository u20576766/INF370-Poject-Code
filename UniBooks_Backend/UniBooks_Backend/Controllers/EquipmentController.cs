using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Interface_Repository;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly AppDbContext _appDbContext;

        public EquipmentController(IEquipmentRepository equipmentRepository, AppDbContext appDbContext)
        {
            _equipmentRepository = equipmentRepository;
            _appDbContext = appDbContext;
        }

        [HttpPost]
        [Route("AddEquipment")]
        public async Task<IActionResult> AddEquipment(EquipmentViewModel evm)
        {
            
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data provided");
                }

                var equipment = new Equipment
                {
                    Name = evm.Name,
                    Description = evm.Description,
                    Quantity_On_Hand = evm.Quantity_On_Hand,
                    Module_ID = evm.Module_ID,
                    EquipmentType_ID = evm.EquipmentType_ID,
                    Image  = evm.Image,
                   

                };


                // Add the equipment to the context but do not save changes yet
                _equipmentRepository.AddEquipment(equipment);

                // Save changes to generate the Equipment_ID
                await _equipmentRepository.SaveChangesAsync();

                // Now that the Equipment_ID is generated, set it on the new price object
                var newprice = new Price
                {
                    Amount = evm.Amount,
                    Date = DateTime.UtcNow.ToString("dd-MM-yyyy"),
                    Equipment_ID = equipment.Equipment_ID // Set the Equipment_ID to the Price's Equipment_ID property
                };

                // Add the price to the context
                _equipmentRepository.AddPrice(newprice);

                // Save changes again to add the new price
                await _equipmentRepository.SaveChangesAsync();

                // Equipment and Price successfully added
                return Ok("Added equipment successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding equipment and price: {ex.Message}");
            }
        }



        [HttpDelete]
        [Route("DeleteEquipment/{equipmentId}")]
        public async Task<IActionResult> DeleteEquipment(int equipmentId)
        {
            try
            {
                var equipment = await _equipmentRepository.GetEquipmentByIDAsync(equipmentId);
                if (equipment == null)
                {
                    return NotFound("The equipment not found");
                }

                // Check if the equipment is connected to sales or orders
                bool hasRelatedRecords = await _equipmentRepository.HasRelatedRecordsAsync(equipment);

                if (hasRelatedRecords)
                {
                    return BadRequest("Cannot delete the equipment as it is connected to sales or orders.");
                }

                var prices = await _equipmentRepository.GetPriceByEquipmentIDAsync(equipmentId);
                if (prices == null)
                {
                    return NotFound("The prices not found");
                }

                foreach (var price in prices)
                {
                    _equipmentRepository.Delete(price); // Assuming you have a DeletePrice method
                }

                _equipmentRepository.Delete(equipment);

                if (await _equipmentRepository.SaveChangesAsync())
                {
                    // Equipment and prices successfully deleted
                    return Ok("Delete was successful");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting equipment and prices: {ex.Message}");
            }

            // Invalid request, unable to delete equipment and prices
            return BadRequest("Your request is invalid.");
        }



        [HttpPut]
        [Route("Editequipment/{Equipment_ID}")]
        public async Task<ActionResult<EquipmentViewModel>> EditEquipment(int Equipment_ID, EquipmentViewModel evm)
        {
            try
            {
                var existingEquipment = await _equipmentRepository.GetEquipmentByIDAsync(Equipment_ID);

                if (existingEquipment == null)
                {
                    return NotFound("The equipment does not exist");
                }

                existingEquipment.Name = evm.Name;
                existingEquipment.Description = evm.Description;
                      existingEquipment.Image = evm.Image;
                existingEquipment.Module_ID = evm.Module_ID;
                existingEquipment.EquipmentType_ID = evm.EquipmentType_ID;

                // Update the price amount if the provided value is valid
                if (evm.Amount >= 0)
                {

                    var existingPrice = await _equipmentRepository.GetOnePriceByEquipmentIDAsync(existingEquipment.Equipment_ID);

                    if (existingPrice == null)
                    {
                        // If the price doesn't exist, create a new one for the equipment
                        var newPrice = new Price
                        {
                            Amount = evm.Amount,
                            Date = DateTime.UtcNow.ToString("dd-MM-yyyy"),
                            Equipment_ID = Equipment_ID
                        };
                        _equipmentRepository.AddPrice(newPrice);
                    }
                    else
                    {
                      
                        existingPrice.Amount = evm.Amount;
                    }
                }

                if (await _equipmentRepository.SaveChangesAsync())
                {
                    // Equipment and Price successfully updated
                    return Ok("Updated successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error. Please contact support: {ex.Message}");
            }

            // Invalid request, unable to update equipment and price
            return BadRequest("Your request is invalid.");
        }


        [HttpGet]
        [Route("GetEquipmentBySearchBar/{searchText}")]
        public async Task<IActionResult> GetEquipmentBySearchBar(string searchText)
        {
            try
            {
                var result = await _equipmentRepository.GetEquipmentByString(searchText);
                if (result == null)
                {
                    return NotFound("Equipment does not exist");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error. Please contact support: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetEquipmentById/{equipment_id}")]
        public async Task<IActionResult> GetEquipmentById(int equipment_id)
        {
            try
            {
                var result = await _equipmentRepository.GetEquipmentByIDAsync(equipment_id);
                if (result == null)
                {
                    return NotFound("Equipment does not exist");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error. Please contact support: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAllEquipments")]
        public async Task<IActionResult> GetAllEquipments()
        {
            try
            {
                // Use Include to eagerly load the "Prices" related to each equipment object
                var results = await _equipmentRepository.GetAllEquipmentViewModels();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Could not get any equipment: {ex.Message}");
            }
        }

    }
}
