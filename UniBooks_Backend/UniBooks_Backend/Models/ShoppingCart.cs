using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class ShoppingCart
    {
        [Key]
        public int ShoppingCart_ID { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Discount { get; set; }

        public int Count { get; set; }

        public decimal TotalAmount { get; set; }

        public int StudentID { get; set; }
        public Student Student { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal SubTotal { get; set; }

        // Navigation property: link to shopping cart book
        public List<ShoppingCart_Book> ShoppingCartBook { get; set; }

        // Navigation property: link to shopping cart equipment
        public List<ShoppingCart_Equipment> ShoppingCartEquipment { get; set; }
    }
}