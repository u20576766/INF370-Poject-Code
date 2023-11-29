using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace UniBooks_Backend.Repository
{
    public class ShoppingCartRepository : IShoppingCartRepository
    {
        private readonly AppDbContext _appDbContext;

        public ShoppingCartRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<ShoppingCart>> GetAllShoppingCartsAsync()
        {
            var shoppingCarts = await _appDbContext.ShoppingCart
                .Include(cart => cart.ShoppingCartBook)
                .Include(cart => cart.ShoppingCartEquipment)
                .ToListAsync();

            foreach (var cart in shoppingCarts)
            {
                cart.SubTotal = CalculateSubTotal(cart);
            }

            await _appDbContext.SaveChangesAsync();
            return shoppingCarts;
        }

        public decimal CalculateSubTotal(ShoppingCart cart)
        {
            decimal subTotal = 0;

            foreach (var book in cart.ShoppingCartBook)
            {
                // Decrement the book ID by 1
                int adjustedBookID = book.Book_ID;

                var bookPrice = _appDbContext.Prices.FirstOrDefault(p => p.Book_ID == adjustedBookID);
                if (bookPrice != null)
                {
                    subTotal += book.Quantity * bookPrice.Amount;
                }
                else
                {
                    // Log or handle missing price for the book
                }
            }

            foreach (var equipment in cart.ShoppingCartEquipment)
            {
                var equipmentPrice = _appDbContext.Prices.FirstOrDefault(p => p.Equipment_ID == equipment.Equipment_ID);
                var vat = _appDbContext.VATs.FirstOrDefault(); // Assuming you have a single VAT record in the database

                if (equipmentPrice != null && vat != null)
                {
                    // Calculate price with VAT included
                    decimal priceWithVAT = equipmentPrice.Amount + (equipmentPrice.Amount * (vat.Percent / 100));
                    subTotal += equipment.Quantity * priceWithVAT;
                }
                else
                {
                    // Log or handle missing price or VAT for the equipment
                }
            }

            return subTotal;
        }



        public void ClearShoppingAllCarts(int shoppingCartId)
        {
            var shoppingCartBooks = _appDbContext.ShoppingCartBook.Where(sb => sb.ShoppingCart_ID == shoppingCartId);
            var shoppingCartEquipment = _appDbContext.ShoppingCartEquipment.Where(sb => sb.ShoppingCart_ID == shoppingCartId);

            _appDbContext.ShoppingCartBook.RemoveRange(shoppingCartBooks);
            _appDbContext.ShoppingCartEquipment.RemoveRange(shoppingCartEquipment);

            // Recalculate and update subtotal
            var cart = _appDbContext.ShoppingCart.Include(c => c.ShoppingCartBook).Include(c => c.ShoppingCartEquipment)
                .FirstOrDefault(c => c.ShoppingCart_ID == shoppingCartId);

            if (cart != null)
            {
                cart.SubTotal = CalculateSubTotal(cart);
            }

            _appDbContext.SaveChanges(); // Save changes after removing items and updating subtotal
        }



        public async Task<Voucher> GetVoucherPercentageAsync(string? voucherCode)
        {
            if (string.IsNullOrEmpty(voucherCode))
            {
                voucherCode = "VFDEFAULT01";
            }

            IQueryable<Voucher> query = _appDbContext.Vouchers.Where(c => c.Voucher_Code == voucherCode);
            return await query.FirstOrDefaultAsync();
        }


        // Get by Student ID
        public async Task<ShoppingCart> GetShoppingCartByStudentIdAsync(int studentId)
        {
            var shoppingCart = await _appDbContext.ShoppingCart
                .Include(cart => cart.ShoppingCartBook)
                .Include(cart => cart.ShoppingCartEquipment)
                .FirstOrDefaultAsync(cart => cart.StudentID == studentId);

            if (shoppingCart != null)
            {
                shoppingCart.SubTotal = CalculateSubTotal(shoppingCart);
            }

            return shoppingCart;
        }

        // Get by Student ID
        public async Task<ShoppingCart> GetShoppingCartAsync(int cartId)
        {
            var shoppingCart = await _appDbContext.ShoppingCart
                .Include(cart => cart.ShoppingCartBook)
                .Include(cart => cart.ShoppingCartEquipment)
                .FirstOrDefaultAsync(cart => cart.ShoppingCart_ID == cartId);

            if (shoppingCart != null)
            {
                shoppingCart.SubTotal = CalculateSubTotal(shoppingCart);
            }

            return shoppingCart;
        }


        public void Add(ShoppingCart shoppingCart)
        {
            _appDbContext.ShoppingCart.Add(shoppingCart);
        }

        public void DeleteBookItem(int bookID)
        {
            try
            {
                var itemToDelete = _appDbContext.ShoppingCartBook.FirstOrDefault(item => item.Book_ID == bookID);

                if (itemToDelete != null)
                {
                    _appDbContext.ShoppingCartBook.Remove(itemToDelete);
                    _appDbContext.SaveChanges();

                    // Recalculate and update subtotal
                    var cart = _appDbContext.ShoppingCart.Include(c => c.ShoppingCartBook).Include(c => c.ShoppingCartEquipment)
                        .FirstOrDefault(c => c.ShoppingCart_ID == itemToDelete.ShoppingCart_ID);

                    if (cart != null)
                    {
                        cart.SubTotal = CalculateSubTotal(cart);
                        _appDbContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                throw;
            }
        }

        public void DeleteEquipmentItem(int equipID)
        {
            try
            {
                var itemToDelete = _appDbContext.ShoppingCartEquipment.FirstOrDefault(item => item.Equipment_ID == equipID);

                if (itemToDelete != null)
                {
                    _appDbContext.ShoppingCartEquipment.Remove(itemToDelete);
                    _appDbContext.SaveChanges();

                    // Recalculate and update subtotal
                    var cart = _appDbContext.ShoppingCart.Include(c => c.ShoppingCartBook).Include(c => c.ShoppingCartEquipment)
                        .FirstOrDefault(c => c.ShoppingCart_ID == itemToDelete.ShoppingCart_ID);

                    if (cart != null)
                    {
                        cart.SubTotal = CalculateSubTotal(cart);
                        _appDbContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                throw;
            }
        }

        public async Task<ShoppingCart_Book[]> GetCartBookAsync(int studentId)
        {
            var shoppingCart = await _appDbContext.ShoppingCart
               .Include(cart => cart.ShoppingCartBook)
               .Include(cart => cart.ShoppingCartEquipment)
               .FirstOrDefaultAsync(cart => cart.StudentID == studentId);

            IQueryable<ShoppingCart_Book> query = _appDbContext.ShoppingCartBook.Where(c => c.ShoppingCart_ID == shoppingCart.ShoppingCart_ID);
            return await query.ToArrayAsync();
        }

        public async Task<ShoppingCart_Equipment[]> GetCartEquipmentAsync(int studentId)
        {
            var shoppingCart = await _appDbContext.ShoppingCart
              .Include(cart => cart.ShoppingCartBook)
              .Include(cart => cart.ShoppingCartEquipment)
              .FirstOrDefaultAsync(cart => cart.StudentID == studentId);

            IQueryable<ShoppingCart_Equipment> query = _appDbContext.ShoppingCartEquipment.Where(c => c.ShoppingCart_ID == shoppingCart.ShoppingCart_ID);
            return await query.ToArrayAsync();
        }


        public async Task<ShoppingCart_Book> GetBookItem(int bookid)
        {
            return await _appDbContext.ShoppingCartBook.FirstOrDefaultAsync(sb => sb.Book_ID == bookid);
        }

        public async Task<ShoppingCart_Equipment> GetEquipmentItem(int equipid)
        {
            return await _appDbContext.ShoppingCartEquipment.FirstOrDefaultAsync(sb => sb.Equipment_ID == equipid);
        }

    }
}