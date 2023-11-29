using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class OrderStatusViewModel
    {
        public int Order_Status_ID { get; set; }
        public string StatusName { get; set; }
        public string Description { get; set; }
    }
}
