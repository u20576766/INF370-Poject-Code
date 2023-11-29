using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public interface IOrderRepository
    {
        void Add<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

        Task<Order[]> GetAllExistingOrdersAsync();

        Task<Order> GetOrderAsync(int studentId);

        Task<Order_Line[]> GetAllOrderLineAsync();

        Task<Order_Line[]> GetAllOrderLineByIdAsync(int studentid);

        Task<Order_Line[]> GetOrderLineSByIdAsync(int orderid);

        Task<Order> VoucherExistsAsync(int voucher_id);

        Task<Order[]> GetOrderByStatus(int statusid);

        Task<Order> GetOrderByIdAsync(int orderid);

        Task<Order> GetOrderByRefAsync(string referenceNumber);

        Task<Order> GetOrderByStudentIdAndStatusIdAsync(int studentid);

        Task<Order_Line[]> GetLatestOrderLinesWithStatus1Async(int studentid);

        Task<Order[]> GetOrderByInputAsync(string referenceNumber);

        Task<Order[]> GetOrderWithNoOrderLinesAsync(int studentid);

    }
}