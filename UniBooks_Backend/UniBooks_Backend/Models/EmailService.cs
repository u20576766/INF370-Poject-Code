using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Threading.Tasks;

namespace UniBooks_Backend.Models
{
    public class EmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, IFormFile newsletter)
        {
            if (string.IsNullOrEmpty(toEmail))
            {
                throw new ArgumentException("The 'toEmail' parameter cannot be null or empty.", nameof(toEmail));
            }

            if (string.IsNullOrEmpty(subject))
            {
                throw new ArgumentException("The 'subject' parameter cannot be null or empty.", nameof(subject));
            }

            if (string.IsNullOrEmpty(body))
            {
                throw new ArgumentException("The 'body' parameter cannot be null or empty.", nameof(body));
            }
            var isValidToEmail = MailboxAddress.TryParse(toEmail, out var toAddress);

            if (!isValidToEmail)
            {
                throw new ArgumentException("Invalid email address format.", nameof(toEmail));
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            //message.Body = new TextPart("plain")
            //{
            //    Text = body
            //};

            //using var client = new SmtpClient();
            //await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, SecureSocketOptions.StartTls);
            //await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
            //await client.SendAsync(message);
            //await client.DisconnectAsync(true);


            var bodyBuilder = new BodyBuilder();
            bodyBuilder.TextBody = body;

            if (newsletter != null && newsletter.Length > 0)
            {
                var attachment = new MimePart
                {
                    Content = new MimeContent(newsletter.OpenReadStream(), ContentEncoding.Default),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = newsletter.FileName
                };

                bodyBuilder.Attachments.Add(attachment);
            }

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
