using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Voucher
    {
        [Key]
        public int Voucher_ID { get; set; }

        [Required]
        public string Voucher_Code { get; set; }

        [Required, MaxLength(4)]
        public decimal Percent { get; set; }

        [Required, StringLength(10)]
        public string Expiry_Date { get; set; }

        //lungelo
        public List<Order> Orders { get; set; }

        //mapula
        public List<WalkInSale> WalkInSales { get; set; }

    }
}