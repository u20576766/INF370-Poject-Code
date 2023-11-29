using System.ComponentModel.DataAnnotations;

namespace UniBooks_Backend.ViewModels
{
    public class SupplierViewModel
    {
        
        public string Supplier_Name { get; set; } = string.Empty;
        public string Supplier_Email { get; set; } = string.Empty;
        public string Supplier_CellNumber { get; set; } = string.Empty;
        public string Supplier_Address { get; set; } = string.Empty;

    }
}
