using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IStockTakeRepository
    {
        Task<bool> UpdateBookStockAsync(StockTakeViewModel model);
         Task<bool> UpdateEquipmentStockAsync(StockTakeViewModel model);
    }
}
