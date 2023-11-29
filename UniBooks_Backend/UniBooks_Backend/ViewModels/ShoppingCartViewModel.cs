using System.Collections.Generic;

namespace UniBooks_Backend.ViewModels
{
    public class ShoppingCartViewModel
    {
        public int ShoppingCart_ID { get; set; }
        public int StudentID { get; set; }
        public decimal Discount { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TotalAmount { get; set; }
        public int Count { get; set; }
    }
}

