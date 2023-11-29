using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class Schedule
    {
        [Key,MaxLength(5)]
        public int Schedule_ID { get; set; }

        [Required, StringLength(10)]
        public string Date { get; set; }

        [Required, MaxLength(1)]
        public int Slots_Available { get; set; }

        [Required]
        public int Employee_ID { get; set; }
        public Employee Employees { get; set; } 

        public List<Booking> Bookings { get; set; }
    }
}
