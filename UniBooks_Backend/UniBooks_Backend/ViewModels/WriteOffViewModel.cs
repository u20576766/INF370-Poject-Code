using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class WriteOffViewModel
    {

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [StringLength(255)]
        public string Reason { get; set; }

       
        public int Book_ID { get; set; }
        public int Equipment_ID { get; set; }
       public int  Employee_ID { get; set; }

    }
}
