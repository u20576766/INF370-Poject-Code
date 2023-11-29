using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResellerReportController : ControllerBase
    {
        private readonly IResellerReportRepository _repository;

        public ResellerReportController(IResellerReportRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<ResellerReportViewModel> GetResellerReport()
        {
            var report = _repository.GetResellerReport();
            return Ok(report);
        }
    }
}
