using Microsoft.SqlServer.Dac.Model;
using System.ComponentModel.DataAnnotations;
using DataType = System.ComponentModel.DataAnnotations.DataType;

namespace UniBooks_Backend.ViewModels
{
    public class RegisterUserViewModel
    {
        [Required]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "First name must be at least {2}, and maximum {1} characters")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Last name must be at least {2}, and maximum {1} characters")]
        public string LastName { get; set; }

        [Required]
        [RegularExpression("^0[0-9]{9}$", ErrorMessage = "Cell Number must start with 0 and have exactly 10 characters.")]
        public string Cell_Number { get; set; }

        [Required]
        [RegularExpression(@"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$", ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 8, ErrorMessage = "Password must be at least {2}, and maximum {1} characters")]
        public string Password { get; set; }

        

        public bool Subscribed { get; set; }
        
       
    }
}
