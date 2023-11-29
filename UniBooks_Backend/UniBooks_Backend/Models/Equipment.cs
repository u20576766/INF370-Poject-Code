using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class Equipment
    {
        [Key]
        [MaxLength(5)]
        public int Equipment_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        [MaxLength(2)]
        public int Quantity_On_Hand { get; set; }

        

        [Required]
        public string Image { get; set; }

        public int Module_ID { get; set; }
        public Module Modules { get; set; }

        public int EquipmentType_ID { get; set; }
        public Equipment_Type Equipment_Types { get; set; }

        //link to price 
        public List<Price> Prices { get; set; }

        //link to write off line
        public List<Write_Off_Line> WriteOffLine { get; set; }

        public List<Stock_Take_Line> StockTakeLine { get; set; }

        //mmapula
        //link to equipmentorder_captured 
        public List<EquipmentOrder_Captured> EquipmentOrder_CapturedEntity { get; set; }
        public List<WalkInSalesEquipment> Walkinsaleequipment { get; set; }
        public List<WalkInSaleEquipmentLink> WalkInSaleEquipmentLink { get; set; }

        //lungelo
        public List<Order_Line> OrderLine { get; set; }
        //link to shopping cart equipment
        public List<ShoppingCart_Equipment> ShoppingCartEquipment { get; set; }
    }
}
