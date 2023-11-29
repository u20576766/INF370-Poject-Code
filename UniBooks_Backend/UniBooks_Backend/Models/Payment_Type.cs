using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Payment_Type
    {
        [Key]
        public int PaymentType_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string PaymentType_Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        // Navigation property for related walk-in sales
        public List<WalkInSale> WalkInSales { get; set; }
    }
}
