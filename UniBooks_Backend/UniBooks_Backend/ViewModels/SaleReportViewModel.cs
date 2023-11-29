using UniBooks_Backend.Models;

namespace UniBooks_Backend.ViewModels
{
    public class SaleReportViewModel
    {
        // Overall Summary
        public int TotalSales { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalItemsSold { get; set; }
        public decimal TotalDiscountsApplied { get; set; }

        // Sales Breakdown by Category (Books and Equipment)
        public int TotalBooksSold { get; set; }
        public int TotalEquipmentSold { get; set; }
        public decimal TotalRevenueFromBooks { get; set; }
        public decimal TotalRevenueFromEquipment { get; set; }

        // Control Break Sections
        public List<FacultyBreakdown> FacultyBreakdowns { get; set; }
        // public List<EquipmentTypeBreakdown> EquipmentTypeBreakdowns { get; set; }
        public List<DateBreakdown> DateBreakdowns { get; set; }
        public List<VoucherBreakdown> VoucherBreakdowns { get; set; }
    }

    public class FacultyBreakdown
    {
        public string FacultyName { get; set; }
        public int TotalBooksSold { get; set; }
        public decimal TotalRevenueFromBooks { get; set; }
        public List<Book_Details> BooksSoldDetails { get; set; }
    }
    public class DateBreakdown
    {
        public DateTime Date { get; set; }
        public int TotalOrdersOnDate { get; set; }
        public decimal TotalRevenueOnDate { get; set; }
        public List<SaleDetails> OrdersOnDateDetails { get; set; }
    }

    public class VoucherBreakdown
    {
        public string VoucherCode { get; set; }
        public int TotalOrdersWithVoucher { get; set; }
        public decimal TotalDiscountAmountFromVoucher { get; set; }
        public List<SaleDetails> OrdersWithVoucherDetails { get; set; }
    }

    public class Book_Details
    {
        public string BookTitle { get; set; }
        public int QuantitySold { get; set; }
        public decimal RevenueGenerated { get; set; }
    }

    public class SaleDetails
    {
        public int SaleID { get; set; }
        public DateTime saleDate { get; set; }
        public decimal saleTotal { get; set; }

        public Payment_Type PaymentType { get; set; }
        public List<SaleItem> saleItems { get; set; }
    }

    public class SaleItem
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }

}
