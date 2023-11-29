using System;
using System.Collections.Specialized;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Specialized;

namespace UniBooks_Backend.Interface_Repository
{
    public interface IPayFastService
    {
        string GeneratePaymentRequest(decimal amount, string returnUrl, string cancelUrl);
        bool VerifyPaymentNotification(NameValueCollection notification);
    }
}
