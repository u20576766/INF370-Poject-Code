using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class ChangeRequestViewModel
    {
        [Required]
        public int Student_ID { get; set; }

        [Required]
        public string Query { get; set; }

        [Required]
        public string Submit_Date { get; set; } 

        public int Employee_ID { get; set; }

        public string Response { get; set; }

        [StringLength(10)]
        public string Response_Date { get; set; }
    }
}
