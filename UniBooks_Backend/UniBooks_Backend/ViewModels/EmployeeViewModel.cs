namespace UniBooks_Backend.ViewModels
{
    public class EmployeeViewModel
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Cell_Number { get; set; }
        public string Email { get; set; }
        public string Physical_Address { get; set; }
        public string BirthDate { get; set; }
        public string Emergency_Contact_Name { get; set; }
        public string Emergency_Contact_Cell { get; set; }
        public int Employee_Type_ID { get; set; }
        public string ImageBase64 { get; set; } // Add this property for the image
    }
}
