using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Models;


namespace UniBooks_Backend.InterfaceRepositories
{
    public interface INewsletterRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();
        Task<NewsletterVM[]> GetAllNewslettersAsync();
        Task<NewsletterVM[]> SortByDescendingAsync();

        Task<Newsletter[]> GetSearchedNewsletterAsync(string enteredQuery);

        void DeleteNewsletterBlobAsync(string name);

    }
}
