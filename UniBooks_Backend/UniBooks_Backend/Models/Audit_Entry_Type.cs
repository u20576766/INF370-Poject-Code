using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace UniBooks_Backend.Models
{
    public class Audit_Entry_Type
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Audit_Entry_Type_ID { get; set; }

        [Required]
        [MaxLength(255)] // Choose an appropriate length for the UserAction
        public string UserAction { get; set; }

        // Navigation property for the related Audit_Trail entries
        public ICollection<Audit_Trail> AuditTrail { get; set; } = new List<Audit_Trail>();
    }
}
