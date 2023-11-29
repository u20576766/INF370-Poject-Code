using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Student
    {
        [Key, MaxLength(5)]
        public int Student_ID { get; set; }


        [Required, StringLength(100)]
        public string Name { get; set; }


        [Required, StringLength(100)]
        public string Surname { get; set; }

        [Required, StringLength(10)]
        public string Cell_Number { get; set; }


        [Required, StringLength(100)]
        public string Email { get; set; }

        [Required]
        public bool Subscribed { get; set; }

        [Timestamp]
        public byte[] Timestamp { get; set; }

        [AllowNull]
        public string? User_ID { get; set; }
        public AppUser AppUsers { get; set; }

        //wisani
        public List<Student_Newsletter> StudentNewsletter { get; set; }

        //mmapula
        public List<Evalaution_Book_Log> EvalautionBookLogs { get; set; }

        // Link to student 
        public List<WalkInSale> WalkInSales { get; set; }

        // Link to reseller
        public List<Reseller_Book> ResellerBook { get; set; }

        
        //lungelo
        // Link to shopping carts
        public ShoppingCart ShoppingCart { get; set; }

        // Link to order 
        public List<Order> Orders { get; set; }

        // Link to change requests
        public List<ChangeRequest> ChangeRequests { get; set; }
    }
}