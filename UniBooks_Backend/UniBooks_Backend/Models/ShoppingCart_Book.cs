using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class ShoppingCart_Book
    {
        [ForeignKey("Books")]
        public int Book_ID { get; set; }
        public Book_Inventory Books { get; set; }

        [ForeignKey("ShoppingCart")]
        public int ShoppingCart_ID { get; set; }
        public ShoppingCart ShoppingCart { get; set; }

        [MaxLength(100)]
        public string Title { get; set; }

        public string Image { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        [Range(1, 99)]
        public int Quantity { get; set; }
    }
}
