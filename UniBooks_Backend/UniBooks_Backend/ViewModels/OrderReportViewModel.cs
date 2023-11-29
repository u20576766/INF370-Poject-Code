using System;
using System.Collections.Generic;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.ViewModels
{
    public class OrderReportViewModel
    {
        // Overall Summary
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalItemsSold { get; set; }
        public decimal TotalDiscountsApplied { get; set; }

        //Sales Breakdown by Category(Books and Equipment);
        public int TotalBooksSold { get; set; }
        public int TotalEquipmentSold { get; set; }
       

        // Control Break Sections
        
        public List<OrderDateBreakdown> OrderDateBreakdowns { get; set; }
        public List<OrderVoucherBreakdown> OrderVoucherBreakdowns { get; set; }
        
    }




    public class OrderDateBreakdown
    {
        public DateTime Date { get; set; }
        public int TotalOrdersOnDate { get; set; }
        public decimal TotalRevenueOnDate { get; set; }
        public List<OrderDetails> OrdersOnDateDetails { get; set; }
    }

    public class OrderVoucherBreakdown
    {
        public string VoucherCode { get; set; }
        public int TotalOrdersWithVoucher { get; set; }
        public decimal TotalDiscountAmountFromVoucher { get; set; }
        public List<OrderDetails> OrdersWithVoucherDetails { get; set; }
    }

  

    public class Book_Detail_s
    {
        public string BookTitle { get; set; }
        public int QuantitySold { get; set; }
        public decimal RevenueGenerated { get; set; }
    }

    public class OrderDetails
    {
        public int OrderID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal OrderTotal { get; set; }
        public List<OrderItem> OrderItems { get; set; }
    }

    public class OrderItem
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }
}
