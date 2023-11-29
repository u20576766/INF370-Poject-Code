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
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentController(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }
        [HttpGet]
        [Route("GetDepartment")]
        public async Task<IActionResult> GetAllDepartment()
        {
            try
            {
                var results = await _departmentRepository.GetAllDepartmentsAsync();
                return Ok(results);

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }


        [HttpPost]
        [Route("AddDepartment")]
        public async Task<IActionResult> AddDepartment(DepartmentViewModel departmentviewmodel)
        {
            var newDepartment = new Department
            {
                Department_Name = departmentviewmodel.Department_Name,
                Faculty_ID = departmentviewmodel.Faculty_ID

            };

            try
            {
                _departmentRepository.Add(newDepartment);
                await _departmentRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request");
            }
            return Ok(newDepartment);
        }

        [HttpGet]
        [Route("GetDepartmentInput/{input}")]
        public async Task<IActionResult> GetDepartmentInputAsync(string input)
        {
            try
            {
                var answer = await _departmentRepository.GetDepartmentInputAsync(input);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetDepartment/{Department_ID}")]
        public async Task<IActionResult> GetDepartmentAsync(int Department_ID)
        {
            try
            {
                var answer = await _departmentRepository.GetDepartmentAsync(Department_ID);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPut]
        [Route("EditDepartment/{Department_ID}")]
        public async Task<ActionResult<DepartmentViewModel>> EditDepartment(int Department_ID, DepartmentViewModel DepartmentModel)
        {
            try
            {
                var existingDepartment = await _departmentRepository.GetDepartmentAsync(Department_ID);
                if (existingDepartment == null) return NotFound($"The Department does not exist");

                existingDepartment.Department_Name = DepartmentModel.Department_Name;
                existingDepartment.Faculty_ID = DepartmentModel.Faculty_ID;

                if (await _departmentRepository.SaveChangesAsync())
                {
                    return Ok(existingDepartment);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteDepartment/{Department_ID}")]
        public async Task<IActionResult> DeleteDepartment(int Department_ID)
        {
            try
            {
                var existingDepartment = await _departmentRepository.GetDepartmentAsync(Department_ID);

                if (existingDepartment == null) return NotFound($"The Equipment Type does not exist");

                _departmentRepository.Delete(existingDepartment);

                if (await _departmentRepository.SaveChangesAsync()) return Ok(existingDepartment);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}
