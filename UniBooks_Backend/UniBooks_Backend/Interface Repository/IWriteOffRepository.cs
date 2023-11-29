using System.Collections.Generic;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Interfaces
{
    public interface IWriteOffRepository
    {
        Write_Off GetWriteOffById(int id);
        List<Write_Off> GetAllWriteOffs();
        void WriteOffStock(WriteOffViewModel writeOffViewModel);
    }
}