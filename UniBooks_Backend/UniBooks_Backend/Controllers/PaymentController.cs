using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IHttpClientFactory clientFactory, IConfiguration configuration, ILogger<PaymentController> logger)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        //Create payment to send to payfast
        [HttpPost("CreatePayment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePayment([FromBody] PayFastRequest payment)
        {
            var client = _clientFactory.CreateClient();

            var cultureInfo = new CultureInfo("en-US");
            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

            // Change this line to use the live PayFast URL
            var url = "https://sandbox.payfast.co.za/eng/process";

            //Add merchant_id to payment array
            if (int.TryParse(_configuration["PayFast:MerchantId"], out int merchantId))
            {
                payment.merchant_id = merchantId;
            }
            else
            {
                // Log an error
                _logger.LogError($"MerchantId value '{_configuration["PayFast:MerchantId"]}' is not a valid integer.");
            }

            //Add mechant key to payment array
            payment.merchant_key = _configuration["PayFast:MerchantKey"];

            //get Passphrase from appsettings
            var passphrase = _configuration["PayFast:MerchantPassphrase"];

            var propertyValues = payment.GetType().GetProperties()
                .Where(p => p.GetValue(payment) != null && p.Name != "signature")
                .OrderBy(p => p.Name)
                .Select(p => $"{p.Name}={UrlEncode(p.GetValue(payment).ToString())}");


            // Now the return_url and notify_url are included in the raw data for the MD5 hash:
            var rawData = string.Join("&", propertyValues) + $"&passphrase={passphrase}";

            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                payment.signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
            }

            var keyValues = payment.GetType().GetProperties()
                .Select(p => new KeyValuePair<string, string>(p.Name, p.GetValue(payment)?.ToString() ?? ""));
            var formContent = new FormUrlEncodedContent(keyValues);

            //Get response related data
            var response = await client.PostAsync(url, formContent).ConfigureAwait(false);
            var responseContent = await response.Content.ReadAsStringAsync();

            PayFastResponse payFastResponse = null;
            try
            {
                payFastResponse = JsonConvert.DeserializeObject<PayFastResponse>(responseContent);
            }
            catch (JsonReaderException)
            {
                // The response content isn't valid JSON
                // Log the error and/or handle it appropriately
            }

            if (response.IsSuccessStatusCode)
            {
                // Add the signature to the redirect URL
                var redirectUrl = $"{url}?{rawData}&signature={payment.signature}";

                // Create a custom response object containing payment info and redirect URL
                var paymentResponse = new
                {
                    PaymentInfo = payment, // Include payment information
                    RedirectUrl = redirectUrl // Include redirect URL
                };

                // Return the payment information and redirect URL as JSON
                return Ok(paymentResponse);
            }
            else
            {
                return BadRequest(responseContent);
            }

        }


        private string UrlEncode(object value)
        {
            return WebUtility.UrlEncode(Convert.ToString(value, CultureInfo.InvariantCulture))?.Replace("%20", "+");
        }



        [HttpPost("HandlePaymentResult")]
        public async Task<IActionResult> HandlePaymentResult([FromBody] PayFastRequest payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            // Get your passphrase from configuration
            var passphrase = _configuration["PayFast:MerchantPassphrase"];

            // Generate a signature from the incoming payment data
            var propertyValues = payment.GetType().GetProperties()
            .Where(p => p.GetValue(payment) != null && p.Name != "signature")
            .OrderBy(p => p.Name)
            .Select(p => $"{p.Name}={UrlEncode(p.GetValue(payment).ToString())}");


            var rawData = string.Join("&", propertyValues) + $"&passphrase={passphrase}";

            //Encrypted signature validation
            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                var generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                // Compare the generated signature with the one in the request
                if (payment.signature != generatedSignature)
                {
                    // Log an error, the signatures do not match
                    _logger.LogError("Payment signature verification failed.");
                    return BadRequest("Payment signature verification failed.");
                }
            }

            // If the signatures match, continue with saving the payment to the database
            //var eventPayment = MapToEventPayment(payment);
            //_context.EventsPayments.Add(eventPayment);
            //await _context.SaveChangesAsync();

            // After saving the payment to the database, return a successful response
            return Ok();
        }

        private PayFastRequest MapToOrder(PayFastRequest payment)
        {
            return new PayFastRequest
            {
                merchant_id = payment.merchant_id,
                merchant_key = payment.merchant_key,
                amount = payment.amount,
                item_name = payment.item_name,
                signature = payment.signature,
                email_address = payment.email_address,
                cell_number = payment.cell_number,
            };
        }

    }
}
