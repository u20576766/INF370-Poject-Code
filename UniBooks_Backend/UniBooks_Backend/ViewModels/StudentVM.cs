using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class StudentVM
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Cell_Number { get; set; }
        public string Email { get; set; }
        public Boolean Subscribed { get; set; }


        public StudentVM(string name, string surname, string cell_number, string email, Boolean subscribed)
        {
            Name = name;
            Surname = surname;
            Cell_Number = cell_number;
            Email = email;
            Subscribed = subscribed;
        }

        public StudentVM()
        {

        }

    }
}
