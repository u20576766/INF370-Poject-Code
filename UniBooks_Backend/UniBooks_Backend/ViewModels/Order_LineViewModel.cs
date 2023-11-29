using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.ViewModels
{
    public class Order_LineViewModel
    {
       
        public int Order_ID { get; set; }
       
        public int ShoppingCart_ID { get; set; }

        public int Quantity { get; set; }
    }
}
