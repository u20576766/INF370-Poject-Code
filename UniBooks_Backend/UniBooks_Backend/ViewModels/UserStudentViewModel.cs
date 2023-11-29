namespace UniBooks_Backend.ViewModels
{
    public class UserStudentViewModel
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string Cell_Number { get; set; }
        public string Email { get; set; }
        public bool Subscribed
        {
            get; set;
        }
        public int User_ID { get; set; }
    }
}
