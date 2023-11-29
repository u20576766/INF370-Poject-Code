using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherController : ControllerBase
    {
        private readonly IVoucherRepository _voucherRepository;

        public VoucherController(IVoucherRepository voucherRepository)
        {
            _voucherRepository = voucherRepository;
        }

        // Retrieves all the vouchers
        [HttpGet]
        [Route("GetAllVouchers")]
        public async Task<IActionResult> GetAllVouchers()
        {
            try
            {
                var results = await _voucherRepository.GetAllVouchersAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        // Retrieves voucher results filtered by the search term
        [HttpGet]
        [Route("SearchVoucherPercent/{enteredQuery}")]
        public async Task<IActionResult> SearchVoucherPercent(int enteredQuery)
        {
            try
            {
                var result = await _voucherRepository.SearchVoucherPercentAsync(enteredQuery);
                if (result == null)
                {
                    return NotFound("Voucher does not exist. You may need to create them first");
                }
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        //Retrieves voucher by ID
        [HttpGet]
        [Route("GetAVoucher/{Voucher_ID}")]
        public async Task<IActionResult> GetAVoucher(int Voucher_ID)
        {
            try
            {
                var answer = await _voucherRepository.GetAVoucherAsync(Voucher_ID);

                if (answer == null) return NotFound("Voucher does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        // Adds a new voucher
        [HttpPost]
        [Route("AddVoucher")]
        public async Task<IActionResult> AddVoucher(VoucherViewModel newVoucher)
        {

            //check if a voucher already exists with the same details
            var existingVoucher = await _voucherRepository.SearchDuplicateVoucherAsync(newVoucher);
            //if theres no duplicate voucher then generate a new voucher
            if (existingVoucher == null)
            {
                try
                {
                    // CODE FOR GENERATING RANDOM VOUCHER CODE
                    Random random = new Random();
                    string inputString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    int length = 5; // Desired length of the random selection

                    // Select random characters
                    string newVoucherCode = new string(Enumerable.Range(0, length)
                        .Select(_ => inputString[random.Next(inputString.Length)])
                        .ToArray());

                    //ASSIGNING VALUES TO NEW VOUCHER
                    var voucher = new Voucher
                    {
                        Voucher_Code = newVoucherCode,
                        Percent = newVoucher.Percent,
                        Expiry_Date = newVoucher.Expiry_Date
                    };

                    _voucherRepository.Add(voucher);
                    await _voucherRepository.SaveChangesAsync();

                    return Ok(voucher);

                }
                catch (Exception err)
                {
                    return BadRequest($"Error adding a book voucher: {err.Message}");
                }

            }
            else //else if there already is a duplicate then return error message
                {
                    return BadRequest($"A voucher with same details already exists");
                }
        }

        // Edits details of a voucher
        [HttpPut]
        [Route("EditVoucher/{voucherId}")]
        public async Task<ActionResult<VoucherViewModel>> EditVoucher(int voucherId, VoucherViewModel voucherModel)
        {
            try
            {
                var existingVoucher = await _voucherRepository.GetAVoucherAsync(voucherId);
                if (existingVoucher == null)
                {
                    return NotFound($"The voucher does not exist");
                }

                // USER CAN ONLY CHANGE EXPIRY DATE
                existingVoucher.Expiry_Date = voucherModel.Expiry_Date;

                if (await _voucherRepository.SaveChangesAsync())
                {
                    return Ok(existingVoucher);
                }
            }
            catch (Exception err)
            {
                return BadRequest($"Error updating a book voucher: {err.Message}");
            }
            return StatusCode(500, "Internal Server Error. Please contact support");
        }

        // Deletes a voucher
        [HttpDelete]
        [Route("DeleteVoucher/{voucherId}")]
        public async Task<IActionResult> DeleteVoucher(int voucherId)
        {
            try
            {
                var existingVoucher = await _voucherRepository.GetAVoucherAsync(voucherId);
                if (existingVoucher == null)
                {
                    return NotFound($"The voucher does not exist");
                }

                _voucherRepository.Delete(existingVoucher);

                if (await _voucherRepository.SaveChangesAsync())
                {
                    return Ok(existingVoucher);
                }
            }
            catch (Exception err)
            {
                return BadRequest($"Error deleting a book voucher: {err.Message}");
            }
            return BadRequest("Your request is invalid");
        }

    }
}
