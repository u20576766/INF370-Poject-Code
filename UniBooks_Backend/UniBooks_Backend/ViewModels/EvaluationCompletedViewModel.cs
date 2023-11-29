namespace UniBooks_Backend.ViewModels
{
    public class EvaluationCompletedViewModel
    {
        public string ISBN { get; set; }
        public string Title { get; set; }
        public decimal EstimatedPrice { get; set; }
        public int Reselller_Book_Id { get; set; }

        public string Date { get; set; }
        public string ReferenceNumber { get; set; }
    }
}
