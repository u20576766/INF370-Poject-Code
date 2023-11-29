using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Faculty
    {
        // Primary key for the faculty
        [Key]
        public int Faculty_ID { get; set; }

        // Name of the faculty
        [Required]
        [StringLength(150)]
        public string Faculty_Name { get; set; }

        // List of departments associated with the faculty
        public List<Department> Departments { get; set; }
    }
}
