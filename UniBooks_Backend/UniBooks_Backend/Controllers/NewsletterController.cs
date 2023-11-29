using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System.Net;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsletterController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IBlobRepository _blobRepository;
        private readonly INewsletterRepository _newsletterRepository;
        private readonly IStudent_NewsletterRepository _student_NewsletterRepository;

        public NewsletterController(IStudentRepository studentRepository, IBlobRepository blobRepository, INewsletterRepository newsletterRepository, IStudent_NewsletterRepository student_NewsletterRepository)
        {
            _studentRepository = studentRepository;
            _blobRepository = blobRepository;
            _newsletterRepository = newsletterRepository;
            _student_NewsletterRepository = student_NewsletterRepository;
        }

        [HttpPost]
        [Route("SendNewsletter")]
        public async Task<IActionResult> SendNewsletter([FromForm] NewsletterVM newsletterVM)
        {
            try
            {
                // List of email addresses to send the email to
                Student[] arrSubscribedStudents = new Student[0];
                arrSubscribedStudents = await _studentRepository.GetSubscribedStudentsAsync();

                // Create a new email message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("The Book Market", "unibooks.thebookmarket@gmail.com"));
                foreach (var recipient in arrSubscribedStudents)
                {
                    message.To.Add(new MailboxAddress(recipient.Name, recipient.Email)); // Recipient's name can be empty
                }
                message.Subject = newsletterVM.Subject;

                // Create the email body
                var bodyBuilder = new BodyBuilder();
                bodyBuilder.TextBody = "Hello! " + newsletterVM.Description;

                //uploading newsletter to blob and getting link back
                //if new video is uploaded
                var file = newsletterVM.NewsletterFile;
                if (file != null && file.Length > 0)
                {
                    //sanitize the file name
                    string sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName)
                        .Replace(" ", "_")
                        .Replace("-", "_") // Replace hyphens with underscores if needed
                        .Replace("...", "_") // Replace multiple dots with a single underscore if needed
                        + Path.GetExtension(file.FileName);

                    //assign sanitized file name
                    string fileName = sanitizedFileName;

                    //convert video to file data
                    byte[] fileData;
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        fileData = memoryStream.ToArray();
                    }

                    // Upload the newsletter file to Blob storage using the BlobRepository
                    string blobUrl = await _blobRepository.UploadNewsletterBlob(fileName, fileData);
                    string filePath = blobUrl;

                    // Download the attachment content from the Blob URL
                    using (WebClient webClient = new WebClient())
                    {
                        byte[] attachmentBytes = webClient.DownloadData(blobUrl);
                        using (MemoryStream attachmentStream = new MemoryStream(attachmentBytes))
                        {
                            // Add an attachment using the attachmentStream
                            bodyBuilder.Attachments.Add(fileName, attachmentStream);
                        }
                    }

                    message.Body = bodyBuilder.ToMessageBody();

                    // Configure the SMTP client
                    using (var client = new SmtpClient())
                    {
                        client.Connect("smtp.gmail.com", 587, false);
                        client.Authenticate("unibooks.thebookmarket@gmail.com", "nzrtvdxrsdpleubc");

                        // Send the email
                        client.Send(message);
                        client.Disconnect(true);
                    }
                    //get date newsletter was sent
                    string newsletterDate = DateTime.Now.ToString("dd-MM-yyyy");

                    //setting values of new newsletter record
                    var newsletter = new Newsletter();
                    newsletter.Subject = newsletterVM.Subject;
                    newsletter.Description = newsletterVM.Description;
                    newsletter.FileName = fileName;
                    newsletter.FilePath = filePath;
                    newsletter.Employee_ID = 1;

                    //adding new newsletter to table
                    _newsletterRepository.Add(newsletter);
                    //saving changes
                    await _newsletterRepository.SaveChangesAsync();
                    //geetting the id of the recently added newsletter
                    int insertedNewsletterId = newsletter.Newsletter_ID;

                    //adding values in the bridge entity student_newsletter
                    foreach (var student in arrSubscribedStudents)
                    {
                        var student_newsletter = new Student_Newsletter();
                        student_newsletter.Newsletter_ID = insertedNewsletterId;
                        student_newsletter.Student_ID = student.Student_ID;
                        student_newsletter.Date = newsletterDate;

                        _student_NewsletterRepository.Add(student_newsletter);
                        await _student_NewsletterRepository.SaveChangesAsync();
                    }

                    return Ok("Newsletter sent successfully");
                }
                return BadRequest($"Error sending newsletter");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error sending newsletter: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAllNewsletters")]
        public async Task<IActionResult> GetAllNewsletters()
        {
            try
            {
                var results = await _newsletterRepository.GetAllNewslettersAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting all students: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("SortByDescending")]
        public async Task<IActionResult> SortByDescending()
        {
            try
            {
                var results = await _newsletterRepository.SortByDescendingAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error sorting by descending : {ex.Message}");
            }
        }
    }
}