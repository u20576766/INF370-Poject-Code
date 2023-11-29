using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class WalkInSale
    {
        [Key,MaxLength(5)]
        public int WalkInSale_ID { get; set; }

        [Required,MaxLength(8)]
        public decimal TotalAmount { get; set; }

        [Required]
        public DateTime Date { get; set; }


        public int Student_ID { get; set; }
        public Student Students { get; set; }


        public int? Voucher_ID { get; set; }
        public Voucher Vouchers { get; set; }

        public int Employee_ID { get; set; }
        public Employee Employees { get; set; }

        public int PaymentType_ID { get; set; }
        public Payment_Type PaymentType { get; set; }
     

        public List<WalkInSaleBooks> walkinsalebooks { get; set; }
        public List<WalkInSalesEquipment> walkinsaleequipment { get; set; }


        public List<WalkInSaleBookLink> WalkInSaleBooksLink { get; set; }
        public List<WalkInSaleEquipmentLink> WalkInSaleEquipmentLink { get; set; }
    }

}

