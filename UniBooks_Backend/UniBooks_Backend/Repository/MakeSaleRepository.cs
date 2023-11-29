using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Repository
{
    public class MakeSaleRepository:IMakeSaleRepository
    {
        private readonly AppDbContext _appDbContext;

        public MakeSaleRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        //Delete item
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }
        public async Task<List<Payment_Type>> GetAllPaymentTypesAsync()
        {
            return await _appDbContext.PaymentType.ToListAsync();
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);
        }

        public void AddWalkInSale(WalkInSale s)
        {
            _appDbContext.WalkInSales.Add(s);
           // _appDbContext.SaveChanges();
        }

        public async Task UpdateEquipmentQuantityAsync(int equipmentId, int quantityChange)
        {
            var equipment = await _appDbContext.Equipments.FindAsync(equipmentId);

            if (equipment != null)
            {
                equipment.Quantity_On_Hand += quantityChange;
               _appDbContext.Equipments.Update(equipment);
            }
        }
        public async Task UpdateBookQuantityAsync(int bookId, int quantityChange)
        {
            var book = await _appDbContext.Books.FindAsync(bookId);

            if (book != null)
            {
                book.Quantity_On_Hand += quantityChange;
                _appDbContext.Books.Update(book);
            }
        }

        public async Task<List<ViewSaleViewModel>> GetSaleSummary()
        {
            var summary = await (
                from walkInSale in _appDbContext.WalkInSales
                join employee in _appDbContext.Employees on walkInSale.Employee_ID equals employee.Employee_ID
                join paymentType in _appDbContext.PaymentType on walkInSale.PaymentType_ID equals paymentType.PaymentType_ID
                join students  in  _appDbContext.Students on walkInSale.Student_ID equals students.Student_ID
                select new ViewSaleViewModel
                {
                    Walkinsale_ID = walkInSale.WalkInSale_ID,
                    TotalAmount = walkInSale.TotalAmount,
                    Employee = $"{employee.Name} {employee.Surname}",
                    Date = walkInSale.Date,
                    PaymentType = paymentType.PaymentType_Name,
                    Students = $"{students.Name}   {students.Surname}",
                }
            ).ToListAsync();

            return summary;
        }





    }
}
