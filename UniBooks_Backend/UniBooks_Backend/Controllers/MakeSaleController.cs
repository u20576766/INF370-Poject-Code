using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MakeSaleController : ControllerBase
    {
        private readonly IMakeSaleRepository _repository;

        public MakeSaleController(IMakeSaleRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetPaymentTypes")]
        public async Task<ActionResult<List<Payment_Type>>> GetAllPaymentTypes()
        {
            try
            {
                var paymentTypes = await _repository.GetAllPaymentTypesAsync();
                return Ok(paymentTypes);
            }
            catch(Exception)
             {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

         }


        [HttpPost]
        [Route("AddWalkInSale")]
        public async Task<ActionResult> AddWalkInSale(WalkInSaleViewModel model)
        {
            // Perform validation if needed
            // Map the ViewModel data to your entity
            var walkInSale = new WalkInSale();


            if (model.Voucher_ID == 0)
            {


                walkInSale.TotalAmount = model.TotalAmount;
                walkInSale.Date = model.Date;
                walkInSale.Student_ID = model.Student_ID;
                walkInSale.Voucher_ID = null;
                    walkInSale.Employee_ID = model.Employee_ID;
                walkInSale.PaymentType_ID = model.PaymentType_ID;

                
            }
            else
            {

                walkInSale.TotalAmount = model.TotalAmount;
                walkInSale.Date = model.Date;
                walkInSale.Student_ID = model.Student_ID;
                walkInSale.Voucher_ID = model.Voucher_ID;
                walkInSale.Employee_ID = model.Employee_ID;
                walkInSale.PaymentType_ID = model.PaymentType_ID;

            }


            try
            {  
                _repository.AddWalkInSale(walkInSale);
                await _repository.SaveChangesAsync();

            }
            catch (Exception)
            {
                return BadRequest("Inavlid Request");
            }

            return Ok(walkInSale);

            // Add to DbContext and save changes

        }

        [HttpPost]
        [Route("AddWalkInSaleBooks")]
        public async Task<ActionResult> AddWalkInSaleBooks( WalkInSaleBooksViewModel model)
        {
            // Map the ViewModel data to your entity
            var walkInSaleBooks = new WalkInSaleBooks
            {
                Book_ID = model.Book_ID,
                Quantity = model.Quantity,
                TotalAmount = model.TotalCosts,
                WalkInSale_ID = model.WalkInSale_ID
            };

            try { 
            // Add to DbContext and save changes
           _repository.Add(walkInSaleBooks);
               
        await _repository.UpdateBookQuantityAsync(model.Book_ID, -model.Quantity);
                await _repository.SaveChangesAsync();

            return Ok("Added successfully");
            }
            catch (Exception)
            {
                return BadRequest("Inavlid Request");
            }

           

        }

        [HttpPost]
        [Route("AddWalkInSaleEquipment")]
        public async Task<ActionResult> AddWalkInSaleEquipment( WalkInSalesEquipmentViewModel model)
        {
            // Map the ViewModel data to your entity
            var walkInSalesEquipment = new WalkInSalesEquipment
            {
                Equipment_ID = model.Equipment_ID,
                Quantity = model.Quantity,
                TotalAmount = model.TotalCosts,
                WalkInSale_ID = model.WalkInSale_ID
            };
            try
            {
                // Add to DbContext and save changes
                _repository.Add(walkInSalesEquipment);
                await _repository.UpdateEquipmentQuantityAsync(model.Equipment_ID, -model.Quantity);
                await _repository.SaveChangesAsync();

                return Ok("Added successfully");
            }
            catch (Exception)
            {
                return BadRequest("Inavlid Request");
            }

        }

        [HttpGet]
        [Route("ViewSale")]
        public async Task <IActionResult> GetSales()
        {
            try
            {
                var results = await _repository.GetSaleSummary();
                return Ok(results);

            }
            catch (Exception)
            {
                return BadRequest("Error retrieving ");
            }
        }
    }
}
