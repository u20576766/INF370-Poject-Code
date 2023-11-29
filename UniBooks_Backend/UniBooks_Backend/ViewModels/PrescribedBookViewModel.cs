namespace UniBooks_Backend.ViewModels
{
    public class PrescribedBookViewModel
    {
        public string ISBN { get; set; }
        public string Title { get; set; }
        public string PublisherName { get; set; }
        public string AuthorName { get; set; }
        public decimal BasePrice { get; set; }
        public int Edition { get; set; }
        public int Year { get; set; }
        public int Module_ID { get; set; }
        //public int? Prescribed_Book_List_ID { get; set; }
    }
}
