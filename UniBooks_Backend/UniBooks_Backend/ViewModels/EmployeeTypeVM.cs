using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.ViewModels
{
    public class EmployeeTypeVM
    {

        public string Name { get; set; }

        public string Description { get; set; }

        public EmployeeTypeVM(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public EmployeeTypeVM()
        {

        }

    }
}
