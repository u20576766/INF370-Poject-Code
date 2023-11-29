using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _appDbContext;


        public OrderRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }


        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);

        }

        //Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<Order_Line[]> GetAllOrderLineAsync()
        {
            IQueryable<Order_Line> query = _appDbContext.OrderLine;
            return await query.ToArrayAsync();
        }

        public async Task<Order_Line[]> GetAllOrderLineByIdAsync(int student)
        {
            var order_id = await _appDbContext.Orders.Where(c => c.Student_ID == student).FirstOrDefaultAsync();
            IQueryable<Order_Line> query = _appDbContext.OrderLine.Where(o => o.Order_ID == order_id.Order_ID);
            return await query.ToArrayAsync();
        }

        public async Task<Order_Line[]> GetOrderLineSByIdAsync(int orderid)
        {
            IQueryable<Order_Line> query = _appDbContext.OrderLine.Where(o => o.Order_ID == orderid);
            return await query.ToArrayAsync();
        }

        public async Task<Order[]> GetAllExistingOrdersAsync()
        {
            IQueryable<Order> query = _appDbContext.Orders;
            return await query.ToArrayAsync();
        }


        //Get by ID
        public async Task<Order> GetOrderAsync(int studentid)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Student_ID == studentid);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int orderid)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Order_ID == orderid);
            return await query.FirstOrDefaultAsync();
        }


        public async Task<Order> VoucherExistsAsync(int voucher_id)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Voucher_ID == voucher_id);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Order[]> GetOrderByStatus(int statusid)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Order_Status_ID == statusid);
            return await query.ToArrayAsync();
        }

        public async Task<Order> GetOrderByRefAsync(string referenceNumber)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Order_Reference_Number.Contains(referenceNumber) || c.Order_Date.Contains(referenceNumber));
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Order[]> GetOrderByInputAsync(string referenceNumber)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Order_Reference_Number.Contains(referenceNumber) || c.Order_Date.Contains(referenceNumber));
            return await query.ToArrayAsync();
        }

        public async Task<Order> GetOrderByStudentIdAndStatusIdAsync(int studentid)
        {
            IQueryable<Order> query = _appDbContext.Orders.Where(c => c.Student_ID == studentid && c.Order_Status_ID == 1);
            return await query.FirstOrDefaultAsync();
        }



        public async Task<Order[]> GetOrderWithNoOrderLinesAsync(int studentid)
        {
            // Find existing orders with the specified student ID and status ID 1
            var orders = await _appDbContext.Orders
                .Include(o => o.OrderLine) // Include OrderLines related to the order
                .Where(o => o.Student_ID == studentid && o.Order_Status_ID == 1)
                .ToListAsync();

            // Filter orders with no order lines
            var ordersWithNoOrderLines = orders.Where(o => o.OrderLine == null || !o.OrderLine.Any()).ToArray();

            return ordersWithNoOrderLines.Length > 0 ? ordersWithNoOrderLines : null;
        }



        public async Task<Order_Line[]> GetLatestOrderLinesWithStatus1Async(int studentid)
        {
            // Find the most recently created order with the specified student ID and status ID 1
            var latestOrderWithStatus1 = await _appDbContext.Orders
                .Where(c => c.Student_ID == studentid && c.Order_Status_ID == 1)
                .OrderByDescending(c => c.Order_ID) // Order by Order_ID to get the most recent order
                .FirstOrDefaultAsync();

            if (latestOrderWithStatus1 == null)
            {
                // No suitable order with status 1 found
                return new Order_Line[0]; // Return an empty array
            }

            // Get the order lines for the latest order with status 1
            IQueryable<Order_Line> orderLinesQuery = _appDbContext.OrderLine
                .Where(o => o.Order_ID == latestOrderWithStatus1.Order_ID);

            return await orderLinesQuery.ToArrayAsync();
        }




    }
}