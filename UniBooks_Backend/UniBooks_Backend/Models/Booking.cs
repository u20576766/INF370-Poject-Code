using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace UniBooks_Backend.Models
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Booking_ID { get; set; }

        [Required]
        public int Num_Of_Books { get; set; }

        [StringLength(10)]
        public string Reference_Num { get; set; }

        [Required]
        public int Schedule_ID { get; set; }
        public Schedule Schedules { get; set; }

        public Evalaution_Book_Log EvaluationBookLog { get; set; }

        public List<Reseller_Book> ResellerBook { get; set; }
    }
}
