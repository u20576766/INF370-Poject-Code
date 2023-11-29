namespace UniBooks_Backend.ViewModels
{
    public class WalkInSaleViewModel
    {
        public decimal TotalAmount { get; set; }
        public DateTime Date { get; set; }
        public int Student_ID { get; set; }
        public int? Voucher_ID { get; set; }
        public int Employee_ID { get; set; }
        public int PaymentType_ID { get; set; }
    }
}
