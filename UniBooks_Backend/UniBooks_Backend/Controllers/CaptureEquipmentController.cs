using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Model;
using System.Linq.Expressions;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaptureEquipmentController : ControllerBase
    {
        private readonly ICaptureEquipment _captureRepo;
        public CaptureEquipmentController(ICaptureEquipment captureRepo)
        {
            _captureRepo = captureRepo;
        }


        [HttpPost]
        [Route("CaptureEquipment")]
        public async Task<IActionResult> CaptureEquipment(CaptureEquipmentViewModel vm)
        {
            var order = new EquipmentOrder
            {
                Date = vm.Date,
                Description = vm.Description,
                Receipt = vm.Receipt,
                Supplier_ID = vm.Supplier_ID
            };
            try
            {
                Console.WriteLine("Start of CaptureEquipment");

                _captureRepo.Add(order);
                await _captureRepo.SaveChangesAsync();
                Console.WriteLine("Order added and saved changes");

                var capturedOrder = new EquipmentOrder_Captured
                {
                    Equipment_ID = vm.Equipment_ID,
                    EquipmentOrder_ID = order.EquipmentOrder_ID,
                    Quantity_Bought = vm.Quantity_Bought,
                    Employee_ID = vm.Employee_ID
                };

                _captureRepo.AddEquipmentOrderCaptured(capturedOrder);
                await _captureRepo.SaveChangesAsync();
                Console.WriteLine("Captured Order added and saved changes");

                var existingequipment = await _captureRepo.GetEquipmentByIdAsync(vm.Equipment_ID);
                if (existingequipment == null)
                {
                    Console.WriteLine("Equipment does not exist");
                    return NotFound($"The equipment does not exist");
                }

                existingequipment.Quantity_On_Hand = existingequipment.Quantity_On_Hand + vm.Quantity_Bought;
                _captureRepo.Update(existingequipment);

                if (await _captureRepo.SaveChangesAsync())
                {
                    Console.WriteLine("Changes saved successfully");
                    return Ok("Captured Equipment successfully");
                }

                Console.WriteLine("Error saving changes");
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }





    }
}

