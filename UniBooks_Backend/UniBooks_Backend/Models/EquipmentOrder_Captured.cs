using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Model
{
    public class EquipmentOrder_Captured
    {
        // Composite key components
        [Key]
        public int Equipment_ID { get; set; }
        public Equipment Equipments { get; set; }

        [Key]
        [MaxLength(5)]
        public int EquipmentOrder_ID { get; set; }
        public EquipmentOrder EquipmentOrders { get; set; }

        // Employee who captured the equipment order
        public int Employee_ID { get; set; }

        // Navigation property to Employee
        public Employee Employees { get; set; }

        // Quantity of equipment bought in the captured order
        [Required]
        [MaxLength(2)]
        public int Quantity_Bought { get; set; }
    }
}
