using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IResaleReportRepository
    {
        List<ResaleReportViewModel> GenerateResaleReport();
    }
}
