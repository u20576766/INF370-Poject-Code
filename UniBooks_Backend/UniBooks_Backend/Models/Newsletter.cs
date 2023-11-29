using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Newsletter
    {
        // Primary key for the newsletter
        [Key]
        public int Newsletter_ID { get; set; }

        // Subject of the newsletter
        [Required]
        [StringLength(100)]
        public string Subject { get; set; }

        // Description of the newsletter
        [Required]
        [StringLength(100)]
        public string Description { get; set; }

        // Filename of the newsletter file
        [Required]
        public string FileName { get; set; }

        // File path of the newsletter
        [Required]
        public string FilePath { get; set; }

        // Employee who created the newsletter
        [Required]
        public int Employee_ID { get; set; }
        public Employee Employees { get; set; }

        // Link to student newsletters associated with this newsletter
        public List<Student_Newsletter> StudentNewsletter { get; set; }
    }
}
