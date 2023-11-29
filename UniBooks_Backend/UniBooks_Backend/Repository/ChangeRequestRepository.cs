using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class ChangeRequestRepository : IChangeRequestRepository
    {

        private readonly AppDbContext _appDbContext;

        public ChangeRequestRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        //Add item
        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }

        //Save changes to database
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }


        //Get All saved
        public async Task<ChangeRequest[]> GetAllRequestsAsync()
        {
            IQueryable<ChangeRequest> query = _appDbContext.ChangeRequests;
            return await query.ToArrayAsync();
        }

        //Get by ID
        public async Task<ChangeRequest> GetChangeRequestAsync(int requestid)
        {
            IQueryable<ChangeRequest> query = _appDbContext.ChangeRequests.Where(c => c.Request_ID == requestid);
            return await query.FirstOrDefaultAsync();
        }

        //Get by String
        public async Task<ChangeRequest[]> GetChangeRequestInputAsync(string input)
        {
            var studentid = Convert.ToInt32(input);
            IQueryable<ChangeRequest> query = _appDbContext.ChangeRequests.Where(c => c.Response_Date.Contains(input) || c.Submit_Date.Contains(input) || c.Student_ID == studentid);
            return await query.ToArrayAsync();
        }
    }
}
