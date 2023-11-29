using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Interface_Repository;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentReportController : ControllerBase
    {
        private readonly IEquipmentReportRepository _equipmentReportRepository;

        public EquipmentReportController(IEquipmentReportRepository equipmentReportRepository)
        {
            _equipmentReportRepository = equipmentReportRepository;
        }

        [HttpGet]
        [Route("GenerateEquipmentReport")]
        public IActionResult GenerateEquipmentReport()
        {
            var report = _equipmentReportRepository.GenerateEquipmentReport();

            // Find the Equipment Type with the lowest quantity
            var equipmentTypeWithLowestQuantity = report
                .OrderBy(e => e.QuantityOnHand)
                .FirstOrDefault();

            return Ok(new
            {
                Report = report,
                LowestQuantityEquipmentType = equipmentTypeWithLowestQuantity
            });
        }
    }
}

