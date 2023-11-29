using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class WalkInSaleBookLink
    {
        public int WalkInSale_ID { get; set; }
        public WalkInSale WalkInSale { get; set; }

        public int Book_ID { get; set; }
        public Book_Inventory Book { get; set; }

        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }

        public List<WalkInSaleBooks> WalkInSalesBooks { get; set; }
    }
}
