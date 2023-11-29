using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Evaluation_Booking
    {
        // Primary key for the evaluation booking
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Booking_ID { get; set; }

        // Number of books for the evaluation booking
        [Required]
        public int Num_Of_Books { get; set; }

        // Reference number for the evaluation booking (optional)
        [StringLength(10)]
        public string Reference_Num { get; set; }

        // Schedule ID associated with the evaluation booking
        [Required]
        public int Schedule_ID { get; set; }
        public Schedule Schedules { get; set; }

        // Evaluation book log associated with the evaluation booking
        public Evalaution_Book_Log EvaluationBookLog { get; set; }

        // List of reseller books associated with the evaluation booking
        public List<Reseller_Book> ResellerBook { get; set; }
    }
}
