namespace UniBooks_Backend.ViewModels
{
   
        public class ResellerReportViewModel
        {
            public int MostResoldBookCount { get; set; }
            public string MostResoldBookISBN { get; set; }

            public int LeastResoldBookCount { get; set; }
            public string LeastResoldBookISBN { get; set; }

            public int PendingBooksForEvaluationCount { get; set; }
            public int BooksBookedForEvaluationCount { get; set; }

            public int EvaluationBookingsCount { get; set; }
            public int ResaleExchangeLogCount { get; set; }
        }

    
}
