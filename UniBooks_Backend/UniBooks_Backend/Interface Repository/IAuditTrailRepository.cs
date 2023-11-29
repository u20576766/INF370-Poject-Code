using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.InterfaceRepositories
{
    public interface IAuditTrailRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

        Task<AuditTrailVM[]> GetAllAuditTrailsAsync();

        Task<AuditTrailVM[]> GetFilteredAuditTrailsAsync(DateTime startDate, DateTime endDate);

        Task<AuditTrailVM[]> GetAuditTrailsByFilterAsync(string allCategoriesFilter, string userActionFilter, string nameFilter, string surnameFilter, string commentFilter);

    }
}
