namespace UniBooks_Backend.ViewModels
{
    public class ScheduleSummaryViewModel
    {
        public string ScheduleDate { get; set; }
        public string EmployeeName { get; set; }
        public int SlotsAvailable { get; set; }
        public int NumOfBookings { get; set; }
    }
}
