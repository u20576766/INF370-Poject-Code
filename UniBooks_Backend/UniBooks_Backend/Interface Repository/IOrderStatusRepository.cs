using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface IOrderStatusRepository
    {
        Task<Order_Status[]> GetAllOrderStatusAsync();
        Task<Order_Status> GetOrderStatusAsync(int OrderStatus_ID);
    }
}
