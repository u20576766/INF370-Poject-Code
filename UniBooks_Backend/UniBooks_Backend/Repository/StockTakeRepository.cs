using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Repository
{
    public class StockTakeRepository : IStockTakeRepository
    {
        private readonly AppDbContext _appDbContext;

        public StockTakeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<bool> UpdateBookStockAsync(StockTakeViewModel model)
        {
            try
            {
                var book = await _appDbContext.Books.FindAsync(model.Book_ID);
                if (book == null)
                    return false;

                // Create new Stock_Take entity

                 if(model.Equipment_ID == 0)
                {
                    var stockTake = new Stock_Take
                    {
                        Date = DateTime.UtcNow.ToString("dd-MM-yyyy"),
                        Notes = model.Notes,
                        Employee_ID = model.Employee_ID,
        

                    };
                    // Save changes to create Stock_Take and get its ID
                    _appDbContext.StockTake.Add(stockTake);
                    await _appDbContext.SaveChangesAsync();

                    // Create new Stock_Take_Line entity using the generated StockTake_ID
                    var stockTakeLine = new Stock_Take_Line
                    {
                        StockTake_ID = stockTake.StockTake_ID, // Use the generated ID
                        Book_ID = model.Book_ID,
                        Quantity = model.Quantity,// Computer quantity
                        Equipment_ID = null

                    };

                    // Associate Stock_Take_Line with Stock_Take
                    _appDbContext.StockTakeLine.Add(stockTakeLine);

                    // Save changes again to add Stock_Take_Line
                    await _appDbContext.SaveChangesAsync();

                    // Update Book_Inventory entity
                    book.Quantity_On_Hand = model.Quantity_On_Hand;

                    // Save changes to update Book_Inventory
                    await _appDbContext.SaveChangesAsync();

                    return true;


                }
                else
                { return false; }
             
               
            }
            catch (Exception)
            {
                // Handle exception
                return false;
            }
        }


        

        public async Task<bool> UpdateEquipmentStockAsync(StockTakeViewModel model)
        {
            try
            {
                var equipment = await _appDbContext.Equipments.FindAsync(model.Equipment_ID);
                if (equipment == null)
                    return false;

                // Create new Stock_Take entity

                if (model.Book_ID == 0)
                {
                    var stockTake = new Stock_Take
                    {
                        Date = DateTime.UtcNow.ToString("dd-MM-yyyy"),
                        Notes = model.Notes,
                        Employee_ID = model.Employee_ID,


                    };
                    // Save changes to create Stock_Take and get its ID
                    _appDbContext.StockTake.Add(stockTake);
                    await _appDbContext.SaveChangesAsync();

                    // Create new Stock_Take_Line entity using the generated StockTake_ID
                    var stockTakeLine = new Stock_Take_Line
                    {
                        StockTake_ID = stockTake.StockTake_ID, // Use the generated ID
                        Book_ID = null,
                        Quantity = model.Quantity,// Computer quantity
                        Equipment_ID = model.Equipment_ID

                    };

                    // Associate Stock_Take_Line with Stock_Take
                    _appDbContext.StockTakeLine.Add(stockTakeLine);

                    // Save changes again to add Stock_Take_Line
                    await _appDbContext.SaveChangesAsync();

                    // Update Book_Inventory entity
                    equipment.Quantity_On_Hand = model.Quantity_On_Hand;

                    // Save changes to update Book_Inventory
                    await _appDbContext.SaveChangesAsync();

                    return true;


                }
                else
                { return false; }


            }
            catch (Exception)
            {
                // Handle exception
                return false;
            }
        }












    }
}
