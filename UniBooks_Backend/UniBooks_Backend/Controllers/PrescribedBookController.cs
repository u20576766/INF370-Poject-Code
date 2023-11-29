using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescribedBookController : ControllerBase
    {
        private readonly IPrescribedBookRepository _prescribedBookRepository;
        private readonly IModuleRepository _moduleRepository;

        public PrescribedBookController(IPrescribedBookRepository prescribedBookRepository, IModuleRepository moduleRepository)
        {
            _prescribedBookRepository = prescribedBookRepository;
            _moduleRepository = moduleRepository;
        }

        [HttpGet]
        [Route("GetPrescribedBookByISBN/{isbn}")]
        public async Task<IActionResult> GetPrescribedBookByISBN(string isbn)
        {
            try
            {
                var prescribedBook = await _prescribedBookRepository.GetPrescribedBookByISBNAsync(isbn);
                if (prescribedBook == null)
                    return NotFound();

                return Ok(prescribedBook);
            }
            catch (Exception ex)
            {
                // Handle the exception and return an appropriate error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the prescribed book.");
            }
        }

        [HttpPost]
        [Route("AddPrescribedBook")]
        public async Task<IActionResult> AddPrescribedBook([FromBody] PrescribedBookViewModel prescribedBookViewModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var module = await _moduleRepository.GetModuleAsync(prescribedBookViewModel.Module_ID);
                if (module == null)
                {
                    return BadRequest("Invalid Module ID");
                }

                var prescribedBook = new Prescribed_Book
                {
                    ISBN = prescribedBookViewModel.ISBN,
                    Title = prescribedBookViewModel.Title,
                    PublisherName = prescribedBookViewModel.PublisherName,
                    AuthorName = prescribedBookViewModel.AuthorName,
                    Edition = prescribedBookViewModel.Edition,
                    Year = prescribedBookViewModel.Year,
                    BasePrice = prescribedBookViewModel.BasePrice,
                    Module_ID = prescribedBookViewModel.Module_ID
                };

                await _prescribedBookRepository.AddPrescribedBookAsync(prescribedBook);
                if (await _prescribedBookRepository.SaveChangesAsync())
                {
                    var successMessage = $"Prescribed book with ISBN: {prescribedBook.ISBN} added successfully";
                    return Ok(successMessage);
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Unable to save the prescribed book.");
            }
            catch (Exception ex)
            {
                // Handle the exception and return an appropriate error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the prescribed book.");
            }
        }

        [HttpGet]
        [Route("GetAllPrescribedBooks")]
        public async Task<IActionResult> GetAllPrescribedBooks()
        {
            try
            {
                var prescribedBooks = await _prescribedBookRepository.GetAllPrescribedBooksAsync();
                return Ok(prescribedBooks);
            }
            catch (Exception ex)
            {
                // Handle the exception and return an appropriate error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the prescribed books.");
            }
        }

        [HttpPut]
        [Route("UpdatePrescribedBook")]
        public async Task<IActionResult> UpdatePrescribedBook(string isbn, [FromBody] PrescribedBookViewModel prescribedBookViewModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var prescribedBook = await _prescribedBookRepository.GetPrescribedBookByISBNAsync(isbn);
                if (prescribedBook == null)
                {
                    return NotFound();
                }

                var module = await _moduleRepository.GetModuleAsync(prescribedBookViewModel.Module_ID);
                if (module == null)
                {
                    return BadRequest("Invalid Module ID");
                }

                // Update properties
                prescribedBook.Title = prescribedBookViewModel.Title;
                prescribedBook.PublisherName = prescribedBookViewModel.PublisherName;
                prescribedBook.AuthorName = prescribedBookViewModel.AuthorName;
                prescribedBook.Edition = prescribedBookViewModel.Edition;
                prescribedBook.Year = prescribedBookViewModel.Year;
                prescribedBook.BasePrice = prescribedBookViewModel.BasePrice;
                prescribedBook.Module_ID = prescribedBookViewModel.Module_ID;

                await _prescribedBookRepository.SaveChangesAsync();
                return Ok($"Prescribed book with ISBN: {prescribedBook.ISBN} updated successfully");
            }
            catch (Exception ex)
            {
                // Handle the exception and return an appropriate error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the prescribed book.");
            }
        }

        [HttpDelete]
        [Route("DeletePrescribedBook")]
        public async Task<IActionResult> DeletePrescribedBook(string isbn)
        {
            try
            {
                var prescribedBook = await _prescribedBookRepository.GetPrescribedBookByISBNAsync(isbn);
                if (prescribedBook == null)
                {
                    return NotFound();
                }

                _prescribedBookRepository.DeletePrescribedBook(prescribedBook);
                if (await _prescribedBookRepository.SaveChangesAsync())
                {
                    return Ok($"Prescribed book with ISBN: {prescribedBook.ISBN} deleted successfully");
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Unable to delete the prescribed book.");
            }
            catch (Exception ex)
            {
                // Handle the exception and return an appropriate error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the prescribed book.");
            }
        }

        [HttpGet]
        [Route("SearchPrescribedBooks/{searchText}")]
        public async Task<IActionResult> SearchPrescribedBooks(string searchText)
        {
            try
            {
                var prescribedBooks = await _prescribedBookRepository.GetPrescribedBooksBySearchAsync(searchText);
                if (prescribedBooks == null || !prescribedBooks.Any())
                {
                    return NotFound("No prescribed books matching the search criteria.");
                }

                return Ok(prescribedBooks);
            }
            catch (Exception ex)
            {
                // Handle the exception and return an appropriate error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while searching prescribed books.");
            }
        }
    }
}
