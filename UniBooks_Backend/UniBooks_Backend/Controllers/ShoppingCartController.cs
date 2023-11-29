using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Models;
using UniBooks_Backend.Model;
using UniBooks_Backend.Repository;

using System.Globalization;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        private readonly IShoppingCartRepository _spRepository;
        private readonly IShoppingCart_BookRepository _bookRepository;
        private readonly IShoppingCart_EquipmentRepository _equipRepository;
        private readonly AppDbContext _appDbContext;
        private readonly IOrderRepository _orderRepository;

        public ShoppingCartController(IShoppingCartRepository cartRepository, AppDbContext appDbContext, IShoppingCart_EquipmentRepository shoppingCart_EquipRepository, IShoppingCart_BookRepository shoppingCart_BookRepository, IOrderRepository orderRepository)
        {
            _spRepository = cartRepository;
            _appDbContext = appDbContext;
            _bookRepository = shoppingCart_BookRepository;
            _equipRepository = shoppingCart_EquipRepository;
            _orderRepository = orderRepository;
        }

        [HttpGet]
        [Route("GetAllShoppingCarts")]
        public async Task<IActionResult> GetAllShoppingCarts()
        {
            try
            {
                var shoppingCarts = await _spRepository.GetAllShoppingCartsAsync();

                // Calculate and update the total item count for each shopping cart
                foreach (var cart in shoppingCarts)
                {
                    cart.Count = CalculateTotalItemCount(cart);
                }


                await _spRepository.SaveChangesAsync(); // Save the changes to the database


                var results = shoppingCarts.Select(cart => new ShoppingCartViewModel
                {

                    StudentID = cart.StudentID,
                    Discount = cart.Discount,
                    TotalAmount = cart.SubTotal - cart.Discount,
                    SubTotal = cart.SubTotal,
                    Count = cart.Count

                }).ToList();

                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        private int CalculateTotalItemCount(ShoppingCart cart)
        {
            int totalCount = 0;

            foreach (var book in cart.ShoppingCartBook)
            {
                totalCount += book.Quantity;
            }

            foreach (var equipment in cart.ShoppingCartEquipment)
            {
                totalCount += equipment.Quantity;
            }

            cart.Count = totalCount; // Update the Count property

            return totalCount;
        }



        [HttpGet]
        [Route("GetShoppingCart/{studentId}")] // Change parameter name to 'studentId'
        public async Task<IActionResult> GetShoppingCartAsync(int studentId)
        {
            try
            {
                var shoppingCart = await _spRepository.GetShoppingCartByStudentIdAsync(studentId);

                if (shoppingCart == null)
                    return NotFound("ShoppingCart does not exist");

                // Calculate the total item count
                int totalCount = CalculateTotalItemCount(shoppingCart);

                // Assuming the SubTotal property is already set in the repository function
                decimal subTotal = shoppingCart.SubTotal;
                decimal total = shoppingCart.SubTotal - shoppingCart.Discount;

                // Save changes to the database
                await _spRepository.SaveChangesAsync();

                var response = new
                {
                    ShoppingCart = shoppingCart,
                    SubTotal = subTotal,
                    Count = totalCount,
                    TotalAmount = total,
                    Discount = shoppingCart
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }




        [HttpPost]
        [Route("AddShoppingCart/{studentid}")]
        public async Task<IActionResult> CreateShoppingCart(int studentid)
        {

            var newShoppingCart = new ShoppingCart
            {
                StudentID = studentid
            };

            _spRepository.Add(newShoppingCart);
            await _spRepository.SaveChangesAsync();

            return Ok(newShoppingCart);
        }


        [HttpDelete]
        [Route("ClearShoppingCart/{studentId}")]
        public async Task<IActionResult> ClearShoppingCartAsync(int studentId)
        {
            try
            {
                var shoppingCart = await _spRepository.GetShoppingCartByStudentIdAsync(studentId);

                if (shoppingCart == null)
                    return NotFound("ShoppingCart does not exist");

                _spRepository.ClearShoppingAllCarts(shoppingCart.ShoppingCart_ID);
                return Ok(new { message = "Shopping cart cleared successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while clearing the shopping cart.");
            }
        }



        [HttpDelete]
        [Route("DeleteBookItem/{studentId}/{bookID}")]
        public async Task<IActionResult> DeleteBookItem(int studentId, int bookID)
        {
            try
            {
                // Retrieve the cart by student ID
                var shoppingCart = await _spRepository.GetShoppingCartByStudentIdAsync(studentId);

                if (shoppingCart == null)
                {
                    return NotFound(new { message = "Shopping cart not found for the student." });
                }

                // Use the repository function to get the ShoppingCart_Book entity
                var bookItemToDelete = await _bookRepository.GetByBookIdAndCartId(bookID, shoppingCart.ShoppingCart_ID);

                if (bookItemToDelete != null)
                {
                    _appDbContext.ShoppingCartBook.Remove(bookItemToDelete);
                    await _appDbContext.SaveChangesAsync();

                    // Recalculate and update subtotal
                    shoppingCart.SubTotal = _spRepository.CalculateSubTotal(shoppingCart);
                    await _appDbContext.SaveChangesAsync();

                    return Ok(new { message = "Book removed from cart successfully." });
                }
                else
                {
                    return NotFound(new { message = "Book not found in the cart." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }



        [HttpDelete]
        [Route("DeleteEuipItem/{studentId}/{equipID}")]
        public async Task<IActionResult> DeleteEquipItem(int studentId, int equipID)
        {
            try
            {
                // Retrieve the cart by student ID
                var shoppingCart = await _spRepository.GetShoppingCartByStudentIdAsync(studentId);

                if (shoppingCart == null)
                {
                    return NotFound("Shopping cart not found for the student.");
                }

                // Use the repository function to get the ShoppingCart_Book entity
                var equipItemToDelete = await _equipRepository.GetByEquipmentIdAndCartId(equipID, shoppingCart.ShoppingCart_ID);

                if (equipItemToDelete != null)
                {
                    _appDbContext.ShoppingCartEquipment.Remove(equipItemToDelete);
                    await _appDbContext.SaveChangesAsync();

                    // Recalculate and update subtotal
                    shoppingCart.SubTotal = _spRepository.CalculateSubTotal(shoppingCart);
                    await _appDbContext.SaveChangesAsync();

                    return Ok(new { message = "Equipment removed from cart successfully." });

                }
                else
                {
                    return NotFound("Equipment not found in the cart.");
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                throw;
            }
        }

        [HttpGet]
        [Route("CalculateDiscount")]
        public async Task<ActionResult<decimal>> CalculateDiscountAsync(string? voucherCode, int studentid)
        {
            decimal defaultDiscountPercent = 0;
            var voucher = await _spRepository.GetVoucherPercentageAsync(voucherCode);

            decimal voucherPercent = defaultDiscountPercent;
            string voucherExpiryDate = string.Empty;

            if (!string.IsNullOrEmpty(voucherCode) && voucher != null)
            {
                voucherPercent = voucher.Percent;
                voucherExpiryDate = voucher.Expiry_Date;
            }

            if (!string.IsNullOrEmpty(voucherExpiryDate) && DateTime.TryParse(voucherExpiryDate, out DateTime expiryDate))
            {
                if (expiryDate < DateTime.UtcNow)
                {
                    return BadRequest("Voucher has expired.");
                }
            }

            var carts = await _spRepository.GetShoppingCartByStudentIdAsync(studentid);
            var spb = await _bookRepository.CalculateCartTotal(carts.ShoppingCart_ID);
            decimal discountAmount = spb * (voucherPercent / 100);

            // Check if there is an existing order with status 1 and no order lines
            var existingOrders = await _orderRepository.GetOrderWithNoOrderLinesAsync(studentid);

            if (existingOrders != null && existingOrders.Length > 0)
            {
                var existingOrder = existingOrders[0]; // Get the first order from the array

                // Update the existing order with the voucher, total, and other details
                existingOrder.Voucher_ID = (voucherPercent > 0) ? voucher.Voucher_ID : null;
                carts.Discount = discountAmount;
                existingOrder.Order_Total = spb - discountAmount + (carts.SubTotal - spb);

                // Save the changes to the existing order
                await _orderRepository.SaveChangesAsync();
                //return Ok(existingOrder);
            }
            else
            {
                // Generate a random order reference
                Random random = new Random();
                string inputString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                int length = 10; // Desired length of the random selection

                // Select random characters
                string newRef = new string(Enumerable.Range(0, length)
                    .Select(_ => inputString[random.Next(inputString.Length)])
                    .ToArray());

                // Create a new order
                var newOrder = new Order
                {
                    Order_Reference_Number = newRef,
                    Order_Date = DateTime.UtcNow.ToString("dd-MM-yyyy"),
                    Order_Total = spb - discountAmount + (carts.SubTotal - spb),
                    Student_ID = carts.StudentID,
                    Order_Status_ID = 1, // Set the appropriate status ID
                    Voucher_ID = (voucherPercent > 0) ? voucher.Voucher_ID : null
                };

                // Save the new order to the database
                _orderRepository.Add(newOrder);

                // Save changes to the database
                await _orderRepository.SaveChangesAsync();

                //return NotFound("Order Does Not exist");
            }

            var cart = await _spRepository.GetShoppingCartByStudentIdAsync(studentid);

            // Save the discount amount and total amount in the shopping cart
            cart.Discount = discountAmount;
            var totalAmount = spb - discountAmount + (carts.SubTotal - spb);
            cart.TotalAmount = totalAmount;

            // Save the changes to the shopping cart
            await _spRepository.SaveChangesAsync();

            return Ok(discountAmount);
        }




    }

}
