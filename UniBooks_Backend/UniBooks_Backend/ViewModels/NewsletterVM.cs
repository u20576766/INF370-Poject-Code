using Azure.Storage.Blobs.Models;
using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class NewsletterVM
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public string? Date { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public IFormFile? NewsletterFile { get; set; }
        public int Employee_ID { get; set; }
        public int Recipients { get; set; }

        public NewsletterVM(string subject, string description, string date, string fileName, string filePath, IFormFile newsletterFile, int employee_ID, int recipients)
        {
            Subject = subject;
            Description = description;
            Date = date;
            FileName = fileName;
            FilePath = filePath;
            NewsletterFile = newsletterFile;
            Employee_ID = employee_ID;
            Recipients = recipients;
        }

        public NewsletterVM()
        {

        }


    }
}
