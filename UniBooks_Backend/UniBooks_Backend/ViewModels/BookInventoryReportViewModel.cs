namespace UniBooks_Backend.ViewModels
{
    public class BookInventoryReportViewModel
    {
        public int Quantity_On_Hand { get; set; }
        public string ISBN { get; set; }
        public string Title { get; set; }
        public decimal? BasePrice { get; set; }

        public decimal? Price { get; set; }
    }
}
