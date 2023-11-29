using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Models;
using Microsoft.AspNetCore.Identity;
using System.Text;

namespace UniBooks_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmployeeRepository _employeeRepository; // Make sure to inject your repository
        private readonly ILogger<EmployeeController> _logger;
        private readonly AppDbContext _appDbContext;

        public EmployeeController(
            UserManager<AppUser> userManager,
            IEmployeeRepository employeeRepository,
            ILogger<EmployeeController> logger, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _employeeRepository = employeeRepository;
            _logger = logger;
            _appDbContext = appDbContext;
        }



        [HttpGet]
        [Route("GetAllEmployees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            try
            {
                var employees = await _employeeRepository.GetAllEmployeesAsync();
                return Ok(employees);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetEmployee/{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }
                return Ok(employee);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddEmployee")]
        public async Task<IActionResult> AddEmployee(EmployeeViewModel employeeViewModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Generate a unique username based on the employee's name and surname
                    string username = GenerateUniqueUsername(employeeViewModel.Name, employeeViewModel.Surname);

                    // Check if the generated username already exists in the database
                    if (UsernameExistsInDatabase(username))
                    {
                        return Conflict("Username already exists.");
                    }

                    // Generate a random password
                    string password = GenerateRandomPassword();

                    // Create a new AppUser (employee) with the generated username, email, and first name
                    var newUser = new AppUser
                    {
                        UserName = username,
                        Email = employeeViewModel.Email,
                        FirstName = employeeViewModel.Name,
                        LastName = employeeViewModel.Surname,
                    };

                    // Set the password for the newUser
                    var result = await _userManager.CreateAsync(newUser, password);

                    if (result.Succeeded)
                    {
                        // Assign the "Employee" role to the employee user
                        await _userManager.AddToRoleAsync(newUser, "Employee");

                        // Create an Employee entity and populate its properties
                        var employee = new Employee
                        {
                            Name = employeeViewModel.Name,
                            Surname = employeeViewModel.Surname,
                            Cell_Number = employeeViewModel.Cell_Number,
                            Email = employeeViewModel.Email,
                            Physical_Address = employeeViewModel.Physical_Address,
                            BirthDate = employeeViewModel.BirthDate,
                            Emergency_Contact_Name = employeeViewModel.Emergency_Contact_Name,
                            Emergency_Contact_Cell = employeeViewModel.Emergency_Contact_Cell,
                            Employee_Type_ID = employeeViewModel.Employee_Type_ID,
                            User_ID = newUser.Id,
                            Image = employeeViewModel.ImageBase64 // Set the Image property here
                        };

                        // Save the employee information to your database
                        await _employeeRepository.AddEmployeeAsync(employee);
                        await _employeeRepository.SaveChangesAsync();

                        return Ok($"Employee added successfully. Username: {username}, Password: {password}");
                    }
                    else
                    {
                        // If user creation failed, return a BadRequest with error details
                        var errors = result.Errors.Select(e => e.Description);
                        return BadRequest($"Error creating user: {string.Join(", ", errors)}");
                    }
                }
                return BadRequest("Invalid employee data.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }






        // Helper methods to generate a unique username and a random password
        private string GenerateUniqueUsername(string firstName, string lastName)
        {
            // Logic to generate a unique username based on firstName and lastName
            string baseUsername = $"{firstName.ToLower()}.{lastName.ToLower()}"; // Example: john.doe

            string uniqueUsername = baseUsername;
            int suffix = 1;

            // Check if the generated username is unique, if not, append a suffix
            while (UsernameExistsInDatabase(uniqueUsername))
            {
                uniqueUsername = $"{baseUsername}{suffix}";
                suffix++;
            }

            return uniqueUsername;
        }

        private bool UsernameExistsInDatabase(string username)
        {
            bool usernameExists = _userManager.Users.Any(user => user.UserName == username);
            return usernameExists;
        }

        private string GenerateRandomPassword()
        {
            const string uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
            const string digitChars = "0123456789";
            const string specialChars = "!@#$%^&*()_+";

            const int passwordLength = 10; // Change to your desired password length

            var random = new Random();
            var password = new StringBuilder();

            // Ensure at least one character from each character set
            password.Append(uppercaseChars[random.Next(uppercaseChars.Length)]);
            password.Append(lowercaseChars[random.Next(lowercaseChars.Length)]);
            password.Append(digitChars[random.Next(digitChars.Length)]);
            password.Append(specialChars[random.Next(specialChars.Length)]);

            // Fill the remaining characters with a mix of characters
            const string allChars = uppercaseChars + lowercaseChars + digitChars + specialChars;
            for (int i = 4; i < passwordLength; i++)
            {
                password.Append(allChars[random.Next(allChars.Length)]);
            }

            return password.ToString();
        }



        [HttpPut]
        [Route("UpdateEmployee/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, EmployeeViewModel employeeViewModel)
        {
            try
            {
                var employee = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }

                if (ModelState.IsValid)
                {
                    // Update the Employee properties based on the ViewModel
                    employee.Name = employeeViewModel.Name;
                    employee.Surname = employeeViewModel.Surname;
                    employee.Cell_Number = employeeViewModel.Cell_Number;
                    employee.Email = employeeViewModel.Email;
                    employee.Physical_Address = employeeViewModel.Physical_Address;
                    employee.BirthDate = employeeViewModel.BirthDate;
                    employee.Emergency_Contact_Name = employeeViewModel.Emergency_Contact_Name;
                    employee.Emergency_Contact_Cell = employeeViewModel.Emergency_Contact_Cell;
                    employee.Employee_Type_ID = employeeViewModel.Employee_Type_ID;
                    employee.Image = employeeViewModel.ImageBase64;


                    await _employeeRepository.UpdateEmployeeAsync(employee);
                    if (await _employeeRepository.SaveChangesAsync())
                    {
                        return Ok("Employee updated successfully.");
                    }
                    else
                    {
                        return BadRequest("Unable to save changes.");
                    }
                }
                return BadRequest("Invalid employee data.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteEmployee/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }

                await _employeeRepository.DeleteEmployeeAsync(id);
                if (await _employeeRepository.SaveChangesAsync())
                {
                    return Ok("Employee deleted successfully.");
                }
                else
                {
                    return BadRequest("Unable to save changes.");
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }
    }
}
