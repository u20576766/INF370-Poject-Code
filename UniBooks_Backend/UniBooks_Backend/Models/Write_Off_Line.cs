using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace UniBooks_Backend.Models
{
    public class Write_Off_Line
    {
        [Key, MaxLength(5)]
        public int Write_Off_ID { get; set; }
        public Write_Off WriteOff { get; set; }

        [AllowNull]
        public int? Equipment_ID { get; set; }
        public Equipment Equipments { get; set; }


        [AllowNull]
        public int? Book_ID { get; set; }
        public Book_Inventory Books { get; set; }

        [Required, Range(0, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
