using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace UniBooks_Backend.Models
{
    public class Evalaution_Book_Log
    {
        // Primary key for the evaluation book log
        [Key]
        public int Evaluation_Book_Log_ID { get; set; }

        // Description of the evaluation book log
        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        [RegularExpression(@"^\d{2}-\d{2}-\d{4}$", ErrorMessage = "Invalid date format. Use dd-MM-yyyy.")]
        public string Date { get; set; }

        // Booking ID associated with the evaluation (nullable)
        public int? Booking_ID { get; set; }
        public Booking Bookings { get; set; }

        // Student ID associated with the evaluation (nullable)
        [AllowNull]
        public int? Student_ID { get; set; }
        public Student Students { get; set; }

        // Resale log associated with the evaluation
        public Resale_Log ResaleLog { get; set; }
    }
}
