using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class EquipmentOrder
    {
        [Key]
        [MaxLength(5)]
        public int EquipmentOrder_ID { get; set; }

        [Required]
        [RegularExpression(@"^\d{2}-\d{2}-\d{4}$", ErrorMessage = "Invalid date format. Use dd-MM-yyyy.")]
        public string Date { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        public string Receipt { get; set; }

        public int Supplier_ID { get; set; }
        public Supplier Suppliers { get; set; }

        // Link to equipmentorder_captured 
        public List<EquipmentOrder_Captured> EquipmentOrder_CapturedEntity { get; set; }
    }
}
