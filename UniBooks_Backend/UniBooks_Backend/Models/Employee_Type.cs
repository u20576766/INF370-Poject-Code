using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Employee_Type
    {
        [Key]
        [MaxLength(5)]
        public int Employee_Type_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        public List<Employee> Employees { get; set; }
    }
}
