using System.Threading.Tasks;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;

namespace UniBooks_Backend
{
    public interface IModuleRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<Module[]> GetAllModulesAsync();

        Task<bool> SaveChangesAsync();
        //Get by ID
        Task<Module> GetModuleAsync(int ModuleID);

        //Get by string
        Task<Module[]> GetModuleInputAsync(string input);

        Task<Module> GetModuleByCodeAsync(string moduleCode);


        void Delete(Module existingModule);
    }
}
