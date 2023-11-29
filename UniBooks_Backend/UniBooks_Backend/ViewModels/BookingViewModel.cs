using UniBooks_Backend.Models;
namespace UniBooks_Backend.ViewModels
{
    public class BookingViewModel
    {
        public int Num_Of_Booking { get; set; }
        public int Schedule_ID { get; set; }
       public  List<Reseller_Book> books { get; set; }
    }
}
