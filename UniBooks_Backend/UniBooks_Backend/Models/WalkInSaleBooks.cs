using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class WalkInSaleBooks
    {
        [Key]
        public int Book_ID { get; set; }
        public Book_Inventory Books { get; set; }

        [Key]
        public int WalkInSale_ID { get; set; }
        public WalkInSale Walkinsale { get; set; }


        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
