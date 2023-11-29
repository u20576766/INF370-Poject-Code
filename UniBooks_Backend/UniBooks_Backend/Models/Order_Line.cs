using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Order_Line
    {
        [Key]
        [MaxLength(5)]
        public int Item_ID { get; set; }

        public int? Order_ID { get; set; }
        public Order Orders { get; set; }

        [Required]
        [StringLength(255)]
        public string ItemName { get; set; }

        // Specified decimal length for the Price property
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        public int? Equipment_ID { get; set; }
        public Equipment Equipment { get; set; }

        public int? Book_ID { get; set; }
        public Book_Inventory Book_Inventory { get; set; }

        [Required]
        [Range(1, 99)] // Adjust range as needed
        public int Quantity { get; set; }
    }
}
