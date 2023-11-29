using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;

using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;


namespace UniBooks_Backend.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _appDbContext;
        public StudentRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<Student[]> GetAllStudentsAsync()
        {
            IQueryable<Student> query = _appDbContext.Students;
            return await query.ToArrayAsync();
        }

        public async Task<Student> GetAStudentAsync(int Student_ID)
        {
            IQueryable<Student> query = _appDbContext.Students.Where(c => c.Student_ID == Student_ID);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Student[]> GetSearchedStudentAsync(string enteredQuery)
        {
            IQueryable<Student> query = _appDbContext.Students.Where(c => c.Name.Contains(enteredQuery)
                                                                || c.Surname.Contains(enteredQuery)
                                                                || c.Email.Contains(enteredQuery)
                                                                || c.Cell_Number.Contains(enteredQuery) );
            return await query.ToArrayAsync();
        }

        public async Task<Student[]> CheckExistingStudentAsync(StudentVM checkStudent)
        {
            IQueryable<Student> query = _appDbContext.Students.Where(c => c.Name == checkStudent.Name
                                                                & c.Surname == checkStudent.Surname
                                                                & c.Email == checkStudent.Email
                                                                & c.Cell_Number == checkStudent.Cell_Number);
            return await query.ToArrayAsync();
        }
        public async Task<Student[]> GetSubscribedStudentsAsync()
        {
            IQueryable<Student> query = _appDbContext.Students.Where(c => c.Subscribed == true);
            return await query.ToArrayAsync();
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

    }
}
