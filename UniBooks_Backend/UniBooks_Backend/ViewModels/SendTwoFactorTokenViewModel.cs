namespace UniBooks_Backend.ViewModels
{
    public class SendTwoFactorTokenViewModel
    {
        public string Email { get; set; }
        public string AppBaseUrl { get; set; }
        
    }

    public class ISendTwoFactorTokenViewModel
    {
        public string Email { get; set; }
        public string IonicBaseUrl { get; set; }
       
    }

}
