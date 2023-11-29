using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Equipment_Type
    {
        [Key]
        [MaxLength(5)]
        public int EquipmentType_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        //link to equipment 
        public List<Equipment> Equipments { get; set; }
    }
}
