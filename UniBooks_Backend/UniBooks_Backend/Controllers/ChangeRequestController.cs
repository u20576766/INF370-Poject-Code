using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Model;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChangeRequestController : ControllerBase
    {
        private readonly IChangeRequestRepository _srRepository;
        private readonly IStudentRepository _studentRepository;

        public ChangeRequestController(IChangeRequestRepository changeRequest, IStudentRepository student)
        {
            _srRepository = changeRequest;
            _studentRepository = student;
        }

        [HttpGet]
        [Route("GetAllRequests")]
        public async Task<IActionResult> GetAllRequests()
        {
            try
            {
                var answers = await _srRepository.GetAllRequestsAsync();

                if (answers == null) return NotFound();
                return Ok(answers);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetRequest/{requestid}")]
        public async Task<IActionResult> GetRequestAsync(int requestid)
        {
            try
            {
                var answer = await _srRepository.GetChangeRequestAsync(requestid);

                if (answer == null) return NotFound("Change Request does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetRequest/{input}")]
        public async Task<IActionResult> GetRequestInputAsync(string input)
        {
            try
            {
                var answer = await _srRepository.GetChangeRequestInputAsync(input);

                if (answer == null) return NotFound("Change Request does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPost]
        [Route("AddRequest")]
        public async Task<IActionResult> AddRequest(ChangeRequestViewModel crvm)
        {
            string item = "None Yet";
            var request = new ChangeRequest
            {
                Student_ID = crvm.Student_ID,
                Submit_Date = DateTime.Now.ToString("dd-MM-yyyyy"),
                Query = crvm.Query,
                Employee_ID = 1,
                Response_Date = item,
                Response = item
            };

            try
            {
                _srRepository.Add(request);
                await _srRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }

            return Ok(request);
        }

        [HttpPut]
        [Route("Response/{requestid}")]
        public async Task<ActionResult<ChangeRequestViewModel>> Response(int requestid, ChangeRequestViewModel crvm)
        {
            try
            {
                var existingRequest = await _srRepository.GetChangeRequestAsync(requestid);
                if (existingRequest == null) return NotFound($"The Request does not exist");

                // Update the attributes from the view model
                existingRequest.Employee_ID = crvm.Employee_ID;
                existingRequest.Response_Date = DateTime.Now.ToString("dd-MM-yyyyy");
                existingRequest.Response = crvm.Response;
                // Add code to update the remaining attributes here

                // Save changes to the database
                if (await _srRepository.SaveChangesAsync())
                {
                    return Ok(existingRequest);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }


    }
}
