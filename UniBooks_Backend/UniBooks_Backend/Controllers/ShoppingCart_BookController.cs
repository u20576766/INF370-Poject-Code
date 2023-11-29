using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Model;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repository;
using System.Net;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCart_BookController : ControllerBase
    {
        private readonly IShoppingCart_BookRepository _ShoppingCart_BookRepository;
        private readonly IBook_InventoryRepository _BookInventoryRepository;
        private readonly IPrescribedBookRepository _PrescribedBookRepository;
        private readonly IShoppingCartRepository _ShoppingCartRepository;
        private readonly AppDbContext _appDbContext;

        public ShoppingCart_BookController(IShoppingCart_BookRepository ShoppingCart_BookRepository, IBook_InventoryRepository book_InventoryRepository, IPrescribedBookRepository prescribedBookRepository, IShoppingCartRepository shoppingCartRepository, AppDbContext appDbContext)
        {
            _ShoppingCart_BookRepository = ShoppingCart_BookRepository;
            _BookInventoryRepository = book_InventoryRepository;
            _PrescribedBookRepository = prescribedBookRepository;
            _ShoppingCartRepository = shoppingCartRepository;
            _appDbContext = appDbContext;
        }

        [HttpGet]
        [Route("GetShoppingCart_Books/{studentID}")]
        public async Task<IActionResult> GetShoppingCart_Books(int studentID)
        {
            try
            {
                var cart = await _ShoppingCartRepository.GetShoppingCartByStudentIdAsync(studentID);
                var results = await _ShoppingCart_BookRepository.GetShoppingCart_BooksAsync(cart.ShoppingCart_ID);

                // Create a list to hold the view models
                var viewModels = new List<ShoppingCart_BookViewModel>();

                foreach (var item in results)
                {
                    var viewModel = new ShoppingCart_BookViewModel
                    {
                        ShoppingCart_ID = item.ShoppingCart_ID,
                        Book_ID = item.Book_ID,
                        Price = item.Price,
                        Title = item.Title,
                        Image = item.Image,
                        Quantity = item.Quantity// You can set the quantity based on your requirements
                    };

                    viewModels.Add(viewModel);
                }

                return Ok(viewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }


        [HttpPost]
        [Route("AddShoppingCart_Book/{studentId}")]
        public async Task<IActionResult> AddShoppingCart_Book(ShoppingCart_BookViewModel SCE, int studentId)
        {
            try
            {
                var bookDetails = await _BookInventoryRepository.GetBookByIdAsync(SCE.Book_ID);
                var cart = await _ShoppingCartRepository.GetShoppingCartByStudentIdAsync(studentId);

                if (bookDetails == null)
                {
                    return NotFound("Book not found");
                }

                if (cart == null)
                {
                    return NotFound("Shopping cart not found");
                }

                var bookPrice = await _BookInventoryRepository.GetPriceByBookIdAsync(SCE.Book_ID);

                if (bookPrice == null)
                {
                    return NotFound("Price not found");
                }

                string bookISBN = bookDetails.ISBN;
                var prescribedBook = await _PrescribedBookRepository.GetPrescribedBookByISBNAsync(bookISBN);

                if (prescribedBook == null)
                {
                    return NotFound("Prescribed book not found");
                }


                var newCartBook = new ShoppingCart_Book
                {
                    ShoppingCart_ID = cart.ShoppingCart_ID,
                    Book_ID = SCE.Book_ID,
                    Image = bookDetails.Image,
                    Price = bookPrice.Amount,
                    Title = prescribedBook.Title,
                    Quantity = 1
                };

                await _ShoppingCart_BookRepository.AddOrUpdateBookInCart(newCartBook);
                await _ShoppingCart_BookRepository.SaveChangesAsync();

                return Ok(newCartBook);
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request");
            }
        }


        // Increment Book in cart
        [HttpPut]
        [Route("IncreaseBook/{bookid}/{studentid}")]
        public async Task<IActionResult> IncreaseBook(int bookid, int studentid)
        {
            try
            {
                // Get the equipment item from the shopping cart
                var bookItem = await _appDbContext.ShoppingCartBook
                    .FirstOrDefaultAsync(e => e.Book_ID == bookid && e.ShoppingCart.StudentID == studentid);

                if (bookItem != null)
                {
                    // Get the book item's quantity in the book inventory table
                    var bookInventory = await _BookInventoryRepository.GetBookByIdAsync(bookid);

                    if (bookInventory != null)
                    {
                        // Check if the cart quantity is less than the inventory quantity
                        if (bookItem.Quantity < bookInventory.Quantity_On_Hand)
                        {
                            // Increment the quantity by 1
                            bookItem.Quantity += 1;

                            await _appDbContext.SaveChangesAsync();

                            return Ok(new { message = "Book quantity increased successfully." });
                        }
                        else
                        {
                            return BadRequest(new { message = "The limit of books in stock has been reached." });
                        }
                    }
                    else
                    {
                        return NotFound(new { message = "Book not found in the inventory." });
                    }
                }
                else
                {
                    return NotFound(new { message = "Equipment not found in the cart." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while increasing the book's quantity." });
            }
        }

        // Decrement Book in cart
        [HttpPut]
        [Route("DecreaseBook/{bookid}/{studentid}")]
        public async Task<IActionResult> DecreaseBook(int bookid, int studentid)
        {
            try
            {
                // Get the book item from the shopping cart
                var bookItem = await _appDbContext.ShoppingCartBook
                    .FirstOrDefaultAsync(e => e.Book_ID == bookid && e.ShoppingCart.StudentID == studentid);

                if (bookItem != null)
                {
                    // Decrement the quantity by 1
                    bookItem.Quantity -= 1;

                    if (bookItem.Quantity == 0)
                    {
                        // If quantity becomes 0 or less, remove the item from the cart
                        _appDbContext.ShoppingCartBook.Remove(bookItem);
                    }

                    await _appDbContext.SaveChangesAsync();

                    return Ok(new { message = "Book quantity decreased successfully." });
                }
                else
                {
                    return NotFound(new { message = "Equipment not found in the cart." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while decreasing the book's quantity." });
            }
        }



    }
}
