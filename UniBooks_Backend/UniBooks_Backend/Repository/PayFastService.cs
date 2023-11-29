using System.Collections.Specialized;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using UniBooks_Backend.Interface_Repository;

namespace UniBooks_Backend.Repository
{
    public class PayFastService : IPayFastService
    {
        private const string MerchantId = "10030337";
        private const string MerchantKey = "fa6rp5do9dpdi";
        private const string SandboxUrl = "https://sandbox.payfast.co.za/eng/process"; // Change this to live URL when ready

        public string GeneratePaymentRequest(decimal amount, string returnUrl, string cancelUrl)
        {
            string paymentUrl = SandboxUrl; // Use Sandbox URL during development/testing

            string data = $"merchant_id={MerchantId}&merchant_key={MerchantKey}&return_url={returnUrl}&cancel_url={cancelUrl}&amount={amount}&item_name=Order";

            using (var md5 = MD5.Create())
            {
                byte[] hashBytes = md5.ComputeHash(Encoding.ASCII.GetBytes(data));
                string signature = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

                paymentUrl = $"{paymentUrl}?{data}&signature={signature}";
            }

            return paymentUrl;
        }

        public bool VerifyPaymentNotification(NameValueCollection notification)
        {
            var parameters = new NameValueCollection(notification);

            string signature = parameters["signature"];
            parameters.Remove("signature");

            string data = string.Join("&", parameters.AllKeys.Select(key => $"{key}={WebUtility.UrlEncode(parameters[key])}"));

            using (var md5 = MD5.Create())
            {
                byte[] hashBytes = md5.ComputeHash(Encoding.ASCII.GetBytes(data + "&merchant_key=" + MerchantKey));
                string calculatedSignature = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

                return signature.Equals(calculatedSignature);
            }
        }
    }
}
