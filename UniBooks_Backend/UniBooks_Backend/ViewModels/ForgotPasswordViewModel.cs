using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class ForgotPasswordViewModel
    {

        [Required]
        [RegularExpression(@"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$", ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
       
    }
}
