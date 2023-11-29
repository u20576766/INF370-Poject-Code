using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    
    public class StockTakeViewModel
    {
        public int Quantity_On_Hand { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [StringLength(255)]
        public string Notes { get; set; }
        public int Book_ID { get; set; }
        public int Equipment_ID { get;  set; }
        public int Employee_ID { get; set; }
    }
}
