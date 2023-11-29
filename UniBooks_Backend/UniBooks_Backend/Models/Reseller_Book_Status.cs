using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.Models
{
    public class Reseller_Book_Status
    {
        [Key,MaxLength(5)]
        public int Reseller_Book_Status_ID { get; set; }

        [Required,StringLength(100)]
        public string StatusName { get; set; }

        [Required,StringLength(255)]
        public string Description { get; set; }

        public List<Reseller_Book>ResellerBook { get; set; }
    }
}
