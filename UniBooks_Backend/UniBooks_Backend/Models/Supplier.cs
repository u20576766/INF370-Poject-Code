using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Model
{
    public class Supplier
    {

        [Key]
        [MaxLength(5)]
        public int Supplier_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Supplier_Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Supplier_Email { get; set; }


        [Required][StringLength(10)]
        public string Supplier_CellNumber { get; set; }


        [Required]
        [StringLength(255)]
        public string Supplier_Address { get; set; }
   
    
        //link to equipmentorder 
        public List<EquipmentOrder> EquipmentOrders { get; set; }
    }
}
