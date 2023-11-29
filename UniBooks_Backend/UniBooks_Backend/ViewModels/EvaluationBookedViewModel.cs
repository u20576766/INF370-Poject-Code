namespace UniBooks_Backend.ViewModels
{
    public class EvaluationBookedViewModel
    {
        public string Date { get; set; }
        public string ReferenceNumber { get; set; }
        public decimal EstimatedPrice { get; set; }
        public int ResellerBookId { get; set; }
        public string ISBN { get; set; }
        public string Title { get; set; }
    }
}
