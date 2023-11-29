using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;

        public StudentController(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        [HttpGet]
        [Route("GetAllStudents")]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                var results = await _studentRepository.GetAllStudentsAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting all students: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetSubscribedStudents")]
        public async Task<IActionResult> GetSubscribedStudents()
        {
            try
            {
                var results = await _studentRepository.GetSubscribedStudentsAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting all students: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAStudent/{Student_ID}")]
        public async Task<IActionResult> GetAStudent(int Student_ID)
        {
            try
            {
                var answer = await _studentRepository.GetAStudentAsync(Student_ID);

                if (answer != null)
                {
                    return Ok(answer);
                }
                else
                {
                    return NotFound("Student does not exist");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting a student: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetSearchedStudent/{enteredQuery}")]
        public async Task<IActionResult> GetSearchedStudent(string enteredQuery)
        {
            try
            {
                var result = await _studentRepository.GetSearchedStudentAsync(enteredQuery);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound("Student does not exist. You may need to create it first");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error searching student: {ex.Message}");
            }
        }

        // Adds a new help tip
        [HttpPost]
        [Route("AddStudent")]
        public async Task<IActionResult> AddStudent([FromForm] StudentVM newStudent)
        {
            try
            {
                var existingStudent = await _studentRepository.CheckExistingStudentAsync(newStudent);
                if (existingStudent.Length > 0) //if system found existing student
                {
                    return BadRequest($"Student already exists");
                }
                else
                {
                    var student = new Student
                    {
                        Name = newStudent.Name,
                        Surname = newStudent.Surname,
                        Cell_Number = newStudent.Cell_Number,
                        Email = newStudent.Email,
                        Subscribed = newStudent.Subscribed
                    };

                    _studentRepository.Add(student);
                    await _studentRepository.SaveChangesAsync();

                    return Ok(student);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error adding a student: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("EditStudent/{Student_ID}")]
        public async Task<ActionResult<StudentVM>> EditStudent(int Student_ID, StudentVM studentModel)
        {
            try
            {
                var existingStudent = await _studentRepository.GetAStudentAsync(Student_ID);
                if (existingStudent != null)
                {
                    existingStudent.Name = studentModel.Name;
                    existingStudent.Surname = studentModel.Surname;
                    existingStudent.Cell_Number = studentModel.Cell_Number;
                    existingStudent.Email = studentModel.Email;
                    existingStudent.Subscribed = studentModel.Subscribed;

                    // Update the student in the database
                    await _studentRepository.SaveChangesAsync();

                    // Return a NoContent response indicating success
                    return Ok(existingStudent);
                }
                else
                {
                    // Return a NotFound response if the student does not exist
                    return NotFound($"The student with ID {Student_ID} does not exist");
                }
            }
            catch (Exception ex)
            {
                // Return a BadRequest response if there's an error
                return BadRequest($"Error updating student: {ex.Message}");
            }
        }


        // Deletes a student
        [HttpDelete]
        [Route("DeleteStudent/{Student_ID}")]
        public async Task<IActionResult> DeleteStudent(int Student_ID)
        {
            try
            {
                var existingStudent = await _studentRepository.GetAStudentAsync(Student_ID);
                if (existingStudent != null)
                {
                    _studentRepository.Delete(existingStudent);
                }
                else
                {
                    return NotFound($"The student does not exist");
                }

                if (await _studentRepository.SaveChangesAsync())
                {
                    return Ok(existingStudent);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting a student: {ex.Message}");
            }
            return BadRequest("Your request is invalid");
        }
    }
}