using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Repository
{
    public class ResellerRepository :IResellerRepository
    {
        private readonly AppDbContext _appDbContext;

        public ResellerRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        //Changes 

        public async Task<ResalePercent> GetPercent()
        {
            IQueryable<ResalePercent> q = _appDbContext.resalePercent;
            return await q.FirstOrDefaultAsync();
        }





        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                return await _appDbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                // Handle the exception or log it if needed
                return false;
            }
        }

        //delete book from resale 
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        //add book to reseller 
        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add<T>(entity);
        } 

        public void AddResellerBook(Reseller_Book book)
        {
            _appDbContext.ResellerBook.Add(book)
            
;             
        }
       


        //get textbook  USING ISBN
        public async Task<Prescribed_Book>GetPrescribedBook(string ISBN)
        {
            IQueryable<Prescribed_Book> query = _appDbContext.PrescribedBook.Where(i => i.ISBN == ISBN);
            return await query.FirstOrDefaultAsync();
        }

        //find evaluation book log using id 

        public async Task<Evalaution_Book_Log> GetEvalautionBookLogByID(int Evaluation_Book_Log_ID)
        {
            IQueryable<Evalaution_Book_Log> query = _appDbContext.EvalautionBookLog.Where(u => u.Evaluation_Book_Log_ID == Evaluation_Book_Log_ID);
            return await query.FirstOrDefaultAsync();
        }

        //get booking by id, only 1 booking
        public async Task<Booking> GetBookingByIDAsync(int Booking_ID)
        {
            IQueryable<Booking> query = _appDbContext.Bookings.Where(i => i.Booking_ID == Booking_ID);
            return await query.FirstOrDefaultAsync();
        }

        //GET RESELLER BOOK BY ID 
        public async Task<Reseller_Book> GetResellerByIdAsync(int Book_ID)
        {
            IQueryable<Reseller_Book> query = _appDbContext.ResellerBook.Where(i => i.Reseller_Book_ID == Book_ID);
            return await query.SingleOrDefaultAsync();
        }


        //all books using refernece number 
        public async Task<List<BooksToBeEvalautedViewModel>> GetBooksToBeEvaluated( string bookingRef)
        {
            var query = from prescribedBook in _appDbContext.PrescribedBook
                        join resellerBook in _appDbContext.ResellerBook on prescribedBook.ISBN equals resellerBook.ISBN
                        join booking in _appDbContext.Bookings on resellerBook.Booking_ID equals booking.Booking_ID
                        join schedule in _appDbContext.Schedules on booking.Schedule_ID equals schedule.Schedule_ID
                        where booking.Reference_Num == bookingRef 
                        select new BooksToBeEvalautedViewModel
                        {
                            Title = prescribedBook.Title,
                            ISBN = prescribedBook.ISBN,
                            Authors = prescribedBook.AuthorName,
                            Edition = prescribedBook.Edition,
                            PublisherName = prescribedBook.PublisherName,
                            ResellerBookId = resellerBook.Reseller_Book_ID,
                            ImageFront = resellerBook.ImageFront,
                            ImageBinder = resellerBook.ImageBinder,
                            ImageBack = resellerBook.ImageBack,
                            EstimatedPrice = resellerBook.Estimated_Price,
                            ImageOpen = resellerBook.ImageOpen,
                            ReferenceNum = booking.Reference_Num,
                            Date = schedule.Date,
                            BookingID = booking.Booking_ID,

                        };

            return await query.ToListAsync();
        }






        //get one book by id 
        public async Task<Reseller_Book>GetBookByID(int resellerbookid)
        {
            IQueryable<Reseller_Book> query = _appDbContext.ResellerBook.Where(y => y.Reseller_Book_ID == resellerbookid);
            return await query.FirstOrDefaultAsync();

        }

        //resellerboookstatus  == Pending Booking 
        public async Task<List<PendingEvaluationBookViewModel>> GetPendingBooksForStudent(int studentId)
        {
            var query = from resellerBook in _appDbContext.ResellerBook
                        join prescribedBook in _appDbContext.PrescribedBook on resellerBook.ISBN equals prescribedBook.ISBN
                        where resellerBook.Reseller_Book_Status_ID == 1 && resellerBook.Student_ID == studentId
                        select new  PendingEvaluationBookViewModel
                        { 
                            ISBN = prescribedBook.ISBN,
                            Title = prescribedBook.Title,
                            EstimatedPrice = resellerBook.Estimated_Price,
                            Reselller_Book_Id = resellerBook.Reseller_Book_ID
                        };

            return await query.ToListAsync();
        }

        //resellerboookstatus  == booking scheduled

        public async Task<IEnumerable<EvaluationBookedViewModel>> GetEvaluationBookedData(int studentId)
        {
            var query = _appDbContext.ResellerBook
                .Where(u => u.Reseller_Book_Status_ID == 2 && u.Student_ID == studentId)
                .Select(rb => new EvaluationBookedViewModel
                {
                    Date = rb.Bookings.Schedules.Date,
                    ReferenceNumber = rb.Bookings.Reference_Num,
                    EstimatedPrice = rb.Estimated_Price,
                    ResellerBookId = rb.Reseller_Book_ID,
                    ISBN = rb.PrescribedBook.ISBN,
                    Title = rb.PrescribedBook.Title
                });

            return await query.ToListAsync();
        }


        public async Task<IEnumerable<EvaluationCompletedViewModel>>GetEvaluationCompletedData(int studentId)
        {
            var q = _appDbContext.ResellerBook
                .Where(u => u.Reseller_Book_Status_ID == 3 && u.Student_ID == studentId)
                .Select(rb => new EvaluationCompletedViewModel
                {
                     Date = rb.Bookings.Schedules.Date,
                    ReferenceNumber = rb.Bookings.Reference_Num,
                    EstimatedPrice = rb.Estimated_Price,
                    Reselller_Book_Id = rb.Reseller_Book_ID,
                    ISBN = rb.PrescribedBook.ISBN,
                    Title = rb.PrescribedBook.Title

                });

            return await q.ToListAsync();
        }


        //evalaution completed
        public async Task<Reseller_Book[]> EvalautionCompleted(int studentId)
        {
            IQueryable<Reseller_Book> query = _appDbContext.ResellerBook.Where(u => u.Reseller_Book_Status_ID == 3 && u.Student_ID == studentId);
            return await query.ToArrayAsync();
        }

        //getting all reseller book baased on booking 
        public async Task<Booking> GetBookingByReferenceNumber(string refnum)
        { IQueryable<Booking> q = _appDbContext.Bookings.Where(u => u.Reference_Num  == refnum);
            return await q.FirstOrDefaultAsync();
        }

        public async Task<Reseller_Book[]> GetResellerBooksByBookingID(int bookingId)
        {
            IQueryable<Reseller_Book> query = _appDbContext.ResellerBook.Where(u => u.Booking_ID == bookingId);
            return await query.ToArrayAsync();

        }




        //UPDATING RESELLER
        public void Update(Reseller_Book resellerBook)
        {
            // Implementation to update the reseller book in the database
            _appDbContext.Entry(resellerBook).State = EntityState.Modified;
            _appDbContext.SaveChanges();
        }

        //updating number of slots 2.3.
        public async Task UpdateSlotsAvailable(int scheduleId)
        {
            // Execute the raw SQL query to decrement the Slots_Available column by 1
            // for the row with the given Schedule_ID
            await _appDbContext.Database.ExecuteSqlInterpolatedAsync(
                $"UPDATE Schedules SET Slots_Available = Slots_Available - 1 WHERE Schedule_ID = {scheduleId}");
        }





    }
}
