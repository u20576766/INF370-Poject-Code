using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IScheduleRepository
    {

        Task<bool> SaveChangesAsync();
        void Add<T>(T entity) where T : class;
        void Delete<Schedule>(Schedule schedule) where Schedule : class;
        Task<Schedule[]> GetAllScheduleSlots();
        Task<Schedule> GetSlotAsync(int scheduleid);
        Task<Schedule[]> NotDeletableSlots();
        Task<List<ScheduleSummaryViewModel>> GetSummary();
        IQueryable<ScheduleDatesViewModel> GetSchedulesWithConvertedDate();

    }
}
