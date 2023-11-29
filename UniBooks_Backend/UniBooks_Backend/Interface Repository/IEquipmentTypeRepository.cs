using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IEquipmentTypeRepository
    {
        //Adding to repository
        void Add<T>(T entity) where T : class;

        //Deleting from repository
        void Delete<T>(T entity) where T : class;

        //Saving to repository
        Task<bool> SaveChangesAsync();


        //Getting all/specific Equipment Type from repository
        Task<Equipment_Type[]> GetAllEquipmentTypesAsync();
        Task<Equipment_Type> GetEquipmentTypeAsync(int EquipmentType_ID);
        Task<Equipment_Type[]> GetEquipmentTypeInputAsync(string input);

    }
}
