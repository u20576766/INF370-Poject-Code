using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class AppUser:IdentityUser
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;

        public Employee Employees { get; set; }
        public Student Students { get; set; }
    }
}
