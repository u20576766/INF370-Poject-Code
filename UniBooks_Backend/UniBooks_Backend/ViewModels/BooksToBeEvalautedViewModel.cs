namespace UniBooks_Backend.ViewModels
{
    public class BooksToBeEvalautedViewModel
    {
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Authors { get; set; }
        public int Edition { get; set; }
        public string PublisherName { get; set; }
        public int ResellerBookId { get; set; }
        public string ImageFront { get; set; }
        public string ImageBinder { get; set; }
        public string ImageBack { get; set; }
        public decimal EstimatedPrice { get; set; }
        public string ImageOpen { get; set; }
        public string ReferenceNum { get; set; }
        public string Date { get; set; }
        public int BookingID { get; set; }
    }
}
