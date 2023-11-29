using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class WalkInSalesEquipment
    {
        [Key]
        public int Equipment_ID { get; set; }
        public Equipment Equipments { get; set; }

        [Key]
        public int WalkInSale_ID { get; set; }
        public WalkInSale Walkinsale { get; set; }


        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }




    }
}
