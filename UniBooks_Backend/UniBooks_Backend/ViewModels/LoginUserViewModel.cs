using Microsoft.SqlServer.Dac.Model;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class LoginUserViewModel
    {
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
