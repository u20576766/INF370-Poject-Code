using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Add this namespace for the [Column] attribute

namespace UniBooks_Backend.Models
{
    public class Prescribed_Book
    {
        [Key]
        public string ISBN { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string PublisherName { get; set; }

        [Required]
        public string AuthorName { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specifies data precision for decimal
        public decimal BasePrice { get; set; }

        [Required]
        [MaxLength(5)]
        public int Edition { get; set; }

        [Required]
        [MaxLength(4)]
        public int Year { get; set; }

        [Required]
        public int Module_ID { get; set; }
        public Module Modules { get; set; }

        // Navigation property to Reseller_Book
        public List<Reseller_Book> ResellerBook { get; set; }

        // Navigation property to Book_Inventory
        public List<Book_Inventory> Books { get; set; }
    }
}
