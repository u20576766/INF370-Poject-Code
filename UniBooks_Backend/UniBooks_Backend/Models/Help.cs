using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Help
    {
        // Primary key for the help entry
        [Key]
        [MaxLength(5)]
        public int Help_ID { get; set; }

        // Date of the help entry
        [Required]
        [RegularExpression(@"^\d{2}-\d{2}-\d{4}$", ErrorMessage = "Invalid date format. Use dd-MM-yyyy.")]
        public string Date { get; set; }

        // Name of the help entry
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        // Description of the help entry
        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        // File name of the help resource
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }

        // Path to the help resource file
        [Required]
        public string FilePath { get; set; }

        // Employee who created the help entry
        public int Employee_ID { get; set; }
        public Employee Employees { get; set; }
    }
}
