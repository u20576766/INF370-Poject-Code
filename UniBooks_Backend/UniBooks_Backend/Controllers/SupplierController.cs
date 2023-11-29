using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Model;


namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierRepository _srepository;

        public SupplierController(ISupplierRepository repository)
        {
            _srepository = repository;
        }

        [HttpGet]
        [Route("GetAllSuppliers")]
        public async Task<IActionResult> GetAllSuppliers()
        {
            try
            {
                var answers = await _srepository.GetAllSuppliersAsync();

                if (answers == null) return NotFound();
                return Ok(answers);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetSupplier/{Supplier_ID}")]
        public async Task<IActionResult> GetSupplierAsync(int Supplier_ID)
        {
            try
            {
                var answer = await _srepository.GetSupplierAsync(Supplier_ID);

                if (answer == null) return NotFound("Supplier does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetSupplierInput/{input}")]
        public async Task<IActionResult> GetSupplierInputAsync(string input)
        {
            try
            {
                var answer = await _srepository.GetSupplierInputAsync(input);

                if (answer == null) return NotFound("EquipmentType does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }



        [HttpPost]
        [Route("AddSupplier")]
        public async Task<IActionResult> AddSupplier(SupplierViewModel svm)
        {
            var supp = new Supplier
            {
                Supplier_Name = svm.Supplier_Name,
                Supplier_CellNumber = svm.Supplier_CellNumber,
                Supplier_Email = svm.Supplier_Email,
                Supplier_Address = svm.Supplier_Address,
            };

            try
            {
                _srepository.Add(supp);
                await _srepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }

            return Ok(supp);
        }

        [HttpPut]
        [Route("EditSupplier/{Supplier_ID}")]
        public async Task<ActionResult<SupplierViewModel>> EditSupplier(int Supplier_ID, SupplierViewModel SupplierModel)
        {
            try
            {
                var existingSupplier = await _srepository.GetSupplierAsync(Supplier_ID);
                if (existingSupplier == null) return NotFound($"The Supplier does not exist");

                existingSupplier.Supplier_Name = SupplierModel.Supplier_Name;
                existingSupplier.Supplier_CellNumber = SupplierModel.Supplier_CellNumber;
                existingSupplier.Supplier_Email = SupplierModel.Supplier_Email;
                existingSupplier.Supplier_Address = SupplierModel.Supplier_Address;


                if (await _srepository.SaveChangesAsync())
                {
                    return Ok(existingSupplier);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteSupplier/{Supplier_ID}")]
        public async Task<IActionResult> DeleteSupplier(int Supplier_ID)
        {
            try
            {
                var existingSupplier = await _srepository.GetSupplierAsync(Supplier_ID);

                if (existingSupplier == null) return NotFound($"The Supplier does not exist");

                _srepository.Delete(existingSupplier);

                if (await _srepository.SaveChangesAsync()) return Ok(existingSupplier);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}

