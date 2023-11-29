namespace UniBooks_Backend.ViewModels
{
    public class Book_InventoryViewModel
    {
        // Properties from Book_Inventory entity
        public string ISBN { get; set; }
        public int Quantity { get; set; }
        public string ImageBase64 { get; set; }
        public decimal Price { get; set; }

        // Properties from Prescribed_Book entity
        public string Title { get; set; }
        public string PublisherName { get; set; }
        public string Module_Code { get; set; }
        public int Edition { get; set; }
        public int Year { get; set; }
        public string AuthorName { get; set; }

        ////new attribute
        public int Book_ID { get; set; }
    }
}
