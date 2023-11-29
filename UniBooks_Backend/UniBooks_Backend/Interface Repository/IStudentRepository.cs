using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;


namespace UniBooks_Backend.InterfaceRepositories
{
    public interface IStudentRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

        Task<Student[]> GetAllStudentsAsync();
        Task<Student> GetAStudentAsync(int Student_ID);

        Task<Student[]> GetSearchedStudentAsync(string enteredQuery);

        Task<Student[]> GetSubscribedStudentsAsync();
        Task<Student[]> CheckExistingStudentAsync(StudentVM checkStudent);



    }
}
