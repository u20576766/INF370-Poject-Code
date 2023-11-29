using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _context;
        private readonly JWTService _jwtService;
        private readonly ILogger<AccountController> _logger;


        public AccountController(
     SignInManager<AppUser> signInManager,
     UserManager<AppUser> userManager,
     IConfiguration configuration,
     AppDbContext context,
     IHttpContextAccessor httpContextAccessor,
     JWTService jwtService,
     ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _jwtService = jwtService;
            _logger = logger; // Inject the logger instance
        }


        //------------------------------Register--------------------------------------//
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUserViewModel model)
        {
            try
            {
                // Check if the user is already registered
                if (await CheckEmailExistsAsync(model.Email))
                {
                    return BadRequest($"An existing account is using {model.Email}. Please try with another email address");
                }

                // Create a new Student user
                var studentUser = new AppUser
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserName = model.Email,
                    Email = model.Email,
                    DateCreated = DateTime.Now
                };

                // Register the student user without automatically signing in
                var result = await _userManager.CreateAsync(studentUser, model.Password);

                if (result.Succeeded)
                {
                    // Assign the "Student" role to the student user
                    await _userManager.AddToRoleAsync(studentUser, SD.StudentRole);

                    // Save the student entity with the User_ID pointing to the student user's Id
                    var student = new Student
                    {
                        Name = model.FirstName,
                        Surname = model.LastName,
                        Cell_Number = model.Cell_Number,
                        Email = model.Email,
                        Subscribed = true,
                        User_ID = studentUser.Id
                    };

                    // Create a shopping cart for the student
                    var shoppingCart = new ShoppingCart
                    {
                        Student = student,
                        Discount = 0, // Set your initial discount value here
                        Count = 0,    // Set your initial count value here
                        TotalAmount = 0, // Set your initial total amount value here
                        SubTotal = 0  // Set your initial sub-total value here
                    };

                    _context.Students.Add(student);
                    _context.ShoppingCart.Add(shoppingCart); // Add the shopping cart to the context
                    await _context.SaveChangesAsync();

                    // Generate an email confirmation token
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(studentUser);

                    // Construct the confirmation link
                    var appBaseUrl = _configuration["Tokens:AppBaseUrl"];
                    var confirmationLink = $"{appBaseUrl}/confirm-email?userId={studentUser.Id}&token={WebUtility.UrlEncode(token)}";

                    // Send the confirmation email with an actual link
                    if (await SendConfirmEmailAsync(studentUser, confirmationLink))
                    {
                        // Return a success message
                        return Ok(new { Title = "Account Created", Message = "Your account has been created. Please check your email for a confirmation link." });
                    }
                    else
                    {
                        return BadRequest("Failed to send confirmation email. Please contact support.");
                    }
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("send-2fa-token")]
        public async Task<IActionResult> SendTwoFactorAuthenticationToken(SendTwoFactorTokenViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("This email address is not registered yet");

            if (user.TwoFactorEnabled) return BadRequest("Two-Factor Authentication is already enabled for this user");

            // Generate a secure 2FA token
            var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

            // Send the token to the user's email
            var confirmationLink = $"{model.AppBaseUrl}/verify-2fa?userId={user.Id}&token={WebUtility.UrlEncode(token)}";

            if (await SendConfirmEmailAsync(user, confirmationLink))
            {
                return Ok(new JsonResult(new { title = "2FA Token Sent", message = "A Two-Factor Authentication token has been sent to your email. Please check your inbox." }));
            }
            else
            {
                return BadRequest("Failed to send the 2FA token. Please contact support.");
            }
        }

        //--Ionic
        [HttpPost]
        [Route("ionic-register")]
        public async Task<IActionResult> IonicRegister(RegisterUserViewModel model)
        {
            try
            {
                // Check if the user is already registered
                if (await CheckEmailExistsAsync(model.Email))
                {
                    return BadRequest($"An existing account is using {model.Email}. Please try with another email address");
                }

                // Create a new Student user
                var studentUser = new AppUser
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserName = model.Email,
                    Email = model.Email,
                    DateCreated = DateTime.Now
                };

                // Register the student user without automatically signing in
                var result = await _userManager.CreateAsync(studentUser, model.Password);

                if (result.Succeeded)
                {
                    // Assign the "Student" role to the student user
                    await _userManager.AddToRoleAsync(studentUser, SD.StudentRole);

                    // Save the student entity with the User_ID pointing to the student user's Id
                    var student = new Student
                    {
                        Name = model.FirstName,
                        Surname = model.LastName,
                        Cell_Number = model.Cell_Number,
                        Email = model.Email,
                        Subscribed = true,
                        User_ID = studentUser.Id
                    };

                    // Create a shopping cart for the student
                    var shoppingCart = new ShoppingCart
                    {
                        Student = student,
                        Discount = 0, // Set your initial discount value here
                        Count = 0,    // Set your initial count value here
                        TotalAmount = 0, // Set your initial total amount value here
                        SubTotal = 0  // Set your initial sub-total value here
                    };

                    _context.Students.Add(student);
                    _context.ShoppingCart.Add(shoppingCart); // Add the shopping cart to the context
                    await _context.SaveChangesAsync();

                    // Generate an email confirmation token
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(studentUser);

                    // Construct the confirmation link
                    var IonicBaseUrl = _configuration["Tokens:IonicBaseUrl"];
                    var confirmationLink = $"{IonicBaseUrl}/confirm-email?userId={studentUser.Id}&token={WebUtility.UrlEncode(token)}";

                    // Send the confirmation email with an actual link
                    if (await SendConfirmEmailAsync(studentUser, confirmationLink))
                    {
                        // Return a success message
                        return Ok(new { Title = "Account Created", Message = "Your account has been created. Please check your email for a confirmation link." });
                    }
                    else
                    {
                        return BadRequest("Failed to send confirmation email. Please contact support.");
                    }
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("ionic-send-2fa-token")]
        public async Task<IActionResult> IonicSendTwoFactorAuthenticationToken(ISendTwoFactorTokenViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("This email address is not registered yet");

            if (user.TwoFactorEnabled) return BadRequest("Two-Factor Authentication is already enabled for this user");

            // Generate a secure 2FA token
            var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

            // Send the token to the user's email
            var confirmationLink = $"{model.IonicBaseUrl}/verify-2fa?userId={user.Id}&token={WebUtility.UrlEncode(token)}";

            if (await SendConfirmEmailAsync(user, confirmationLink))
            {
                return Ok(new JsonResult(new { title = "2FA Token Sent", message = "A Two-Factor Authentication token has been sent to your email. Please check your inbox." }));
            }
            else
            {
                return BadRequest("Failed to send the 2FA token. Please contact support.");
            }
        }

        [HttpPost]
        [Route("verify-2fa")]
        public async Task<IActionResult> VerifyAndEnableTwoFactorAuthentication(VerifyTwoFactorTokenViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null) return BadRequest("Invalid user");

            if (user.TwoFactorEnabled) return BadRequest("Two-Factor Authentication is already enabled for this user");

            try
            {
                var result = await _userManager.VerifyTwoFactorTokenAsync(user, "Email", model.Token);
                if (result)
                {
                    // Enable Two-Factor Authentication for the user
                    user.TwoFactorEnabled = true;
                    await _userManager.UpdateAsync(user);

                    return Ok(new JsonResult(new { title = "2FA Enabled", message = "Two-Factor Authentication has been enabled for your account." }));
                }

                return BadRequest("Invalid 2FA token. Please try again.");
            }
            catch (Exception)
            {
                return BadRequest("Invalid 2FA token. Please try again.");
            }
        }

        private async Task<bool> SendConfirmEmailAsync(AppUser user, string confirmationLink)
        {
            try
            {
                // Create an email message with the 2FA token
                var mailSettings = _configuration.GetSection("MailSettings");
                var senderEmail = mailSettings["SenderEmail"];
                var senderName = mailSettings["SenderName"];
                var emailSubject = "Your Two-Factor Authentication Token";

                var emailBody = $"Your Two-Factor Authentication token is: {confirmationLink}";

                var emailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = emailSubject,
                    Body = emailBody,
                    IsBodyHtml = true,
                };
                emailMessage.To.Add(user.Email);

                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = Convert.ToInt32(emailSettings["Port"]);
                var useSsl = Convert.ToBoolean(emailSettings["UseSsl"]);
                var username = emailSettings["Username"];
                var password = emailSettings["Password"];

                using (var smtpClient = new SmtpClient(smtpServer))
                {
                    smtpClient.Port = smtpPort;
                    smtpClient.Credentials = new NetworkCredential(username, password);
                    smtpClient.EnableSsl = useSsl;

                    await smtpClient.SendMailAsync(emailMessage);
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        [HttpPut]
        [Route("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("This email address has not been registered yet");

            if (user.EmailConfirmed == true) return BadRequest("Your email was confirmed before. Please login to your account");

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "Email confirmed", message = "Your email address is confirmed. You can login now" }));
                }

                return BadRequest("Invalid token. Please try again");
            }
            catch (Exception)
            {
                return BadRequest("Invalid token. Please try again");
            }
        }

        private async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }

        //------------------Login---------------------------------//
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginUserViewModel model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.UserName);

                if (user == null)
                {
                    // Log the error for debugging
                    _logger.LogError($"User not found for username: {model.UserName}");
                    return BadRequest("Invalid login attempt.");
                }

                var passwordCorrect = await _userManager.CheckPasswordAsync(user, model.Password);

                if (!passwordCorrect)
                {
                    // Log the error for debugging
                    _logger.LogError($"Invalid password for user: {model.UserName}");
                    return BadRequest("Invalid login attempt.");
                }

                var roles = await _userManager.GetRolesAsync(user);

                if (roles.Contains("Administrator") || roles.Contains("Employee"))
                {
                    // Explicitly load the Employees navigation property
                    await _context.Entry(user).Reference(u => u.Employees).LoadAsync();

                    var employeeInfo = user.Employees;

                    if (employeeInfo != null)
                    {
                        // Generate JWT token
                        var jwtService = new JWTService(_configuration, _userManager);
                        var token = await jwtService.CreateJWT(user);
                        return Ok(employeeInfo);
                    }
                }

                else if (roles.Contains("Student"))
                {
                    if (user != null)
                    {
                        // Find the corresponding Student entity using the user ID
                        var student = await _context.Students.SingleOrDefaultAsync(s => s.User_ID == user.Id);

                        if (student != null)
                        {
                            // Store student ID in local storage
                            var studentId = student.Student_ID;
                            var firstName = student.Name;
                            var lastName = student.Surname;
                            var email = student.Email;
                            var cell_Number = student.Cell_Number;
                            var subscribed = student.Subscribed;
                            // Generate JWT token
                            var jwtService = new JWTService(_configuration, _userManager);
                            var token = await jwtService.CreateJWT(user);

                            // Return the token and student ID in the response
                            return Ok(new { Token = token, StudentID = studentId, FirstName = firstName, 
                            LastName = lastName,
                            Email = email,
                            phonenumber = cell_Number,
                            Subscribed = subscribed
                            });
                        }
                        else
                        {
                            // Handle the case where Student is not found for the user
                            return BadRequest("Student not found for this user.");
                        }
                    }
                    else
                    {
                        // Handle the case where user is null
                        return BadRequest("User not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error for debugging
                _logger.LogError(ex, "An error occurred during login.");
                return BadRequest(ex.Message);
            }

            return BadRequest("Invalid login attempt.");
        }



        [HttpGet]
        [Route("create-jwt")]
        public async Task<IActionResult> CreateJWT(AppUser user)
        {
            var userClaims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.UserName),
        new Claim(ClaimTypes.GivenName, user.FirstName),
        new Claim(ClaimTypes.Surname, user.LastName)
    };

            var roles = await _userManager.GetRolesAsync(user);
            userClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var credentials = new SigningCredentials(_jwtService.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(userClaims),
                Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Tokens:ExpiresInDays"])),
                SigningCredentials = credentials,
                Issuer = _configuration["Tokens:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwt = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(jwt);

            return Ok(new { Token = token });
        }




        //--------------------------Logout------------------------------//
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                // Sign the user out
                await _signInManager.SignOutAsync();

                return Ok(new { Message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during logout.");
                return BadRequest(ex.Message);
            }
        }

        //--------------------------Forgot Password------------------------------//

        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {
                    try
                    {
                        // Generate a password reset token for the user
                        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                        // Create a reset password link with the token
                        var appBaseUrl = _configuration["Tokens:AppBaseUrl"];
                        var resetLink = $"{appBaseUrl}/reset-password?email={model.Email}&token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token))}";

                        // Send the password reset email with the resetLink
                        await SendPasswordResetEmailAsync(user, resetLink);

                        return Ok(new { Message = "Password reset request sent. Please check your email for further instructions." });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while generating the password reset token and sending the email.");
                        return StatusCode(500, new { Message = "An error occurred during password reset." });
                    }
                }
            }

            // If user not found or validation fails, return an error message
            ModelState.AddModelError(string.Empty, "User with this email does not exist.");
            return BadRequest(ModelState);
        }


        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromQuery] string email, [FromQuery] string token, [FromBody] ResetPassword model)
        {
            try
            {
                _logger.LogInformation($"Reset password request received for email: {email}, token: {token}");

                // Decode the base64-encoded token to a string
                var tokenString = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
                _logger.LogInformation($"Decoded token string: {tokenString}");

                // Find the user by email
                var user = await _userManager.FindByEmailAsync(email);

                if (user != null)
                {
                    // Check if the new password is valid (customize this validation as per your requirements)
                    if (string.IsNullOrWhiteSpace(model.NewPassword))
                    {
                        ModelState.AddModelError("NewPassword", "New password is required.");
                        return BadRequest(ModelState);
                    }

                    // You can add additional password validation logic here

                    // Reset the user's password using the token
                    var resetResult = await _userManager.ResetPasswordAsync(user, tokenString, model.NewPassword);

                    if (resetResult.Succeeded)
                    {
                        // Password reset was successful
                        _logger.LogInformation("Password reset successful");
                        return Ok(new { Message = "Password reset successful. You can now log in with your new password." });
                    }
                    else
                    {
                        // Password reset failed
                        _logger.LogError("Password reset failed: {Errors}", string.Join(", ", resetResult.Errors.Select(e => e.Description)));
                        return BadRequest(new { Message = "Password reset failed." });
                    }
                }
                else
                {
                    // User not found
                    _logger.LogError("User with email '{Email}' does not exist", email);
                    return NotFound(new { Message = "User with this email does not exist." });
                }
            }
            catch (Exception ex)
            {
                // Log any unhandled exceptions
                _logger.LogError(ex, "An error occurred during password reset");
                return StatusCode(500, new { Message = "An error occurred during password reset." });
            }
        }








        private async Task SendPasswordResetEmailAsync(AppUser user, string resetLink)
        {
            try
            {
                var mailSettings = _configuration.GetSection("MailSettings");
                var senderEmail = mailSettings["SenderEmail"];
                var senderName = mailSettings["SenderName"];
                var emailSubject = "Reset Your Password";

                var emailBody = $"Please reset your password by clicking <a href='{resetLink}'>here</a>.";

                var emailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = emailSubject,
                    Body = emailBody,
                    IsBodyHtml = true,
                };
                emailMessage.To.Add(user.Email);

                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = emailSettings["SmtpServer"];
                var smtpPort = Convert.ToInt32(emailSettings["Port"]);
                var useSsl = Convert.ToBoolean(emailSettings["UseSsl"]);
                var username = emailSettings["Username"];
                var password = emailSettings["Password"];

                using (var smtpClient = new SmtpClient(smtpServer))
                {
                    smtpClient.Port = smtpPort;
                    smtpClient.Credentials = new NetworkCredential(username, password);
                    smtpClient.EnableSsl = useSsl;

                    await smtpClient.SendMailAsync(emailMessage);
                }
            }
            catch (SmtpException ex)
            {
                // Log SMTP exception
                _logger.LogError(ex, "SMTP error occurred while sending the password reset email.");
                // Handle the SMTP error or re-throw the exception if necessary.
                throw; // Re-throw the exception to propagate it up the call stack if necessary.
            }
            catch (Exception ex)
            {
                // Log other exceptions
                _logger.LogError(ex, "An error occurred while sending the password reset email.");
                // Handle other exceptions or re-throw if necessary.
                throw; // Re-throw the exception to propagate it up the call stack if necessary.
            }
        }

        //-------------------View Account--------------------------------\\

        [HttpGet]
        [Route("view-account")]
      
        public async Task<IActionResult> ViewAccount()
        {
            try
            {
                var username = User.Identity.Name; // Log the username
                _logger.LogInformation($"Username: {username}");

                var user = await _userManager.FindByNameAsync(username); // Use the logged username

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Return the user's account details
                var accountDetails = new
                {
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    Cell_Number = user.PhoneNumber
                };

                return Ok(accountDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching account details.");
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("update-account")]
        public async Task<IActionResult> UpdateAccount(int studentId, UpdateAccountViewModel model)
        {
            try
            {
                // Find the student by ID instead of using User.Identity.Name
                var student = await _context.Students.FindAsync(studentId);

                if (student == null)
                {
                    return NotFound("Student not found.");
                }

                // Check concurrency for student
              

                // Find the associated user by ID
                var user = await _userManager.FindByIdAsync(student.User_ID);

                if (user == null)
                {
                    return NotFound("User not found.");
                }


                // Check if email is changing and update the username accordingly
                if (!string.IsNullOrEmpty(model.Email) && student.Email != model.Email)
                {
                    var updateEmailResult = await _userManager.SetEmailAsync(user, model.Email);
                    if (!updateEmailResult.Succeeded)
                    {
                        return BadRequest(updateEmailResult.Errors);
                    }

                    var updateUsernameResult = await _userManager.SetUserNameAsync(user, model.Email);
                    if (!updateUsernameResult.Succeeded)
                    {
                        return BadRequest(updateUsernameResult.Errors);
                    }
                }

                // Update AppUser entity (FirstName, LastName, and Email)
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.Email;

                // Update student entity (FirstName, LastName, Email, and Cell_Number)
                student.Name = model.FirstName;
                student.Surname = model.LastName;
                student.Email = model.Email;
                student.Cell_Number = model.Cell_Number;
                student.Subscribed = model.Subscribed;

                // Update the timestamps (assuming you're using auto-generated timestamps in the database)
                user.ConcurrencyStamp = Guid.NewGuid().ToString(); // Generate a new concurrency stamp
                student.Timestamp = student.Timestamp; // No need to update the timestamp manually

                // Save changes to the database
                await _userManager.UpdateAsync(user);
               _context.Update(student) ;
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Account details updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating account details.");
                return BadRequest(ex.Message);
            }
        }





        [HttpPost]
        [Route("update-password")]
        public async Task<IActionResult> UpdatePassword(int studentId, UpdatePasswordViewModel model)
        {
            try
            {
                // Retrieve the student based on the provided studentId
                var student = await _context.Students.FindAsync(studentId);

                if (student == null)
                {
                    return NotFound("Student not found.");
                }

                // Find the associated user using the User_ID from the student
                var user = await _userManager.FindByIdAsync(student.User_ID);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var passwordCorrect = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);

                if (!passwordCorrect)
                {
                    return BadRequest("Current password is incorrect.");
                }

                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                if (result.Succeeded)
                {
                    // Log the user out after changing the password
                    await _signInManager.SignOutAsync();

                    return Ok(new { Message = "Password updated successfully. Please log in with your new password." });
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the password.");
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("delete-account")]
        public async Task<IActionResult> DeleteAccount(int studentId)
        {
            try
            {
                // Retrieve the student based on the provided studentId
                var student = await _context.Students.FindAsync(studentId);

                if (student == null)
                {
                    return NotFound("Student not found.");
                }

                // Find the associated user using the User_ID from the student
                var user = await _userManager.FindByIdAsync(student.User_ID);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Lock the user out
                await _userManager.SetLockoutEnabledAsync(user, false); // Enable logins
                await _userManager.ResetAccessFailedCountAsync(user); // Reset access failed count

                await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);

                // Delete the user
                await _userManager.DeleteAsync(user);

                return Ok(new { Message = "Account deleted successfully. The account has been locked and deleted." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the account.");
                return BadRequest(ex.Message);
            }
        }




    }
}

