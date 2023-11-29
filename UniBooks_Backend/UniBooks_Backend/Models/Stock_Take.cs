using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Stock_Take
    {
        [Key]
        public int StockTake_ID { get; set; }

        [Required]
        [StringLength(10)]
        public string Date { get; set; }

        [Required]
        public string Notes { get; set; }

        public List<Stock_Take_Line> StockTakeLine { get; set; }

        [Required]
        public int Employee_ID { get; set; }
        public Employee Employees { get; set; }
    }
}
