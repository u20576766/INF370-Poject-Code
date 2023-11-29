using System.ComponentModel.DataAnnotations;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.ViewModels
{
    public class ResellerViewModel
    {
        public decimal Estimated_Price { get; set; }
        public string ImageFront { get;set;}
        public string ImageBack { get;set;}
        public string ImageBinder { get;set;}
        public string ImageOpen { get;set;}
        public int Student_ID { get; set;}
        public string ISBN { get; set;}
    } 
}
