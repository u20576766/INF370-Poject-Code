using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class ResalePercent
    {
        [Key]
        public int Percent_Id { get; set; }
        [Required]
        public decimal Percent_Value { get; set;  }

    }
}
