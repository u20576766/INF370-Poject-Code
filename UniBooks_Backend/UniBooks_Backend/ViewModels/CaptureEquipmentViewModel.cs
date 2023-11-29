using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class CaptureEquipmentViewModel
    {
        public string Date { get; set; }
        public string Description { get; set; }
        public string Receipt { get; set; }
        public int Supplier_ID { get; set; }

        public int Employee_ID { get; set; }
        public int Quantity_Bought { get; set; }

        public int Equipment_ID { get; set; }

        


    }
}
