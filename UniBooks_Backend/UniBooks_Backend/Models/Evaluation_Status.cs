using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace UniBooks_Backend.Models
{
    public class Evaluation_Status
    {
        // Primary key for the evaluation status
        [Key]
        public int Evaluation_Status_ID { get; set; }

        // Name of the evaluation status
        [Required]
        [StringLength(100)]
        public string StatusName { get; set; }

        // Description of the evaluation status
        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        // List of evaluation book logs associated with the evaluation status
        public List<Evalaution_Book_Log> EvalautionBookLog { get; set; }
    }
}
