using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class VAT
    {
        [Key]
        public int VAT_ID { get; set; }

        [Required]
        public decimal Percent { get; set; }
    }
}
