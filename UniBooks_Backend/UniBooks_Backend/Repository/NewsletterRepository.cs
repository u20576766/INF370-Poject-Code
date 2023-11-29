using Azure.Storage.Blobs;
using UniBooks_Backend.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.IO;


using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.InterfaceRepositories;

namespace UniBooks_Backend.Repositories
{
    public class NewsletterRepository : INewsletterRepository
    {
        private readonly AppDbContext _appDbContext;
        private readonly BlobServiceClient _blobServiceClient;
        private BlobContainerClient client;

        public NewsletterRepository(AppDbContext appDbContext, BlobServiceClient blobServiceClient)
        {
            _appDbContext = appDbContext;
            _blobServiceClient = blobServiceClient;
            client = _blobServiceClient.GetBlobContainerClient("newslettercontainer");

        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);

        }
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;

        }

        public async Task<NewsletterVM[]> GetAllNewslettersAsync()
        {
            IQueryable<NewsletterVM> query = _appDbContext.Newsletters
                .Join(
                    _appDbContext.StudentNewsletter,
                    newsletter => newsletter.Newsletter_ID,
                    studentNewsletter => studentNewsletter.Newsletter_ID,
                    (newsletter, studentNewsletter) => new { Newsletter = newsletter, StudentNewsletter = studentNewsletter }
                )
                .GroupBy(
                    result => new
                    {
                        result.StudentNewsletter.Date,
                        result.Newsletter.Subject,
                        result.Newsletter.Description,
                        result.Newsletter.FileName,
                        result.Newsletter.FilePath
                    }
                )
                .Select(
                    group => new NewsletterVM
                    {
                        Recipients = group.Count(),
                        Date = group.Key.Date,
                        Subject = group.Key.Subject,
                        Description = group.Key.Description,
                        FileName = group.Key.FileName,
                        FilePath = group.Key.FilePath
                    }
                );

            return await query.ToArrayAsync(); // Execute the query and return the results as an array.
        }

        public async Task<NewsletterVM[]> SortByDescendingAsync()
        {
            IQueryable<NewsletterVM> query = _appDbContext.Newsletters
                .Join(
                    _appDbContext.StudentNewsletter,
                    newsletter => newsletter.Newsletter_ID,
                    studentNewsletter => studentNewsletter.Newsletter_ID,
                    (newsletter, studentNewsletter) => new { Newsletter = newsletter, StudentNewsletter = studentNewsletter }
                )
                .GroupBy(
                    result => new
                    {
                        result.StudentNewsletter.Date,
                        result.Newsletter.Subject,
                        result.Newsletter.Description,
                        result.Newsletter.FileName,
                        result.Newsletter.FilePath
                    }
                )
                .Select(
                    group => new NewsletterVM
                    {
                        Recipients = group.Count(),
                        Date = group.Key.Date,
                        Subject = group.Key.Subject,
                        Description = group.Key.Description,
                        FileName = group.Key.FileName,
                        FilePath = group.Key.FilePath
                    }
                )
                .OrderByDescending(vm => vm.Date); // Order by Date in descending order.

            return await query.ToArrayAsync(); // Execute the query and return the results as an array.
        }





        public async Task<Newsletter[]> GetSearchedNewsletterAsync(string enteredQuery)
        {
            IQueryable<Newsletter> query = _appDbContext.Newsletters.Where(c => c.Subject.Contains(enteredQuery)
                                                    || c.Description.Contains(enteredQuery));
            return await query.ToArrayAsync();
        }

        public async void DeleteNewsletterBlobAsync(string path)
        {
            var fileName = new Uri(path).Segments.LastOrDefault();
            var blobClient = client.GetBlobClient(fileName);
            await blobClient.DeleteIfExistsAsync();

        }

        public async void DeleteBlob(string path)
        {

        }


    }
}
