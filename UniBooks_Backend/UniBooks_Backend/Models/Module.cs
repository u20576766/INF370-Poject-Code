using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Module
    {
        // Primary key for the module
        [Key]
        [MaxLength(5)]
        public int Module_ID { get; set; }

        // Code of the module
        [Required]
        [StringLength(7)]
        public string Module_Code { get; set; }

        // Description of the module
        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        // Department to which the module belongs
        [Required]
        public int Department_ID { get; set; }
        public Department Departments { get; set; }

        // Link to prescribed books associated with the module
        public List<Prescribed_Book> PrescribedBook { get; set; }

        // Link to equipment associated with the module
        public List<Equipment> Equipments { get; set; }
    }
}
