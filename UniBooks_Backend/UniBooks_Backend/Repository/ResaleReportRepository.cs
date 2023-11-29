using System;
using System.Collections.Generic;
using System.Linq;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Repository
{
    public class ResaleReportRepository :IResaleReportRepository
    {
        private readonly AppDbContext _context;

        public ResaleReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<ResaleReportViewModel> GenerateResaleReport()
        {
            return _context.ResaleLog
                .Select(r => new ResaleReportViewModel
                {
                    Date = r.Date,
                    Amount_Exchanged = r.Amount_Exchanged,
                    ResaleDescription = r.Description,
                    EvaluationDescription = r.EvalautionBookLog.Description
                })
                .ToList();
        }
    }
}

