using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interface_Repoistory
{
    public interface IResellerRepository
    {
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<Prescribed_Book> GetPrescribedBook(string ISBN);
        void Add<T>(T entity) where T : class;
        Task<Evalaution_Book_Log> GetEvalautionBookLogByID(int Evaluation_Book_Log_ID);
        Task<Booking> GetBookingByIDAsync(int Booking_ID);

        Task<Reseller_Book> GetBookByID(int resellerbookid);

        Task<List<PendingEvaluationBookViewModel>> GetPendingBooksForStudent(int studentId);
        Task<IEnumerable<EvaluationBookedViewModel>> GetEvaluationBookedData(int studentId);
        Task<Reseller_Book[]> EvalautionCompleted(int studentId);

        void Update(Reseller_Book resellerBook);
        void AddResellerBook(Reseller_Book book);
      
         Task UpdateSlotsAvailable(int scheduleId);
        Task<Reseller_Book> GetResellerByIdAsync(int Book_ID);

        Task<Reseller_Book[]> GetResellerBooksByBookingID(int bookingId);
        Task<Booking> GetBookingByReferenceNumber(string refnum);

        Task<List<BooksToBeEvalautedViewModel>> GetBooksToBeEvaluated( string bookingRef);

        Task<IEnumerable<EvaluationCompletedViewModel>> GetEvaluationCompletedData(int studentId);


        Task<ResalePercent> GetPercent();

    }
}
