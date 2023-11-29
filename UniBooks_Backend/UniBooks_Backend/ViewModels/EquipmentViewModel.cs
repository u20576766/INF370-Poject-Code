using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class EquipmentViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity_On_Hand { get; set; }
        public string Image { get; set; }
        // public IFormFile Image { get; set; }
        public decimal Amount { get; set; } // Add this property
        public int Module_ID { get; set; }
        public int EquipmentType_ID { get; set; }
    }
}