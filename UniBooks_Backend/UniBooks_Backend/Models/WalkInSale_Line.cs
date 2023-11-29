using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace UniBooks_Backend.Models
{
    public class WalkInSale_Line
    {
        [Key,MaxLength]
        public int WalkInSale_ID { get; set; }
        public WalkInSale WalkInSales { get; set; }

        [AllowNull]
        public int? Book_ID { get; set; }
        public Book_Inventory Books { get; set; }


        [AllowNull]
        public int? Equipment_ID { get; set; }
        public Equipment Equipments { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }




    }
}
