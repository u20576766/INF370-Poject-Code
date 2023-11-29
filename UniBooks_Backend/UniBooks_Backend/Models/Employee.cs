using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class Employee
    {
        [Key]
        public int Employee_ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Surname { get; set; }

        [Required]
        [StringLength(10)]
        public string Cell_Number { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; }

        
        public string Image { get; set; }

        [Required]
        [StringLength(255)]
        public string Physical_Address { get; set; }

        [Required]
        [RegularExpression(@"^\d{2}-\d{2}-\d{4}$", ErrorMessage = "Invalid date format. Use dd-MM-yyyy.")]
        public string BirthDate { get; set; }

        [Required]
        [StringLength(100)]
        public string Emergency_Contact_Name { get; set; }

        [Required]
        [StringLength(10)]
        public string Emergency_Contact_Cell { get; set; }

        [Required]
        public int Employee_Type_ID { get; set; }
        public Employee_Type EmployeeType { get; set; }

        [Required]
        public string User_ID { get; set; }
        public AppUser AppUsers { get; set; }

        // Link to write off
        public List<Write_Off> WriteOff { get; set; }
        public List<Stock_Take> StockTake { get; set; }

        // Wisani
        // Link to audit trails
        public List<Audit_Trail> AuditTrail { get; set; }
        // Link to newsletter
        public List<Newsletter> Newsletters { get; set; }
        // Link to help
        public List<Help> Help { get; set; }

        // Mmapula
        // Link to schedule
        public List<Schedule> Schedules { get; set; }
        public List<WalkInSale> WalkInSales { get; set; }
        // Link to equipment order captured
        public List<EquipmentOrder_Captured> EquipmentOrder_CapturedEntity { get; set; }

        //Lungelo
        // Link to change requests
        public List<ChangeRequest> ChangeRequests { get; set; }
    }
}
