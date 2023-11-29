using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace UniBooks_Backend.Models
{
    public class Department
    {
        [Key]
        [MaxLength(5)]
        public int Department_ID { get; set; }

        [Required]
        [StringLength(150)]
        public string Department_Name { get; set; }

        public int Faculty_ID { get; set; }
        public Faculty Faculties { get; set; }

        public List<Module> Modules { get; set; }
    }
}
