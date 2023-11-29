using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Model;
using Microsoft.EntityFrameworkCore;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResellerController : ControllerBase
    {
        private readonly IResellerRepository _resellerRepository;

        public ResellerController(IResellerRepository resellerRepository)
        {
            _resellerRepository = resellerRepository;
        }


        [HttpGet]
        [Route("GetPercent")]
        public async Task<IActionResult> GetPercent()
        {
            try
            {
                var results = await _resellerRepository.GetPercent();

                if (results == null)
                {
                    return NotFound();
                }
                return Ok(results);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }


        [HttpPut]
        [Route("UpdateResellerPercent")]
        public async Task<ActionResult<ResalePercentViewModel>> UpdateResellerPercent(ResalePercentViewModel vm)
        {
            try
            {
                var PercentVM = await _resellerRepository.GetPercent();

                PercentVM.Percent_Value = vm.Percent_Value;

                if (await _resellerRepository.SaveChangesAsync())
                {
                    return Ok(PercentVM);
                }
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");

            }
            return BadRequest("Your request is invalid");
        }






        //use case 2.1. Check book Estimate
        [HttpGet]
        [Route("CheckBookEstimate/{ISBN}")]
        public async Task<IActionResult>CheckBookEstimate(string ISBN)
        {
            try
            {
                var getBook = await _resellerRepository.GetPrescribedBook(ISBN);
                if(getBook == null)
                {
                    return NotFound("Oops , prescribed book not found");
                }
                return Ok(getBook);
            }
            catch(Exception)
            {
                return StatusCode(500, "Internal Server Error.Please contact support");
            }
        }

        //Use case  2.2. Add book to resale cart 

        [HttpPost]
        [Route("AddBookToResaleCart")]
        public async Task<IActionResult>AddBookToResaleCart(ResellerViewModel rvm)
        {
            var newReseller = new Reseller_Book
            {
                ISBN = rvm.ISBN,
                ImageBack = rvm.ImageBack,
                ImageBinder = rvm.ImageBinder,
                ImageFront = rvm.ImageFront,
                ImageOpen = rvm.ImageOpen,
                 Estimated_Price = rvm.Estimated_Price, 
                Student_ID = rvm.Student_ID,
                Reseller_Book_Status_ID = 1

            };
            try
            {
                _resellerRepository.AddResellerBook(newReseller);

                await _resellerRepository.SaveChangesAsync();
            }
            catch(Exception)
            {
                return BadRequest("Invalid Request");
            }
            return Ok("Book has been added successfully to resale");



        }

        //2.3. Schedule book evalaution 
        [HttpPost]
        [Route("CreateBooking/{scheduleId}")]
        public async Task<IActionResult> CreateBooking(int scheduleId)
        {
            // Retrieve schedule and reduce the number of slots by 1
            await _resellerRepository.UpdateSlotsAvailable(scheduleId);

            string referenceNumber = GenerateRandomReferenceNumber();

            var newBooking = new Booking
            {
                Schedule_ID = scheduleId,
                Num_Of_Books = 0,
                Reference_Num = referenceNumber
            };

            try
            {
                // Call the asynchronous CreateBooking method from the repository and await its execution
                 _resellerRepository.Add(newBooking);

                // Add the new booking to the context and save changes to the database
                await _resellerRepository.SaveChangesAsync();
                return Ok(newBooking);
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging purposes
                return BadRequest("Error creating Booking");
            }

          
        }


        // Helper method to generate a random 10-digit reference number
        private string GenerateRandomReferenceNumber()
        {
            Random random = new Random();
            string referenceNumber = new string(Enumerable.Repeat("0123456789", 10).Select(s => s[random.Next(s.Length)]).ToArray());
            return referenceNumber;
        }


        //when checkbox is ticked then it will be added
        [HttpPost]
        [Route("AddBooking")]
        public async Task<IActionResult>Addbooking(ResellerBookingViewModel b)
        {
            try
            {
                var existingBooking = await _resellerRepository.GetBookingByIDAsync(b.Booking_Id);
                if (existingBooking == null) return NotFound($"No booking was found");
                existingBooking.Num_Of_Books = existingBooking.Num_Of_Books + 1;

                var existingBook = await _resellerRepository.GetResellerByIdAsync(b.ResellerBook_ID);
                if (existingBook == null) return NotFound($"Reseller book not found");
                existingBook.Booking_ID = existingBooking.Booking_ID;
                existingBook.Reseller_Book_Status_ID = 2;

                if(await _resellerRepository.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");

        }

        //2.4. Evalaute book

        [HttpGet]
        [Route("EvaluateBook/{bookingRef}")]
        public async Task<IActionResult> EvaluateBook(string bookingRef)
        {
            try
            {
                var evaluationData = await _resellerRepository.GetBooksToBeEvaluated( bookingRef);
                if (evaluationData == null || evaluationData.Count == 0)
                {
                    return NotFound("No books found for the provided student and booking reference.");
                }

                return Ok(evaluationData);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }



        [HttpPost]
[Route("BookEvaluated/{Reseller_Book_Id}")]
public async Task<IActionResult> BookEvaluated(int Reseller_Book_Id)
{
    try
    {
        var existingbook = await _resellerRepository.GetResellerByIdAsync(Reseller_Book_Id);
        if (existingbook == null) return NotFound("Sorry error retrieving book details");
        existingbook.Reseller_Book_Status_ID = 3;

        if (await _resellerRepository.SaveChangesAsync())
        {
            return Ok(new { message = "Successfully evaluated" }); // Return JSON object
        }
    }
    catch (Exception)
    {
        return StatusCode(500, "Internal server error. Please contact support");
    }
    return BadRequest("Your request is invalid.");
}



        [HttpPost]
        [Route("WriteEvaluationBookLog")]
        public async Task<IActionResult> WriteEvaluationBookLog(EvaluationBookLogViewModel logg)
        {
            

            var newlogg = new Evalaution_Book_Log
            {
                Booking_ID = logg.BookingId,
                Date = logg.Date,
                Description = logg.Description,
            };

            try
            {
                _resellerRepository.Add(newlogg); // Add the new evaluation book log to the context
                await _resellerRepository.SaveChangesAsync(); // Save the changes asynchronously

                return Ok(newlogg);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error. Please contact support");
            }
        }

        [HttpPost]
        [Route("StudentWriteEvaluationBookLog")]
        public async Task<IActionResult> StudentWriteEvaluationBookLog(EvaluationBookLogViewModel logg)
        {


            var newlogg = new Evalaution_Book_Log
            {
                Booking_ID = null,
                Date = logg.Date,
                Description = logg.Description,
                Student_ID = logg.Student_ID,
            };

            try
            {
                _resellerRepository.Add(newlogg); // Add the new evaluation book log to the context
                await _resellerRepository.SaveChangesAsync(); // Save the changes asynchronously

                return Ok(newlogg);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error. Please contact support");
            }
        }





        //2.5.Log resale details 
        [HttpPost]
        [Route("LogResaleExchange")]
        public async Task<IActionResult>LogResaleExchange(ResaleLogViewModel logg)
        {
            var log = new Resale_Log
            {
                Date = logg.Date,
                Amount_Exchanged = logg.Amount_Exchanged,
                Evaluation_Book_Log_ID = logg.Evalaution_Book_Log_ID,
                Description = logg.Description
            };
            try
            {
                _resellerRepository.Add(log);
                await _resellerRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Inavlid Request");
            }
            return Ok(log);
        }






        //2.6.view resale details
        ////1.Evalauted needs to be booked
        [HttpGet]
        [Route("PendingBooking/{studentId}")]
        public async Task<IActionResult> PendingBooking(int studentId)
        {
            try
            {
                var results = await _resellerRepository.GetPendingBooksForStudent(studentId);
                return Ok(results);

            }
            catch (Exception)
            {
                return BadRequest("Inavlid Request");
            }
        }


        ////2/Evalaution booked 
        [HttpGet]
        [Route("EvaluationBooked/{studentId}")]
        public async Task<IActionResult> EvaluationBooked(int studentId)
        {
            try
            {
                var evaluationData = await _resellerRepository.GetEvaluationBookedData(studentId);
                return Ok(evaluationData);
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request");
            }
        }

        //3.evalaution completed
        [HttpGet]
        [Route("EvaluationCompleted/{studentId}")]
        public async Task<IActionResult> EvaluationCompleted(int studentId)
        {
            try
            {
                var results = await _resellerRepository.GetEvaluationCompletedData(studentId);
                return Ok(results);

            }
            catch (Exception)
            {
                return BadRequest("Inavalid Request");
            }
        }

        [HttpDelete]
        [Route("DeleteBookFromResale/{resellerBookId}")]
        public async Task<IActionResult> DeleteBookFromResale(int resellerBookId)
        {
            try
            {
                var resellerbook = await _resellerRepository.GetResellerByIdAsync(resellerBookId);
                if (resellerbook == null)
                {
                    return NotFound();
                }

                _resellerRepository.Delete(resellerbook);
                if (await _resellerRepository.SaveChangesAsync())
                {
                    return Ok("Reseller book deleted successfully");
                }

                return StatusCode(500); // Couldn't save changes
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error. Please contact support.");
            }
        }



    }
}

