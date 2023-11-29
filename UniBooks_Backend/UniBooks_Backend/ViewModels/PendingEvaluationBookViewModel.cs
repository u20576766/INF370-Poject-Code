namespace UniBooks_Backend.ViewModels
{
    public class PendingEvaluationBookViewModel
    {
        public string ISBN { get; set; }
        public string Title { get; set; }
        public decimal EstimatedPrice { get; set; }
        public int Reselller_Book_Id { get; set; }
    }
}
