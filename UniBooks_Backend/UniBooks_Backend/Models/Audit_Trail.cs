using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniBooks_Backend.Models
{
    public class Audit_Trail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Audit_Trail_ID { get; set; }

        [Required]
        public DateTime DateTimeStamp { get; set; }

        [Required]
        [MaxLength(255)] // Adjust the length as needed
        public string Comment { get; set; }

        [ForeignKey("Employees")]
        public int Employee_ID { get; set; }
        public Employee Employees { get; set; }

        [ForeignKey("AuditEntryTypes")]
        public int? Audit_Entry_Type_ID { get; set; }
        public Audit_Entry_Type AuditEntryTypes { get; set; }
    }
}
