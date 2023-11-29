using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditTrailController : ControllerBase
    {
        private readonly IAuditTrailRepository _auditTrailRepository;

        private readonly IHttpContextAccessor _httpContextAccessor;
        private ISession _session => _httpContextAccessor.HttpContext.Session;
        //private readonly IUserRepository _userRepository;

        public AuditTrailController(IAuditTrailRepository auditTrailRepository, 
           // IUserRepository userRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _auditTrailRepository = auditTrailRepository;
            //_userRepository = userRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        // Adds a new voucher
        [HttpPost]
        [Route("GenerateAuditTrail")]
        public async Task<IActionResult> GenerateAuditTrail([FromForm] AuditTrailVM AuditTrailVM)
        {
            try
            {
                var newAuditTrail = new Audit_Trail
                {
                    DateTimeStamp = DateTime.Now,
                    Employee_ID = AuditTrailVM.Employee_ID,
                    Audit_Entry_Type_ID = AuditTrailVM.AuditEntryTypeID,
                    Comment = AuditTrailVM.Comment,
                };

                _auditTrailRepository.Add(newAuditTrail);
                await _auditTrailRepository.SaveChangesAsync();

                return Ok(newAuditTrail);
            }
            catch (Exception err)
            {
                return BadRequest($"Error adding generating audit trail: {err.Message}");
            }
        }

        // GET ALL AUDIT TRAIL RECORDS
        [HttpGet]
        [Route("GetAllAuditTrails")]
        public async Task<IActionResult> GetAllAuditTrails()
        {
            try
            {
                var results = await _auditTrailRepository.GetAllAuditTrailsAsync();

                if (results.Length > 0)
                {
                    return Ok(results);
                }
                else
                {
                    return BadRequest($"No Audit Trail Results Found");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        //GET FILTERED AUDIT TRAIL RECORDS
        [HttpGet]
        [Route("GetFilteredAuditTrails")]
        public async Task<IActionResult> GetFilteredAuditTrails(DateTime startDate, DateTime endDate)
        {
            try
            {
                var results = await _auditTrailRepository.GetFilteredAuditTrailsAsync(startDate, endDate);

                if (results.Length > 0)
                {
                    return Ok(results);
                }
                else
                {
                    return BadRequest($"No Audit Trail Results Found");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }


        //GET FILTERED BY CATEGORY  AUDIT TRAIL RECORDS
        [HttpGet]
        [Route("GetAuditTrailsByCategories")]
        public async Task<IActionResult> GetAuditTrailsByCategories(string selectedCategory, string searchQuery)
        {
            try
            {
                string userActionFilter = null;
                string nameFilter = null;
                string surnameFilter = null;
                string commentFilter = null;
                string allCategoriesFilter = null;

                if (selectedCategory == "Action Type")
                {
                    userActionFilter = searchQuery;
                }
                else if (selectedCategory == "Employee")
                {
                    nameFilter = searchQuery;
                    surnameFilter = searchQuery;
                }
                else if (selectedCategory == "Comment")
                {
                    commentFilter = searchQuery;
                }
                else if (selectedCategory == "All Categories")
                {
                    allCategoriesFilter = searchQuery;
                }

                var results = await _auditTrailRepository.GetAuditTrailsByFilterAsync(allCategoriesFilter, userActionFilter, nameFilter, surnameFilter, commentFilter);

                if (results.Length > 0)
                {
                    return Ok(results);
                }
                else
                {
                    return BadRequest($"No Audit Trail Results Found");
                }
            }
            catch (Exception err)
            {
                return BadRequest($"{err.Message}");
            }
        }

    }
}