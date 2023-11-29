using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Order_Status
    {
        [Key]
        [MaxLength(5)]
        public int Order_Status_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string StatusName { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        // Navigation property for related orders
        public List<Order> Orders { get; set; }
    }
}
