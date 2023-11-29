using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;
using UniBooks_Backend.ViewModels;
using static OfficeOpenXml.ExcelErrorValue;
using System.Text.Json;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescribedBookListsController : ControllerBase
    {
        private readonly IPrescribedBookListRepository _prescribedBookListRepository;
        private readonly IModuleRepository _moduleRepository;
        

        public PrescribedBookListsController(IPrescribedBookListRepository prescribedBookListRepository, IModuleRepository moduleRepository)
        {
            _prescribedBookListRepository = prescribedBookListRepository;
            _moduleRepository = moduleRepository;
            
        }

        [HttpPost]
        [Route("UploadPrescribedBookList")]
        public async Task<IActionResult> UploadPrescribedBookList([FromForm] PrescribedBookListViewModel viewModel)
        {
            if (viewModel.ExcelFile == null || viewModel.ExcelFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                using var stream = new MemoryStream();
                await viewModel.ExcelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];

                // Set the license context
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;


                // Validate required columns
                if (!worksheet.Cells["A1"].Value.Equals("ISBN") ||
                    !worksheet.Cells["B1"].Value.Equals("Title") ||
                    !worksheet.Cells["C1"].Value.Equals("PublisherName") ||
                    !worksheet.Cells["D1"].Value.Equals("AuthorName") ||
                    !worksheet.Cells["E1"].Value.Equals("Edition") ||
                    !worksheet.Cells["F1"].Value.Equals("Year") ||
                    !worksheet.Cells["G1"].Value.Equals("BasePrice") ||
                    !worksheet.Cells["H1"].Value.Equals("ModuleCode"))
                {
                    return BadRequest("Invalid file format.");
                }

                var prescribedBookList = new Prescribed_Book_List
                {
                    Excel_File = Convert.ToBase64String(stream.ToArray()),
                    Date = DateTime.Now.ToString("dd-mm-yyyy")
                };

                prescribedBookList.PrescribedBook = new List<Prescribed_Book>();


                for (var row = 2; !string.IsNullOrEmpty(worksheet.Cells[row, 1].Value?.ToString()); row++)
                {
                    var isbnCellValue = worksheet.Cells[row, 1].Value?.ToString();
                    if (string.IsNullOrEmpty(isbnCellValue))
                    {
                        return BadRequest($"Invalid ISBN value at row {row}.");
                    }

                    Console.WriteLine($"ISBN value at row {row}: {isbnCellValue}");



                    var title = worksheet.Cells[row, 2].Value?.ToString();
                    var publisherName = worksheet.Cells[row, 3].Value?.ToString();
                    var authorName = worksheet.Cells[row, 4].Value?.ToString();

                    if (!int.TryParse(worksheet.Cells[row, 5].Value?.ToString(), out var edition))
                    {
                        return BadRequest($"Invalid edition value at row {row}.");
                    }

                    if (!int.TryParse(worksheet.Cells[row, 6].Value?.ToString(), out var year))
                    {
                        return BadRequest($"Invalid year value at row {row}.");
                    }

                    if (!decimal.TryParse(worksheet.Cells[row, 7].Value?.ToString(), out var basePrice))
                    {
                        return BadRequest($"Invalid base price value at row {row}.");
                    }

                    var moduleCode = worksheet.Cells[row, 8].Value?.ToString();

                    var module = await _moduleRepository.GetModuleByCodeAsync(moduleCode);
                    if (module == null)
                    {
                        return BadRequest($"Invalid module code '{moduleCode}' at row {row}.");
                    }

                    Console.WriteLine(module.Module_ID);
                    // Check if a book with the same ISBN already exists in the database
                    var existingBook = await _prescribedBookListRepository.GetPrescribedBookByISBNAsync(isbnCellValue);
                    if (existingBook != null)
                    {
                        // Update the existing book with the new values from the uploaded file
                        existingBook.Title = title;
                        existingBook.PublisherName = publisherName;
                        existingBook.AuthorName = authorName;
                        existingBook.Edition = edition;
                        existingBook.Year = year;
                        existingBook.BasePrice = basePrice;
                        existingBook.Module_ID = module.Module_ID;
                    }
                    else
                    {
                        // Book with this ISBN does not exist, create a new one
                        var prescribedBook = new Prescribed_Book
                        {
                            ISBN = isbnCellValue,
                            Title = title,
                            PublisherName = publisherName,
                            AuthorName = authorName,
                            Edition = edition,
                            Year = year,
                            BasePrice = basePrice,
                            Module_ID = module.Module_ID,
                            //Prescribed_Book_List_ID = prescribedBookList.Prescribed_Book_List_ID
                        };

                        prescribedBookList.PrescribedBook.Add(prescribedBook);
                    }
                }

                // Clear existing prescribed books
                var existingBooks = _prescribedBookListRepository.GetPrescribedBooksByListId(prescribedBookList.Prescribed_Book_List_ID);
                _prescribedBookListRepository.RemovePrescribedBooks(existingBooks);

                // Add new prescribed books
                _prescribedBookListRepository.AddPrescribedBookList(prescribedBookList);
                await _prescribedBookListRepository.SaveChangesAsync();



                // Create the JSON response manually
                var response = new
                {
                    message = "Prescribed book list uploaded successfully."
                };

                // Serialize the response object to JSON
                var jsonResponse = JsonSerializer.Serialize(response);

                // Return the JSON response with proper content type
                return Content(jsonResponse, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing the file. " + ex.Message);
            }
        }
    }
}
