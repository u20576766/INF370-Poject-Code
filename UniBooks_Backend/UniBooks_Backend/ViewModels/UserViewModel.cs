using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class LoginUseViewModel
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JWT { get; set; }
        public string UserName { get; internal set; }
        public string Password { get; internal set; }
        public string Email { get; internal set; }
    }
}
