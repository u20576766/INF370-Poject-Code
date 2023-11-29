using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Repository
{
    public class EquipmentReportRepository: IEquipmentReportRepository
    {

        private readonly  AppDbContext _context;

        public EquipmentReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<EquipmentReportViewModel> GenerateEquipmentReport()
        {
            try
            {
                var report = _context.Equipments
                    .Include(e => e.Equipment_Types)
                    .Select(e => new EquipmentReportViewModel
                    {
                        Name = e.Name,
                        EquipmentType = e.Equipment_Types != null ? e.Equipment_Types.Name : "Unknown Type",
                        QuantityOnHand = e.Quantity_On_Hand,
                        //LastEdited = e.Date_Last_Updated != null ? e.Date_Last_Updated : "N/A"
                    })
                    .ToList();

                return report;
            }
            catch (Exception ex)
            {
                // Log the exception or perform error handling as needed
                // You can also throw a custom exception if required
                throw;
            }
        }

    }
}
