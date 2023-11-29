using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Resale_Log
    {
        [Key]
        [Range(1, 99999)] // Assuming this is the valid range for your ID
        public int ResaleLog_ID { get; set; }

        [Required, StringLength(10)]
        public string Date { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specifies data precision for decimal
        public decimal Amount_Exchanged { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        public int Evaluation_Book_Log_ID { get; set; }
        public Evalaution_Book_Log EvalautionBookLog { get; set; }
    }
}
