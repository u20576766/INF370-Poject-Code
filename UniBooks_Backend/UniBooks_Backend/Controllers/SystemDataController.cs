using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Models;
using Microsoft.Extensions.Logging;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemDataController : ControllerBase
    {
       
        
       private readonly IBlobRepository _blobRepository;
        private readonly SystemDataRepository _systemDataRepository;
        public SystemDataController(SystemDataRepository systemDataRepository,IBlobRepository blobRepository)
        {
            _blobRepository = blobRepository;
            _systemDataRepository = systemDataRepository;
           
        }

        [HttpPost("setbackupinterval")]
        public IActionResult setbackupinterval([FromBody] int intervalValue)
        {
            try
            {
                _systemDataRepository.SetBackupInterval(intervalValue);
                return Ok(new { message = $"Backup interval set to {intervalValue}" });

            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("backup")]
        public IActionResult Backup()
        {
            string backupResult = _systemDataRepository.Backup();
            return Ok(backupResult);
        }
        [HttpPost("RestoreDatabase")]
        public async Task<IActionResult> RestoreDatabase()
        {
           string connectionString = "Server=.\\SQLEXPRESS;Database=UniBooks;Trusted_Connection=True;MultipleActiveResultSets=True;Encrypt=False";

            try
            {
                var res = _systemDataRepository.RestoreDatabase(connectionString);

                return Ok("Database restoration initiated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




    }
}
