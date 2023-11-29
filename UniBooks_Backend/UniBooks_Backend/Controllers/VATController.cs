using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Components.Forms;
using UniBooks_Backend.Interface_Repository;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    public class VATController : ControllerBase
    {
        private readonly IVATRepository _vatRepository;

        public VATController(IVATRepository vatRepoistory)
        {
            _vatRepository = vatRepoistory;
        }

        [HttpGet]
        [Route("GetVAT")]
        public async Task<IActionResult> GetVAT()
        {
            try
            {
                var results = await _vatRepository.GetVATAsync();

                if (results == null) return NotFound();
                return Ok(results);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }


        [HttpPut]
        [Route("EditVAT")]
        public async Task<ActionResult<VATViewModel>> EditVAT(VATViewModel vatviewmodel)
        {
            try
            {
                var ourVAT = await _vatRepository.GetVATAsync();

                ourVAT.Percent = vatviewmodel.Percent;

                if (await _vatRepository.SaveChangesAsync())
                {
                    return Ok(vatviewmodel);
                }
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");

            }
            return BadRequest("Your request is invalid");
        }
    }
}