using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class UpdateAccountViewModel
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string Cell_Number { get; set; }

        [Required]
        public bool Subscribed { get; set; }
    }
}
