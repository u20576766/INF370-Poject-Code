using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class ShoppingCart_Equipment
    {
        [ForeignKey("ShoppingCart")]
        public int ShoppingCart_ID { get; set; }
        public ShoppingCart ShoppingCart { get; set; }

        [ForeignKey("Equipments")]
        public int Equipment_ID { get; set; }
        public Equipment Equipments { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public string Image { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        [Range(1, 99)]
        public int Quantity { get; set; }
    }
}
