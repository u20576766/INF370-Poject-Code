using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class OrderStatusRepository : IOrderStatusRepository
    {
        private readonly AppDbContext _appDbContext;

        public OrderStatusRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        public async Task<Order_Status[]> GetAllOrderStatusAsync()
        {
            IQueryable<Order_Status> query = _appDbContext.OrderStatus;
            return await query.ToArrayAsync();
        }

        //Get by ID
        public async Task<Order_Status> GetOrderStatusAsync(int OrderStatus_ID)
        {
            IQueryable<Order_Status> query = _appDbContext.OrderStatus.Where(c => c.Order_Status_ID == OrderStatus_ID);
            return await query.FirstOrDefaultAsync();
        }
    }
}
