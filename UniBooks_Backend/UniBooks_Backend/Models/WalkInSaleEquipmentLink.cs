using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class WalkInSaleEquipmentLink
    {
        public int WalkInSale_ID { get; set; }
        public WalkInSale WalkInSale { get; set; }

        public int Equipment_ID { get; set; }
        public Equipment Equipment { get; set; }

        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
