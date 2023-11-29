using Azure.Storage.Blobs;
using UniBooks_Backend.ViewModels;
using Microsoft.EntityFrameworkCore;

using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;


namespace UniBooks_Backend.Repositories
{
    public class AuditTrailRepository : IAuditTrailRepository
    {
        private readonly AppDbContext _appDbContext;

        public AuditTrailRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);

        }
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<AuditTrailVM[]> GetAllAuditTrailsAsync()
        {
            IQueryable<AuditTrailVM> query = _appDbContext.AuditTrails
                .Join(
                    _appDbContext.Employees,
                    auditTrail => auditTrail.Employee_ID,
                    employee => employee.Employee_ID,
                    (auditTrail, employee) => new { auditTrail, employee }
                )
                .Join(
                    _appDbContext.AuditEntryTypes,
                    joined => joined.auditTrail.Audit_Entry_Type_ID,
                    auditEntryType => auditEntryType.Audit_Entry_Type_ID,
                    (joined, auditEntryType) => new AuditTrailVM
                    {
                        AuditEntryTypeID = auditEntryType.Audit_Entry_Type_ID,
                        DateTimeStamp = joined.auditTrail.DateTimeStamp,
                        Audit_Entry_Type = auditEntryType.UserAction,
                        Name = joined.employee.Name,
                        Surname = joined.employee.Surname,
                        Comment = joined.auditTrail.Comment
                    }
                );

            return await query.ToArrayAsync();
        }

        public async Task<AuditTrailVM[]> GetFilteredAuditTrailsAsync(DateTime startDate, DateTime endDate)
        {
            IQueryable<AuditTrailVM> query = _appDbContext.AuditTrails
                .Join(
                    _appDbContext.Employees,
                    auditTrail => auditTrail.Employee_ID,
                    employee => employee.Employee_ID,
                    (auditTrail, employee) => new { auditTrail, employee }
                )
                .Join(
                    _appDbContext.AuditEntryTypes,
                    joined => joined.auditTrail.Audit_Entry_Type_ID,
                    auditEntryType => auditEntryType.Audit_Entry_Type_ID,
                    (joined, auditEntryType) => new AuditTrailVM
                    {
                        AuditEntryTypeID = auditEntryType.Audit_Entry_Type_ID,
                        DateTimeStamp = joined.auditTrail.DateTimeStamp,
                        Audit_Entry_Type = auditEntryType.UserAction,
                        Name = joined.employee.Name,
                        Surname = joined.employee.Surname,
                        Comment = joined.auditTrail.Comment
                    }
                )
                .Where(auditTrailVM => auditTrailVM.DateTimeStamp >= startDate && auditTrailVM.DateTimeStamp <= endDate);

            return await query.ToArrayAsync();
        }

        public async Task<AuditTrailVM[]> GetAuditTrailsByFilterAsync(string allCategoriesFilter, string userActionFilter, string nameFilter, string surnameFilter, string commentFilter)
        {
            IQueryable<AuditTrailVM> query = _appDbContext.AuditTrails
                .Join(
                    _appDbContext.Employees,
                    auditTrail => auditTrail.Employee_ID,
                    employee => employee.Employee_ID,
                    (auditTrail, employee) => new { auditTrail, employee }
                )
                .Join(
                    _appDbContext.AuditEntryTypes,
                    joined => joined.auditTrail.Audit_Entry_Type_ID,
                    auditEntryType => auditEntryType.Audit_Entry_Type_ID,
                    (joined, auditEntryType) => new AuditTrailVM
                    {
                        AuditEntryTypeID = auditEntryType.Audit_Entry_Type_ID,
                        DateTimeStamp = joined.auditTrail.DateTimeStamp,
                        Audit_Entry_Type = (auditEntryType.UserAction),
                        Name = (joined.employee.Name),
                        Surname = (joined.employee.Surname),
                        Comment = (joined.auditTrail.Comment)
                    }
                );

            if (!string.IsNullOrWhiteSpace(userActionFilter))
            {
                query = query.Where(auditTrail => auditTrail.Audit_Entry_Type.Contains(userActionFilter));
            }

            if (!string.IsNullOrWhiteSpace(nameFilter))
            {
                query = query.Where(auditTrail => auditTrail.Name.Contains(nameFilter));
            }

            if (!string.IsNullOrWhiteSpace(surnameFilter))
            {
                query = query.Where(auditTrail => auditTrail.Surname.Contains(surnameFilter));
            }

            if (!string.IsNullOrWhiteSpace(commentFilter))
            {
                query = query.Where(auditTrail => auditTrail.Comment.Contains(commentFilter));
            }

            if (!string.IsNullOrWhiteSpace(allCategoriesFilter))
            {
                query = query.Where(auditTrail => auditTrail.Audit_Entry_Type.Contains(allCategoriesFilter) 
                | auditTrail.Comment.Contains(allCategoriesFilter) 
                | auditTrail.Name.Contains(allCategoriesFilter) 
                | auditTrail.Surname.Contains(allCategoriesFilter) 
                | auditTrail.Comment.Contains(allCategoriesFilter));
            }


            return await query.ToArrayAsync();
        }


    }
}
