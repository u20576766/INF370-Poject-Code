using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleRepository _schedulerepository; 
        
        public ScheduleController(IScheduleRepository schedulerepository)
        {
            _schedulerepository = schedulerepository;
        }


        //7.1.Adding new slot
        [HttpPost]
        [Route("AddScheduleSlots")]
        public async Task<IActionResult>AddScheduleSlots(ScheduleViewModel svm)
        {
            var slot = new Schedule
            {
                Date = svm.Date,
                Slots_Available = svm.Slots_Available,
                Employee_ID = svm.Employee_ID
            };

            try
            {
                _schedulerepository.Add(slot);
                await _schedulerepository.SaveChangesAsync();
            }
            catch(Exception)
            {
                return BadRequest("Invalid transaction");
            }
            return Ok("Schedule added successfully");
        }
        

        //7.3.Update slot
        [HttpPut]
        [Route("UpdateSlots/{schedule_id}")]
        public async Task<ActionResult<ScheduleViewModel>>UpdateSlots(int schedule_id, ScheduleViewModel svm)
        {
            try
            { 
                 var findslot = await _schedulerepository.GetSlotAsync(schedule_id);
                  if(findslot == null)
                {
                    return NotFound($"Oops slot date not found");
                }

                  findslot.Date = svm.Date;
                  findslot.Slots_Available = svm.Slots_Available;
                 findslot.Employee_ID = svm.Employee_ID;

                 if (await _schedulerepository.SaveChangesAsync())
                {
                    return Ok("Slot updated successfully!");
                }

            }
            catch(Exception) 
             {
                return StatusCode(500, "internal server error .please contact support");
            }
            return BadRequest("Your request is invalid");
        }


        //7.4. Deletable 
        [HttpGet]
        [Route("GetNotDeleteable")]
        public async Task<IActionResult>GetNotDeletableSlots()
        {
            try
            {
                var results = await _schedulerepository.NotDeletableSlots();
                return Ok(results);
            } 
            catch(Exception)
             {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
         

        //Delete slot
        [HttpDelete]
        [Route("DeleteEvaluationSlot/{scheduleid}")]
        public async Task<IActionResult> DeleteScheduleSlot(int scheduleid)
        {
            try
            {  //select course to delete
                var scheduledelete = await _schedulerepository.GetSlotAsync(scheduleid);
                //if its not found after searching 
                if (scheduledelete == null)
                {
                    return NotFound($"sorry slot does not exist");

                }
                _schedulerepository.Delete(scheduledelete);
                if (await _schedulerepository.SaveChangesAsync())
                {
                    return Ok("Slot deleted successfully!");
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server error.Please contact support.");
            }

            return BadRequest("Your request is invalid ");
        }
         

        //get slot by id 
        [HttpGet]
        [Route("GetSlot/{scheduleid}")]
        public async Task<IActionResult> GetSlotAsync(int scheduleid)
        {
            try
            {
                var getslot = await _schedulerepository.GetSlotAsync(scheduleid);
                //incase of error , the course is not found
                if (getslot == null)
                {
                    return NotFound("Oops , course not found.");
                }
                return Ok(getslot);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error.Please contact support");
            }
        }

        //7.2. All slots 

        [HttpGet]
        [Route("GetAllScheduleSlots")]
        public async Task<IActionResult> GetAllScheduleSlots()
        {
            try
            {
                var results = await _schedulerepository.GetAllScheduleSlots();
                return Ok(results);
                
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        //7.5. Generate scehdule summary 
        [HttpGet]
        [Route("GetScheduleSummary")]
        public async Task<IActionResult>GetScheduleSummary()
        {
            try
            {
                var results = await _schedulerepository.GetSummary();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetScheduleDates")]
        public async Task<IActionResult>GetScheduleDates()
        {
            try
            {
                var results =   _schedulerepository.GetSchedulesWithConvertedDate();
                return Ok(results);
            }
            catch(Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }




    }
}
