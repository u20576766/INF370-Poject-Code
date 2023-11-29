namespace UniBooks_Backend.ViewModels
{
    public class GetEquipmentViewModel
    {
        public int Equipment_ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Quantity_On_Hand { get; set; }
        public string Image { get; set; }

        public int EquipmentType_ID { get; set; }
        public string EquipmentType_Name { get; set; }

        public int Price_ID { get; set; }
        public decimal VATAmount { get; set; }
        public decimal AmountWithoutVAT { get; set; }
        public decimal AmountWithVAT { get; set; }

        public int Module_ID { get; set; }
        public string  Module_Code { get; set; }
    }
}
