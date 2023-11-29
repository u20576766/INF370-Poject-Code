using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class EvaluationBookLogViewModel
    {
        public string Description { get; set; }
        public string Date { get; set; }

        public int BookingId { get; set; }

        public int? Student_ID { get; set; } 
    } 
}
