using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Write_Off
    {
        [Key]
        public int Write_Off_ID { get; set; }

        [Required, StringLength(10)]
        public string Write_Off_Date { get; set; }

        [Required, StringLength(255)]
        public string Reason { get; set; }

        public int? Employee_ID { get; set; }
        public Employee Employees { get; set; }

        //link to write off line
        public List<Write_Off_Line> WriteOffLine { get; set; }
    }
}
