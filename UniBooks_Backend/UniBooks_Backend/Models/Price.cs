using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace UniBooks_Backend.Models
{
    public class Price
    {
        [Key]
        public int Price_ID { get; set; }

        [Required]
        [StringLength(10)]
        public string Date { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specifies data precision for decimal
        public decimal Amount { get; set; }

        public int? Equipment_ID { get; set; }
        public Equipment Equipments { get; set; }

        public int? Book_ID { get; set; }
        public Book_Inventory Books { get; set; }
    }
}
