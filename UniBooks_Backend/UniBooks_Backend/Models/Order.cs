using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Order
    {
        // Primary key for the order
        [Key]
        [MaxLength(5)]
        public int Order_ID { get; set; }

        // Order reference number
        [Required]
        [MaxLength(10)] // Adjust the length as needed
        public string Order_Reference_Number { get; set; }

        // Date of the order (format: dd-MM-yyyy)
        [Required]
        [RegularExpression(@"^\d{2}-\d{2}-\d{4}$", ErrorMessage = "Invalid date format. Use dd-MM-yyyy.")]
        [StringLength(10)]
        public string Order_Date { get; set; }

        // Total cost of the order
        [Required]
        [MaxLength(7)]
        public decimal Order_Total { get; set; }

        // Name of the collector (if applicable)
        public string? Collector_Name { get; set; }

        // Date of collection (if applicable)
        public string? Date_Of_Collection { get; set; }

        // Student who placed the order
        [Required]
        public int Student_ID { get; set; }
        public Student Students { get; set; }

        // Status of the order
        [Required]
        public int Order_Status_ID { get; set; }
        public Order_Status OrderStatus { get; set; }

        // Voucher associated with the order (if applicable)
        public int? Voucher_ID { get; set; }
        public Voucher Vouchers { get; set; }

        // Collection of order line items
        public List<Order_Line> OrderLine { get; set; }
    }
}
