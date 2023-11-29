using System.IO;

namespace UniBooks_Backend.Models
{
    public class BlobObject
    {
        public Stream? Content { get; set; }
        public string ContentType { get; set; }
    }
}
