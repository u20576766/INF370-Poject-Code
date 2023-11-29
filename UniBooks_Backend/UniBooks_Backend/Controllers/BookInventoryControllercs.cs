using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;

using UniBooks_Backend.Repository;
using UniBooks_Backend.ViewModels;



namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookInventoryController : ControllerBase
    {
        private readonly IBook_InventoryRepository _bookInventoryRepo;
        private readonly IPrescribedBookListRepository _prescribedBookListRepository;
        private readonly AppDbContext _appDbContext;

        public BookInventoryController(IBook_InventoryRepository bookInventoryRepo, IPrescribedBookListRepository prescribedBookListRepository, AppDbContext appDbContext)
        {
            _bookInventoryRepo = bookInventoryRepo;
            _prescribedBookListRepository = prescribedBookListRepository;
            _appDbContext = appDbContext;
        }

        [HttpGet]
        [Route("SearchPrescribedBookByISBN/{isbn}")]
        public async Task<IActionResult> SearchPrescribedBookByISBN(string isbn)
        {
            try
            {
                var prescribedBook = await _prescribedBookListRepository.GetPrescribedBookByISBNAsync(isbn);
                if (prescribedBook == null)
                {
                    return NotFound("Book with the given ISBN does not exist in the prescribed book list.");
                }

                var moduleCode = await _prescribedBookListRepository.GetModuleCodeByModuleIdAsync(prescribedBook.Module_ID);

                var bookViewModel = new Book_InventoryViewModel
                {
                    ISBN = prescribedBook.ISBN,
                    Module_Code = moduleCode,
                    Title = prescribedBook.Title,
                    PublisherName = prescribedBook.PublisherName,
                    AuthorName = prescribedBook.AuthorName,
                    Edition = prescribedBook.Edition,
                    Year = prescribedBook.Year
                };

                return Ok(bookViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while searching for the prescribed book.");
            }
        }



        [HttpPost]
        [Route("AddBook")]
        public async Task<IActionResult> AddBook([FromBody] Book_InventoryViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid book data.");

                if (await _bookInventoryRepo.BookExistsAsync(model.ISBN))
                    return BadRequest("Book with the same ISBN already exists in the book inventory.");

                // If the model contains the base64-encoded image data, use it directly.
                // Otherwise, set a default image (base64 string) or handle the error accordingly.
                if (string.IsNullOrWhiteSpace(model.ImageBase64))
                {
                    model.ImageBase64 = GetDefaultImageBase64(); // Implement this method to get the default image
                }

                // Create a new Book_Inventory entity
                var book = new Book_Inventory
                {
                    ISBN = model.ISBN,
                    Quantity_On_Hand = model.Quantity,
                    Image = model.ImageBase64 // Store the base64 string in the Image property
                };

                await _bookInventoryRepo.AddBookAsync(book);

                // Save the price information
                var price = new Price
                {
                    Date = DateTime.UtcNow.ToString("dd-mm-yyyy"),
                    Amount = model.Price,
                    Book_ID = book.Book_ID // Associate the price with the book
                };

                await _bookInventoryRepo.AddPrice(price);

                return CreatedAtAction(nameof(GetBookByISBN), new { isbn = book.ISBN }, book);
            }
            catch (Exception ex)
            {
                // Handle and log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while adding book.");
            }
        }


        // Helper method to check if the uploaded file is an image
        private bool IsImage(IFormFile file)
        {
            return file.ContentType.StartsWith("image/");
        }

        private string GetDefaultImageBase64()
        {
            // Replace the default image with your desired image file.
            // You can use any image you want or embed the image directly in the code.
            byte[] defaultImageBytes = Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/2+Bg4AAAAASUVORK5CYII=");
            return Convert.ToBase64String(defaultImageBytes);
        }

        [HttpGet]
        [Route("GetBookByISBN/{isbn}")]
        public async Task<IActionResult> GetBookByISBN(string isbn)
        {
            try
            {
                var book = await _bookInventoryRepo.GetBookByISBNAsync(isbn);
                if (book == null)
                    return NotFound("Book not found in the book inventory.");

                // Check if the PrescribedBook navigation property is null
                if (book.PrescribedBook == null)
                    return NotFound("PrescribedBook not found for the book.");

                // Get the associated module code using the navigation property
                var moduleCode = await _prescribedBookListRepository.GetModuleCodeByModuleIdAsync(book.PrescribedBook.Module_ID);

                // Eagerly load the prices for the book
                book.Prices = await _bookInventoryRepo.GetPricesByBookIdAsync(book.Book_ID);

                return Ok(new Book_InventoryViewModel
                {
                    ISBN = book.ISBN,
                    Quantity = book.Quantity_On_Hand,
                    ImageBase64 = book.Image,
                    Price = book.Prices?.FirstOrDefault()?.Amount ?? 0,
                    Module_Code = moduleCode,
                    Title = book.PrescribedBook.Title,
                    PublisherName = book.PrescribedBook.PublisherName,
                    AuthorName = book.PrescribedBook.AuthorName,
                    Edition = book.PrescribedBook.Edition,
                    Year = book.PrescribedBook.Year
                });
            }
            catch (Exception ex)
            {
                // Handle and log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while retrieving the book.");
            }
        }




        [HttpGet]
        [Route("GetBooks")]
        public async Task<IActionResult> GetBooks()
        {
            try
            {
                var books = await _bookInventoryRepo.GetAllBooksAsync();

                // Eagerly load the prices and the PrescribedBook navigation property for each book
                foreach (var book in books)
                {
                    book.Prices = await _bookInventoryRepo.GetPricesByBookIdAsync(book.Book_ID);
                    book.PrescribedBook = await _prescribedBookListRepository.GetPrescribedBookByISBNAsync(book.ISBN);
                }

                // Create a new list of Book_InventoryViewModel to project the data
                var bookViewModels = new List<Book_InventoryViewModel>();

                // Loop through each book and create the Book_InventoryViewModel
                foreach (var book in books)
                {
                    if (book.PrescribedBook != null)
                    {
                        // Get the associated module code using the navigation property
                        var moduleCode = await _prescribedBookListRepository.GetModuleCodeByModuleIdAsync(book.PrescribedBook.Module_ID);

                        // Create the Book_InventoryViewModel
                        var bookViewModel = new Book_InventoryViewModel
                        {
                            ISBN = book.ISBN,
                            Quantity = book.Quantity_On_Hand,
                            ImageBase64 = book.Image,
                            Price = book.Prices.FirstOrDefault()?.Amount ?? 0,
                            Module_Code = moduleCode, // Use the retrieved module code
                            Title = book.PrescribedBook.Title,
                            PublisherName = book.PrescribedBook.PublisherName,
                            AuthorName = book.PrescribedBook.AuthorName,
                            Edition = book.PrescribedBook.Edition,
                            Year = book.PrescribedBook.Year,
                            Book_ID = book.Book_ID  //new add
                        };

                        // Add the Book_InventoryViewModel to the list
                        bookViewModels.Add(bookViewModel);
                    }
                }

                return Ok(bookViewModels);
            }
            catch (Exception ex)
            {
                // Handle and log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while retrieving books.");
            }
        }





        // PUT: api/BookInventory/ISBN
        [HttpPut]
        [Route("UpdateBook/{isbn}")]
        public async Task<IActionResult> UpdateBook(string isbn, [FromBody] Book_InventoryViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid book data.");

                var book = await _bookInventoryRepo.GetBookByISBNAsync(isbn);
                if (book == null)
                    return NotFound("Book not found.");

                
                book.Image = model.ImageBase64;

                await _bookInventoryRepo.UpdateBookAsync(book);

                // Update the price information
                var price = await _bookInventoryRepo.GetPriceByBookIdAsync(book.Book_ID);
                if (price != null)
                {
                    price.Date = DateTime.UtcNow.ToString("dd-mm-yyyy");
                    price.Amount = model.Price;
                    await _bookInventoryRepo.UpdatePriceAsync(price);
                }

                return Ok($"Book '{book.PrescribedBook.Title}' with ISBN '{isbn}' has been updated.");
            }
            catch (Exception ex)
            {
                // Handle and log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while updating book.");
            }
        }


        // DELETE: api/BookInventory/ISBN
        [HttpDelete]
        [Route("DeleteBook/{isbn}")]
        public async Task<IActionResult> DeleteBook(string isbn)
        {
            try
            {
                var book = await _bookInventoryRepo.GetBookByISBNAsync(isbn);
                if (book == null)
                    return NotFound("Book not found.");

                // Check if the book has related records in orders or sales
                bool hasRelatedRecords = await _bookInventoryRepo.HasRelatedRecordsAsync(book);

                if (hasRelatedRecords)
                {
                    return BadRequest("Cannot delete the book as it has related records in orders or sales.");
                }

                // If there are no related records, proceed with deletion
                await _bookInventoryRepo.DeletePricesAsync(book);
                await _bookInventoryRepo.DeleteBookAsync(book);

                return Ok($"Book '{book.PrescribedBook.Title}' with ISBN '{isbn}' has been deleted.");
            }
            catch (Exception ex)
            {
                // Handle and log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while deleting book.");
            }
        }


        [HttpGet]
        [Route("GetFacBooks")]
        public async Task<IActionResult> GetFaculties()
        {
            var faculties = await _appDbContext.Faculties
                .Include(f => f.Departments)
                    .ThenInclude(d => d.Modules)
                      
                .ToListAsync();

            return Ok(faculties);
        }
    }
}
