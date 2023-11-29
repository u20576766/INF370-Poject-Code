using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace UniBooks_Backend.Models
{
    public class Prescribed_Book_List
    {
        [Key]
        public int Prescribed_Book_List_ID { get; set; }

        [Required]
        public string Excel_File { get; set; }

        [Required]
        [StringLength(10)]
        public string Date { get; set; }

        public List<Prescribed_Book> PrescribedBook { get; set; }
    }
}
