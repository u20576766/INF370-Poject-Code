using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.ViewModels
{
    public class ShoppingCart_EquipmentViewModel
    {
        public int ShoppingCart_ID { get; set; }

        public int Equipment_ID { get; set; }

        public decimal Price { get; set; }

        public string Name { get; set; }

        public string Image { get; set; }

        public int Quantity { get; set; } = 1;
    }
}
