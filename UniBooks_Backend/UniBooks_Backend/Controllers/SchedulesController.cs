using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly IScheduleRepository _scheduleRepository;

        public SchedulesController(IScheduleRepository scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        [HttpGet]
        [Route("GetAllSchedules")]
        public async Task<IActionResult> GetAllSchedules()
        {
            try
            {
                var results = await _scheduleRepository.GetAllScheduleSlots();
                return Ok(results);
               // Console.WriteLine(results.ToString());
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }

        [HttpPost]
        [Route("AddSchedule")]
        public async Task<IActionResult> AddSchedule(ScheduleViewModel schedulevm)
        {
            var newschedule = new Schedule()
            {
              //  Schedule_ID = schedulevm.Schedule_ID,
               
                Date = schedulevm.Date,
                Employee_ID = schedulevm.Employee_ID,
                Slots_Available = schedulevm.Slots_Available,
               
            };
            try
            {
                _scheduleRepository.Add(newschedule);
               await _scheduleRepository.SaveChangesAsync();
            }
            catch (Exception)
            {

                return BadRequest("Invalid Request");
            }
            
            return Ok(newschedule);
        }

        [HttpPut]
        [Route("UpdateSchedule/{Schedule_ID}")]
        public async Task<ActionResult<ScheduleViewModel>> UpdateSchedule(int Schedule_ID, ScheduleViewModel scheduleViewModel)
        {
            try
            {
                var existingschedule = await _scheduleRepository.GetSlotAsync(Schedule_ID);
                if (existingschedule == null) return NotFound($"The schedule is ot created");
                
                existingschedule.Date = scheduleViewModel.Date;
                existingschedule.Slots_Available = scheduleViewModel.Slots_Available;
               
                if (await _scheduleRepository.SaveChangesAsync())
                {
                    return Ok(existingschedule);
                }
            }
            catch (Exception x)
            {
                 return StatusCode(StatusCodes.Status500InternalServerError,x);
               // return Ok(x);
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpGet]
        [Route("GetSchedule/{Schedule_ID}")]
        public async Task<IActionResult> GetScheduleAsync(int Schedule_ID)
        {
            try
            {
                var answer = await _scheduleRepository.GetSlotAsync(Schedule_ID);

                if (answer == null) return NotFound("Schedule does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }
        [HttpDelete]
        [Route("DeleteSchedule/{Schedule_ID}")]
        public async Task<IActionResult> DeleteSchedule(int Schedule_ID)
        {
            try
            {
                var existingschedule = await _scheduleRepository.GetSlotAsync(Schedule_ID);

                if (existingschedule == null) return NotFound($"Schedule does not exist");

                _scheduleRepository.Delete(existingschedule);

                if (await _scheduleRepository.SaveChangesAsync()) return Ok(existingschedule);
                

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}
