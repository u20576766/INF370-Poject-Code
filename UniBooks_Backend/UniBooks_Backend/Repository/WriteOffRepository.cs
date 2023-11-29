using System;
using System.Collections.Generic;
using System.Linq;
using UniBooks_Backend.Interfaces;
using UniBooks_Backend.Models;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Repositories
{
    public class WriteOffRepository : IWriteOffRepository
    {
        private readonly AppDbContext _context;

        public WriteOffRepository(AppDbContext context)
        {
            _context = context;
        }

        public Write_Off GetWriteOffById(int id)
        {
            return _context.WriteOff.FirstOrDefault(w => w.Write_Off_ID == id);
        }

        public List<Write_Off> GetAllWriteOffs()
        {
            return _context.WriteOff.ToList();
        }

        public void WriteOffStock(WriteOffViewModel writeOffViewModel)
        {
            // Find the corresponding Book or Equipment based on the search keyword
            if (writeOffViewModel.Book_ID != 0)
            {
                var book = _context.Books.FirstOrDefault(b => b.Book_ID == writeOffViewModel.Book_ID);
                if (book == null)
                {
                    throw new ArgumentException("Book with the specified ID not found.");
                }

                if (writeOffViewModel.Quantity > 0)
                {
                    // Create a new Write_Off entry
                    var writeOff = new Write_Off
                    {
                        Write_Off_Date = DateTime.Now.ToShortDateString(),
                        Reason = writeOffViewModel.Reason,
                        Employee_ID = writeOffViewModel.Employee_ID,
                        WriteOffLine = new List<Write_Off_Line>
                        {
                            new Write_Off_Line { Book_ID = book.Book_ID, Quantity = writeOffViewModel.Quantity, Equipment_ID = null }
                        }
                    };

                    // Add the writeOff to the context and save changes
                    _context.WriteOff.Add(writeOff);
                    _context.SaveChanges();
                }
                else
                {
                    throw new ArgumentException("Invalid write-off quantity.");
                }
            }
            else if (writeOffViewModel.Equipment_ID != 0)
            {
                var equipment = _context.Equipments.FirstOrDefault(e => e.Equipment_ID == writeOffViewModel.Equipment_ID);
                if (equipment == null)
                {
                    throw new ArgumentException("Equipment with the specified ID not found.");
                }

                if (writeOffViewModel.Quantity > 0)
                {
                    // Create a new Write_Off entry
                    var writeOff = new Write_Off
                    {
                        Write_Off_Date = DateTime.UtcNow.ToString("dd-MM-yyyy"),
                        Reason = writeOffViewModel.Reason,
                        Employee_ID = writeOffViewModel.Employee_ID,
                        WriteOffLine = new List<Write_Off_Line>
                        {
                            new Write_Off_Line { Equipment_ID = equipment.Equipment_ID, Quantity = writeOffViewModel.Quantity   , Book_ID = null}
                        }
                    };

                    // Add the writeOff to the context and save changes
                    _context.WriteOff.Add(writeOff);
                    _context.SaveChanges();
                }
                else
                {
                    throw new ArgumentException("Invalid write-off quantity.");
                }
            }
            else
            {
                throw new ArgumentException("Invalid stock take type. Please provide a valid Book_ID or Equipment_ID.");
            }
        }
    }
}
