using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class AuditTrailVM
    {
        public int AuditEntryTypeID { get; set; }
        public int Employee_ID { get; set; }
        public DateTime? DateTimeStamp { get; set; }
        public string? Audit_Entry_Type { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string Comment { get; set; }
        public AuditTrailVM(int auditEntryTypeID, int employee_ID, DateTime dateTimeStamp, string audit_Entry_Type, string name, string surname, string comment)
        {
            AuditEntryTypeID = auditEntryTypeID;
            Employee_ID = employee_ID;
            DateTimeStamp = dateTimeStamp;
            Audit_Entry_Type = audit_Entry_Type;
            Name = name;
            Surname = surname;
            Comment = comment;
        }

        public AuditTrailVM()
        {

        }

    }
}
