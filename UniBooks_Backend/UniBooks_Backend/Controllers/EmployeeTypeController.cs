using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeTypeController : ControllerBase
    {
        private readonly IEmployeeTypeRepository _employeeTypeRepository;

        public EmployeeTypeController(IEmployeeTypeRepository employeeTypeRepository)
        {
            _employeeTypeRepository = employeeTypeRepository;
        }

        // Retrieves all the employee types
        [HttpGet]
        [Route("GetAllEmployeeTypes")]
        public async Task<IActionResult> GetAllEmployeeTypes()
        {
            try
            {
                var results = await _employeeTypeRepository.GetAllEmployeeTypesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        //Retrieves employee type by ID
        [HttpGet]
        [Route("GetAnEmployeeType/{EmployeeType_ID}")]
        public async Task<IActionResult> GetAnEmployeeType(int EmployeeType_ID)
        {
            try
            {
                var answer = await _employeeTypeRepository.GetAnEmployeeTypeAsync(EmployeeType_ID);

                if (answer != null)
                {
                    return Ok(answer);
                }
                else
                {
                    return NotFound("Employee type does not exist");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        // Retrieves employee type results filtered by the search term
        [HttpGet]
        [Route("SearchEmployeeType/{input}")]
        public async Task<IActionResult> SearchEmployeeType(string input)
        {
            try
            {
                var result = await _employeeTypeRepository.SearchEmployeeTypeAsync(input);
                if (result.Length == 0)
                {
                    return NotFound("Employee type does not exist. You may need to create them first");
                }
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        // Adds a new employee type
        [HttpPost]
        [Route("AddEmployeeType")]
        public async Task<IActionResult> AddEmployeeType(EmployeeTypeVM newEmployeeType)
        {
            try
            {
                //check if a employee type already exists with the same details
                var existingEmpType = await _employeeTypeRepository.CheckIfEmpTypeExists(newEmployeeType.Name);
                if (existingEmpType != null) //if system found existing student
                {
                    return BadRequest($"Employee type already exists");
                }
                else
                {
                    //assigning new employee type values
                    var employeeType = new Employee_Type
                    {
                        Name = newEmployeeType.Name,
                        Description = newEmployeeType.Description
                    };

                    _employeeTypeRepository.Add(employeeType);
                    await _employeeTypeRepository.SaveChangesAsync();

                    return Ok(employeeType);
                }
            }
            catch (Exception err)
            {
                return BadRequest($"Error adding an employee type: {err.Message}");
            }
        }

        // Update details of an employee type
        [HttpPut]
        [Route("UpdateEmployeeType/{EmployeeType_ID}")]
        public async Task<ActionResult<EmployeeTypeVM>> UpdateEmployeeType(int EmployeeType_ID, EmployeeTypeVM newEmployeeType)
        {
            try
            {
                var existingEmployeeType = await _employeeTypeRepository.GetAnEmployeeTypeAsync(EmployeeType_ID);
                if (existingEmployeeType != null)
                {
                    // USER CAN ONLY CHANGE EXPIRY DATE
                    existingEmployeeType.Name = newEmployeeType.Name;
                    existingEmployeeType.Description = newEmployeeType.Description;
                }
                else
                {
                    return NotFound($"This employee type does not exist");
                }

                if (await _employeeTypeRepository.SaveChangesAsync())
                {
                    return Ok(existingEmployeeType);
                }
            }
            catch (Exception err)
            {
                return BadRequest($"Error adding an employee type: {err.Message}");
            }
            return StatusCode(500, "Internal Server Error. Please contact support");
        }

        // Deletes an employee type
        [HttpDelete]
        [Route("DeleteEmployeeType/{EmployeeType_ID}")]
        public async Task<IActionResult> DeleteEmployeeType(int EmployeeType_ID)
        {
            try
            {
                var existingEmployeeType = await _employeeTypeRepository.GetAnEmployeeTypeAsync(EmployeeType_ID);
                if (existingEmployeeType != null)
                {
                    _employeeTypeRepository.Delete(existingEmployeeType);
                }
                else
                {
                    return NotFound($"The employee type does not exist");
                }

                if (await _employeeTypeRepository.SaveChangesAsync())
                {
                    return Ok(existingEmployeeType);
                }
            }
            catch (Exception err)
            {
                return BadRequest($"Error deleting an employee type: {err.Message}");
            }
            return BadRequest("Your request is invalid");
        }
    }
}