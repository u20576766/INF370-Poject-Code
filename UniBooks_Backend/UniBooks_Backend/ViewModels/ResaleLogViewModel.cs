using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class ResaleLogViewModel
    {
        public string Date { get; set; }
        public decimal Amount_Exchanged { get; set; }
        public string Description { get; set; }
        public int Evalaution_Book_Log_ID { get; set; } // Make sure this has a setter
    }
}
