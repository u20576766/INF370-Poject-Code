using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace UniBooks_Backend.Models
{
    public class Stock_Take_Line
    {
        [Key]
        [ForeignKey("StockTake")]
        public int StockTake_ID { get; set; }
        public Stock_Take StockTake { get; set; }

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
