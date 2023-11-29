using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Repository
{
    public class VATRepository : IVATRepository
    {
        private readonly AppDbContext _appDbContext;

        public VATRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<VAT> GetVATAsync()
        {
            IQueryable<VAT> query = _appDbContext.VATs;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }



    }
}