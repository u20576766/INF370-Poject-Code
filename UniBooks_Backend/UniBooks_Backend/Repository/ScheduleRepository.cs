using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using System.Globalization;
using System.Linq;



namespace UniBooks_Backend.Repository
{
    public class ScheduleRepository:IScheduleRepository
    {
        private readonly AppDbContext _appDbContext;

        public ScheduleRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }

        public async Task<bool>SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() >0;
        }
         
        //Getting all schedules
        public async Task<Schedule[]> GetAllScheduleSlots()
        {
            IQueryable<Schedule> query = _appDbContext.Schedules;
            return await query.ToArrayAsync();
        }

        //Delete
        public void Delete<Schedule>(Schedule schedule) where Schedule : class
        {
            _appDbContext.Remove(schedule);
        }

        //getting slot by id
        public async Task<Schedule>GetSlotAsync(int scheduleid)
        {
            IQueryable<Schedule> query = _appDbContext.Schedules.Where(y => y.Schedule_ID == scheduleid);
            return await query.FirstAsync();
        }

        //getting deletable slots
        public async Task<Schedule[]> NotDeletableSlots()
        {
            IQueryable<Schedule> query = _appDbContext.Schedules
                .Where(schedule =>
                    schedule.Bookings.Any(booking => booking.Schedule_ID == schedule.Schedule_ID)); // Select schedules with matching bookings

            return await query.ToArrayAsync();
        }



        //summaray
        public async Task<List<ScheduleSummaryViewModel>> GetSummary()
        {
            var summary = await _appDbContext.Schedules
                .Select(schedule => new ScheduleSummaryViewModel
                {
                    ScheduleDate = schedule.Date,
                    EmployeeName = schedule.Employees.Name,
                    SlotsAvailable = schedule.Slots_Available,
                    NumOfBookings = schedule.Bookings.Count
                })
                .ToListAsync();

            return summary;
        }


        //schedule dates you can book 
        //schedule dates you can book 
        public IQueryable<ScheduleDatesViewModel> GetSchedulesWithConvertedDate()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var schedules = _appDbContext.Schedules
                .AsEnumerable()  // Switch to in-memory processing
                .Select(s => new
                {
                    Schedule = s,
                    Year = int.Parse(s.Date.Substring(6, 4)),
                    Month = int.Parse(s.Date.Substring(3, 2)),
                    Day = int.Parse(s.Date.Substring(0, 2))
                })
                .Where(s => new DateTime(s.Year, s.Month, s.Day) >= tomorrow && s.Schedule.Slots_Available > 0)
                .Select(s => new ScheduleDatesViewModel
                {
                    ScheduleId = s.Schedule.Schedule_ID,
                    Date = s.Schedule.Date,
                    DateConverted = new DateTime(s.Year, s.Month, s.Day)
                });

            return schedules.AsQueryable();  // Switch back to IQueryable
        }









    }
}
