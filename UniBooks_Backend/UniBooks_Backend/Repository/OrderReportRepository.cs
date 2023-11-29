using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;

public class OrderReportRepository : IOrderReportRepository
{
    private readonly AppDbContext _context;

    public OrderReportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderReportViewModel> GenerateOrderReportAsync()
    {
        var reportViewModel = new OrderReportViewModel();

        // Overall Summary
        Console.WriteLine("Calculating Overall Summary...");
        reportViewModel.TotalOrders = await _context.Orders.CountAsync();
        reportViewModel.TotalRevenue = await _context.Orders.SumAsync(o => o.Order_Total);
        reportViewModel.TotalItemsSold = await _context.OrderLine.SumAsync(ol => ol.Quantity);
        reportViewModel.TotalDiscountsApplied = await _context.Orders
            .Where(o => o.Vouchers != null) // Check if there's a voucher associated with the order
            .SumAsync(o => o.Vouchers.Percent);

        Console.WriteLine("Overall Summary Calculated.");

        // Sales Breakdown by Category
        Console.WriteLine("Calculating Sales Breakdown...");
        reportViewModel.TotalBooksSold = await _context.OrderLine
            .Where(ol => ol.Book_Inventory != null) // Check if there's a book associated with the order line
            .SumAsync(ol => ol.Quantity);
        reportViewModel.TotalEquipmentSold = await _context.OrderLine
             .Where(ol => ol.Equipment != null) // Check if there's equipment associated with the order line
             .SumAsync(ol => ol.Quantity);

        var bookLines = await _context.OrderLine
     .Where(ol => ol.Book_Inventory != null)
     .ToListAsync();

        Console.WriteLine("Sales Breakdown Calculated.");

        // Control Break Sections
        Console.WriteLine("Generating Order Date Breakdowns...");
        reportViewModel.OrderDateBreakdowns = await GenerateOrderDateBreakdownsAsync();
        Console.WriteLine("Order Date Breakdowns Generated.");

        Console.WriteLine("Generating Order Voucher Breakdowns...");
        reportViewModel.OrderVoucherBreakdowns = await GenerateOrderVoucherBreakdownsAsync();
        Console.WriteLine("Order Voucher Breakdowns Generated.");

        return reportViewModel;
    }


    private async Task<List<OrderDateBreakdown>> GenerateOrderDateBreakdownsAsync()
    {
        var orderDateBreakdowns = _context.Orders
            .AsEnumerable() // Switch to in-memory processing
            .GroupBy(o => DateTime.Parse(o.Order_Date).Date)
            .Select(group => new OrderDateBreakdown
            {
                Date = group.Key,
                TotalOrdersOnDate = group.Count(),
                TotalRevenueOnDate = group.Sum(o => o.Order_Total),
                OrdersOnDateDetails = group.Select(o => new OrderDetails
                {
                    OrderID = o.Order_ID,
                    OrderDate = DateTime.Parse(o.Order_Date),
                    OrderTotal = o.Order_Total,
                    OrderItems = o.OrderLine?.Select(ol => new OrderItem
                    {
                        ProductName = ol.Book_Inventory != null ? ol.Book_Inventory.PrescribedBook?.Title : ol.Equipment?.Name,
                        Quantity = ol.Quantity,
                        UnitPrice = (decimal)(ol.Book_Inventory != null ? ol.Book_Inventory.Prices.OrderByDescending(p => DateTime.Parse(p.Date).Date).FirstOrDefault()?.Amount : ol.Equipment?.Prices.OrderByDescending(p => DateTime.Parse(p.Date).Date).FirstOrDefault()?.Amount ?? 0m), // Convert nullable decimal? to decimal
                        Subtotal = ol.Quantity * (decimal)(ol.Book_Inventory != null ? ol.Book_Inventory.Prices.OrderByDescending(p => DateTime.Parse(p.Date).Date).FirstOrDefault()?.Amount : ol.Equipment?.Prices.OrderByDescending(p => DateTime.Parse(p.Date).Date).FirstOrDefault()?.Amount ?? 0m) // Convert nullable decimal? to decimal
                    }).ToList()
                }).ToList()
            }).ToList();

        return orderDateBreakdowns;
    }







    private async Task<List<OrderVoucherBreakdown>> GenerateOrderVoucherBreakdownsAsync()
    {
        var orderVoucherBreakdowns = await _context.Orders
            .Where(o => o.Voucher_ID != null)
            .GroupBy(o => o.Vouchers.Voucher_Code)
            .Select(group => new OrderVoucherBreakdown
            {
                VoucherCode = group.Key,
                TotalOrdersWithVoucher = group.Count(),
                TotalDiscountAmountFromVoucher = group.Sum(o => o.Vouchers.Percent),
                OrdersWithVoucherDetails = group.Select(o => new OrderDetails
                {
                    OrderID = o.Order_ID,
                    OrderDate = DateTime.Parse(o.Order_Date),
                    OrderTotal = o.Order_Total,
                    OrderItems = o.OrderLine.Select(ol => new OrderItem
                    {
                        ProductName = ol.Book_Inventory != null ? ol.Book_Inventory.PrescribedBook.Title : ol.Equipment.Name,
                        Quantity = ol.Quantity,
                        UnitPrice = ol.Book_Inventory != null ? ol.Book_Inventory.Prices.OrderByDescending(p => p.Date).FirstOrDefault().Amount : ol.Equipment.Prices.OrderByDescending(p => p.Date).FirstOrDefault().Amount,
                        Subtotal = ol.Quantity * (ol.Book_Inventory != null ? ol.Book_Inventory.Prices.OrderByDescending(p => p.Date).FirstOrDefault().Amount : ol.Equipment.Prices.OrderByDescending(p => p.Date).FirstOrDefault().Amount)
                    }).ToList()
                }).ToList()
            }).ToListAsync();

        return orderVoucherBreakdowns;
    }

    

}
