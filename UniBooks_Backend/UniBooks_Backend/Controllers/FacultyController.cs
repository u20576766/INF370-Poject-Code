using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyController : ControllerBase
    {
        private readonly IFacultyRepository _facultyRepository;
        public FacultyController(IFacultyRepository facultyRepository)
        {
            _facultyRepository = facultyRepository;
        }
        [HttpGet]
        [Route("GetAllFaculty")]
        public async Task<IActionResult> GetAllFaculties()
        {
            try
            {
                var results = await _facultyRepository.GetAllFacultiesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error.Please contact support");
            }
        }


        [HttpPost]
        [Route("AddFaculty")]
        public async Task<IActionResult> AddFaculty(FacultyViewModel facViewModel)
        {
            var newFaculty = new Faculty
            {
                Faculty_Name = facViewModel.Faculty_Name
            };

            try
            {
                _facultyRepository.Add(newFaculty);
                await _facultyRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request");
            }
            return Ok(newFaculty);


        }


        [HttpGet]
        [Route("GetFacultyInput/{input}")]
        public async Task<IActionResult> GetFacultyInputAsync(string input)
        {
            try
            {
                var answer = await _facultyRepository.GetFacultyInputAsync(input);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetFaculty/{Faculty_ID}")]
        public async Task<IActionResult> GetFacultyAsync(int Faculty_ID)
        {
            try
            {
                var answer = await _facultyRepository.GetFacultyAsync(Faculty_ID);

                if (answer == null) return NotFound("Equipment Type does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPut]
        [Route("EditFaculty/{Faculty_ID}")]
        public async Task<ActionResult<FacultyViewModel>> EditFaculty(int Faculty_ID, FacultyViewModel FacultyModel)
        {
            try
            {
                var existingFaculty = await _facultyRepository.GetFacultyAsync(Faculty_ID);
                if (existingFaculty == null) return NotFound($"The Faculty does not exist");

                existingFaculty.Faculty_Name = FacultyModel.Faculty_Name;

                if (await _facultyRepository.SaveChangesAsync())
                {
                    return Ok(existingFaculty);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteFaculty/{Faculty_ID}")]
        public async Task<IActionResult> DeleteFaculty(int Faculty_ID)
        {
            try
            {
                var existingFaculty = await _facultyRepository.GetFacultyAsync(Faculty_ID);

                if (existingFaculty == null) return NotFound($"The Faculty Type does not exist");

                _facultyRepository.Delete(existingFaculty);

                if (await _facultyRepository.SaveChangesAsync()) return Ok(existingFaculty);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

    }
}
