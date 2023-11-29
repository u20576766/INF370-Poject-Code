using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Reseller_Book
    {
        [Key]
        public int Reseller_Book_ID { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specifies data precision for decimal
        public decimal Estimated_Price { get; set; }

        [Required]
        public string ImageFront { get; set; }

        [Required]
        public string ImageBack { get; set; }

        [Required]
        public string ImageBinder { get; set; }

        [Required]
        public string ImageOpen { get; set; }

        [Required]
        public int Student_ID { get; set; }
        public Student Students { get; set; }

        [Required]
        public string ISBN { get; set; }
        public Prescribed_Book PrescribedBook { get; set; }

        public int Reseller_Book_Status_ID { get; set; }
        public Reseller_Book_Status ResellerBookStatus { get; set; }

        //link to booking 
        public int? Booking_ID { get; set; }
        public Booking Bookings { get; set; }
    }
}
