using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IVATRepository
    {
        Task<VAT> GetVATAsync();
        Task<bool> SaveChangesAsync();
    }
}
