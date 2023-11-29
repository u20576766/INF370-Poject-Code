using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IEquipmentReportRepository
    {
        List<EquipmentReportViewModel> GenerateEquipmentReport();
    }
}
