using System;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class ChangeRequest
    {
        [Key, MaxLength(5)]
        public int Request_ID { get; set; }

        [Required, MaxLength(5)]
        public int Student_ID { get; set; }
        public Student Students { get; set; }

        [Required]
        public string Query { get; set; }

        [Required, StringLength(10)]
        public string Submit_Date { get; set; } 

        public int Employee_ID { get; set; }
        public Employee Employees { get; set; }

        public string Response { get; set; }

        [StringLength(10)]
        public string Response_Date { get; set; } 
    }
}

