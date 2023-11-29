namespace UniBooks_Backend.InterfaceRepositories
{
    public interface IStudent_NewsletterRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

    }
}
