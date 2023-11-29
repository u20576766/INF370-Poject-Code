using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Student_Newsletter
    {

        [Key]
        public int Student_ID { get; set; }
        public Student Students {  get; set; }


        [Key]
        public int Newsletter_ID { get; set; }
        public Newsletter Newsletters { get; set; }


        [Required]
        public string Date { get; set; }
    }
}
