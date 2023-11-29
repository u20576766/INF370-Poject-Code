using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IChangeRequestRepository
    {

        //Adding to repository
        void Add<T>(T entity) where T : class;

        //Saving to repository
        Task<bool> SaveChangesAsync();

        //All
        Task<ChangeRequest[]> GetAllRequestsAsync();

        //By Id
        Task<ChangeRequest> GetChangeRequestAsync(int requestid);

        //BY String
        Task<ChangeRequest[]> GetChangeRequestInputAsync(string input);


    }
}
