using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Repository
{
    public class SaleReportRepository :ISaleReportRepository
    {
        private readonly AppDbContext _dbContext;

        public SaleReportRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<SaleReportViewModel> GetSalesReportAsync()
        {
            var salesReport = new SaleReportViewModel();

            salesReport.TotalSales = await _dbContext.WalkInSales.CountAsync();
            salesReport.TotalRevenue = await _dbContext.WalkInSales.SumAsync(sale => sale.TotalAmount);

            salesReport.TotalBooksSold = await _dbContext.walkinsalebooks.SumAsync(book => book.Quantity);
            salesReport.TotalEquipmentSold = await _dbContext.WalkinsaleEquipment.SumAsync(equipment => equipment.Quantity);
            salesReport.TotalRevenueFromBooks = await _dbContext.walkinsalebooks.SumAsync(book => book.TotalAmount);
            salesReport.TotalRevenueFromEquipment = await _dbContext.WalkinsaleEquipment.SumAsync(equipment => equipment.TotalAmount);

            salesReport.TotalItemsSold = salesReport.TotalBooksSold + salesReport.TotalEquipmentSold;

            salesReport.FacultyBreakdowns = await GetFacultyBreakdownsAsync();
            //salesReport.EquipmentTypeBreakdowns = await GetEquipmentTypeBreakdownsAsync();
            salesReport.DateBreakdowns = await GetDateBreakdownsAsync();
            salesReport.VoucherBreakdowns = await GetVoucherBreakdownsAsync();

            return salesReport;
        }
        private async Task<List<FacultyBreakdown>> GetFacultyBreakdownsAsync()
        {
            var facultyBreakdowns = new List<FacultyBreakdown>();

            var faculties = await _dbContext.Faculties.Include(f => f.Departments).ToListAsync();

            foreach (var faculty in faculties)
            {
                Console.WriteLine($"Processing Faculty: {faculty.Faculty_Name}");

                var facultyBreakdown = new FacultyBreakdown
                {
                    FacultyName = faculty.Faculty_Name,
                    TotalBooksSold = 0,
                    TotalRevenueFromBooks = 0,
                    BooksSoldDetails = new List<Book_Details>()
                };

                foreach (var department in faculty.Departments)
                {
                    Console.WriteLine($"Processing Department: {department.Department_Name}");

                    var modulesInDepartment = await _dbContext.Modules
                        .Where(module => module.Department_ID == department.Department_ID)
                        .ToListAsync();

                    foreach (var module in modulesInDepartment)
                    {
                        Console.WriteLine($"Processing Module: {module.Module_Code}");

                        var prescribedBooksInModule = await _dbContext.PrescribedBook
                            .Where(book => book.Module_ID == module.Module_ID)
                            .ToListAsync();

                        foreach (var prescribedBook in prescribedBooksInModule)
                        {
                            Console.WriteLine($"Processing Prescribed Book: {prescribedBook.Title}");

                            var booksSoldForISBN = await _dbContext.walkinsalebooks
                                .Include(book => book.Books.PrescribedBook)
                                .Where(book => book.Books != null && book.Books.PrescribedBook != null && book.Books.ISBN == prescribedBook.ISBN)
                                .ToListAsync();

                            foreach (var bookSold in booksSoldForISBN)
                            {
                                if (bookSold.Books != null && bookSold.Books.PrescribedBook != null)
                                {
                                    Console.WriteLine($"Processing Sold Book: {bookSold.Books.PrescribedBook.Title}");

                                    facultyBreakdown.TotalBooksSold += bookSold.Quantity;
                                    facultyBreakdown.TotalRevenueFromBooks += bookSold.TotalAmount;

                                    facultyBreakdown.BooksSoldDetails.Add(new Book_Details
                                    {
                                        BookTitle = bookSold.Books.PrescribedBook.Title,
                                        QuantitySold = bookSold.Quantity,
                                        RevenueGenerated = bookSold.TotalAmount
                                    });
                                }
                                else
                                {
                                    Console.WriteLine("Book or PrescribedBook is null.");
                                }
                            }
                        }
                    }
                }

                if (facultyBreakdown.TotalBooksSold > 0) // Skip faculties with no books sold
                {
                    facultyBreakdowns.Add(facultyBreakdown);
                }
            }

            return facultyBreakdowns;
        }
        private async Task<List<DateBreakdown>> GetDateBreakdownsAsync()
        {
            var dateBreakdowns = new List<DateBreakdown>();

            var orderDates = await _dbContext.WalkInSales.Select(order => order.Date).Distinct().ToListAsync();

            foreach (var orderDate in orderDates)
            {
                Console.WriteLine($"Processing orders for date: {orderDate}");

                var dateBreakdown = new DateBreakdown
                {
                    Date = orderDate,
                    TotalOrdersOnDate = 0,
                    TotalRevenueOnDate = 0,
                    OrdersOnDateDetails = new List<SaleDetails>()
                };

                var ordersOnDate = await _dbContext.WalkInSales
                    .Where(order => order.Date == orderDate)
                    .ToListAsync();

                Console.WriteLine($"Number of Orders on date: {ordersOnDate.Count}");

                foreach (var order in ordersOnDate)
                {
                    if (order != null)
                    {
                        Console.WriteLine($"Processing order with ID: {order.WalkInSale_ID}");

                        dateBreakdown.TotalOrdersOnDate++;
                        dateBreakdown.TotalRevenueOnDate += order.TotalAmount;

                        var saleItems = new List<SaleItem>();

                        if (order.walkinsalebooks != null)
                        {
                            foreach (var bookOrder in order.walkinsalebooks)
                            {
                                if (bookOrder != null && bookOrder.Books != null && bookOrder.Books.PrescribedBook != null)
                                {
                                    var book = bookOrder.Books.PrescribedBook;
                                    saleItems.Add(new SaleItem
                                    {
                                        ProductName = book.Title,
                                        Quantity = bookOrder.Quantity,
                                        UnitPrice = bookOrder.TotalAmount / bookOrder.Quantity,
                                        Subtotal = bookOrder.TotalAmount
                                    });
                                }
                            }
                        }

                        if (order.walkinsaleequipment != null)
                        {
                            foreach (var equipmentOrder in order.walkinsaleequipment)
                            {
                                if (equipmentOrder != null && equipmentOrder.Equipments != null)
                                {
                                    var equipment = equipmentOrder.Equipments;
                                    saleItems.Add(new SaleItem
                                    {
                                        ProductName = equipment.Name,
                                        Quantity = equipmentOrder.Quantity,
                                        UnitPrice = equipmentOrder.TotalAmount / equipmentOrder.Quantity,
                                        Subtotal = equipmentOrder.TotalAmount
                                    });
                                }
                            }
                        }

                        dateBreakdown.OrdersOnDateDetails.Add(new SaleDetails
                        {
                            SaleID = order.WalkInSale_ID,
                            saleDate = order.Date,
                            saleTotal = order.TotalAmount,

                            saleItems = saleItems
                        });
                    }
                }

                dateBreakdowns.Add(dateBreakdown);
            }

            return dateBreakdowns;
        }


        private async Task<List<VoucherBreakdown>> GetVoucherBreakdownsAsync()
        {
            var voucherBreakdowns = new List<VoucherBreakdown>();

            var vouchers = await _dbContext.Vouchers.ToListAsync();

            foreach (var voucher in vouchers)
            {
                Console.WriteLine($"Processing voucher with ID: {voucher.Voucher_ID}");

                var ordersWithVoucher = await _dbContext.WalkInSales
                    .Where(order => order.Voucher_ID == voucher.Voucher_ID)
                    .ToListAsync();

                Console.WriteLine($"Number of Orders with Voucher: {ordersWithVoucher.Count}");

                if (ordersWithVoucher.Any()) // Only proceed if orders used this voucher
                {
                    var voucherBreakdown = new VoucherBreakdown
                    {
                        VoucherCode = voucher.Voucher_Code,
                        TotalOrdersWithVoucher = 0,
                        TotalDiscountAmountFromVoucher = 0,
                        OrdersWithVoucherDetails = new List<SaleDetails>()
                    };

                    foreach (var order in ordersWithVoucher)
                    {
                        if (order != null)
                        {
                            voucherBreakdown.TotalOrdersWithVoucher++;
                            voucherBreakdown.TotalDiscountAmountFromVoucher += CalculateDiscountAmount(order);

                            var saleItems = new List<SaleItem>();

                            if (order.walkinsalebooks != null)
                            {
                                foreach (var bookOrder in order.walkinsalebooks)
                                {
                                    if (bookOrder != null && bookOrder.Books != null && bookOrder.Books.PrescribedBook != null)
                                    {
                                        var book = bookOrder.Books.PrescribedBook;
                                        saleItems.Add(new SaleItem
                                        {
                                            ProductName = book.Title,
                                            Quantity = bookOrder.Quantity,
                                            UnitPrice = bookOrder.TotalAmount / bookOrder.Quantity,
                                            Subtotal = bookOrder.TotalAmount
                                        });
                                    }
                                }
                            }

                            if (order.walkinsaleequipment != null)
                            {
                                foreach (var equipmentOrder in order.walkinsaleequipment)
                                {
                                    if (equipmentOrder != null && equipmentOrder.Equipments != null)
                                    {
                                        var equipment = equipmentOrder.Equipments;
                                        saleItems.Add(new SaleItem
                                        {
                                            ProductName = equipment.Name,
                                            Quantity = equipmentOrder.Quantity,
                                            UnitPrice = equipmentOrder.TotalAmount / equipmentOrder.Quantity,
                                            Subtotal = equipmentOrder.TotalAmount
                                        });
                                    }
                                }
                            }

                            voucherBreakdown.OrdersWithVoucherDetails.Add(new SaleDetails
                            {
                                SaleID = order.WalkInSale_ID,
                                saleDate = order.Date,
                                saleTotal = order.TotalAmount,

                                saleItems = saleItems
                            });
                        }
                    }

                    voucherBreakdowns.Add(voucherBreakdown);
                }
                else
                {
                    Console.WriteLine("No orders with this voucher.");
                }
            }

            return voucherBreakdowns;
        }


        private decimal CalculateDiscountAmount(WalkInSale order)
        {
            decimal discountAmount = 0;

            if (order.Vouchers != null && order.Vouchers.Percent > 0)
            {
                decimal discountPercentage = order.Vouchers.Percent;
                decimal orderTotal = order.TotalAmount;

                discountAmount = orderTotal * (discountPercentage / 100);
            }

            return discountAmount;
        }







    }
}
