using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResaleReportController : ControllerBase
    {
        private readonly IResaleReportRepository _resaleReportRepository;

        public ResaleReportController(IResaleReportRepository resaleReportRepository)
        {
            _resaleReportRepository = resaleReportRepository;
        }

        [HttpGet]
        [Route("GenerateResaleReport")]
        public IActionResult GenerateResaleReport()
        {
            var report = _resaleReportRepository.GenerateResaleReport();
            return Ok(report);
        }
    }
}
