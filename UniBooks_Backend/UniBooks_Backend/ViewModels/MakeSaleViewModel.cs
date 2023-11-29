namespace UniBooks_Backend.ViewModels
{
    public class MakeSaleViewModel
    {
        // Student account details
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string CellNumber { get; set; } // Renamed from PhoneNumber to CellNumber

        // Selected items (books and equipment)
        public List<SelectedBookViewModel> SelectedBooks { get; set; }
        public List<SelectedEquipmentViewModel> SelectedEquipment { get; set; }

        // Payment details
        public string PaymentMethod { get; set; }
        public PaymentTypeViewModel SelectedPaymentType { get; set; } // New property to hold the selected payment type
        // Add other payment-related properties as needed

        // Book voucher details
        public string BookVoucherCode { get; set; }
        public decimal DiscountedBookSubtotal { get; set; }

        // Receipt
        public string Receipt { get; set; }
        // Add other receipt-related properties as needed
    }

    public class SelectedBookViewModel
    {
        public int BookID { get; set; }
        public string Image { get; set; }
        public string ISBN { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        // Add other book-related properties as needed
    }

    public class SelectedEquipmentViewModel
    {
        public int EquipmentID { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        // Add other equipment-related properties as needed
    }

    // New ViewModel for Payment Type
    public class PaymentTypeViewModel
    {
        public int PaymentType_ID { get; set; }
        public string PaymentType_Name { get; set; }
        // Add other properties related to Payment Type as needed
    }
}
