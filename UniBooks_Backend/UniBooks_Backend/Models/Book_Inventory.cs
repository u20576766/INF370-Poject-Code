using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Book_Inventory
    {
        [Key]
        [MaxLength(5)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Book_ID { get; set; }

        [Required, MaxLength(2)]
        public int Quantity_On_Hand { get; set; }

        [Required]
        public string Image { get; set; }

        [Required]
        public string ISBN { get; set; }

        public Prescribed_Book PrescribedBook { get; set; }

        public List<Write_Off_Line> WriteOffLine { get; set; }
        public List<Stock_Take_Line> StockTakeLine { get; set; }
        public List<Price> Prices { get; set; }

        public List<WalkInSaleBooks> Walkinsalesbooks { get; set; }
        public List<WalkInSaleBookLink> WalkInSalesBooksLink { get; set; }

        public List<ShoppingCart_Book> ShoppingCartBook { get; set; }
        public List<Order_Line> OrderLine { get; set; }
    }
}
