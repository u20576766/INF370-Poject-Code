using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.InterfaceRepositories;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelpController : ControllerBase
    {
        private readonly IHelpRepository _helpTipRepository;
        private readonly IBlobRepository _blobRepository;

        private readonly IHttpContextAccessor _httpContextAccessor;
        private ISession _session => _httpContextAccessor.HttpContext.Session;
        //private readonly IUserRepository _userRepository;

        public HelpController(IHelpRepository helpTipRepository, IBlobRepository blobRepository, 
            //IUserRepository userRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _helpTipRepository = helpTipRepository;
            _blobRepository = blobRepository;
           // _userRepository = userRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        // Retrieves all the help tips
        [HttpGet]
        [Route("GetAllHelpTips")]
        public async Task<IActionResult> GetAllHelpTips()
        {
            try
            {
                var results = await _helpTipRepository.GetAllHelpTipsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetAHelpTip/{Help_ID}")]
        public async Task<IActionResult> GetAHelpTip(int Help_ID)
        {
            try
            {
                var answer = await _helpTipRepository.GetAHelpTipAsync(Help_ID);

                if (answer != null)
                {
                    return Ok(answer);
                }
                else
                {
                    return NotFound("Help Tip does not exist");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        // Retrieves help tip results filtered by the search term
        [HttpGet]
        [Route("GetSearchedHelpTip/{enteredQuery}")]
        public async Task<IActionResult> GetSearchedHelpTip(string enteredQuery)
        {
            try
            {
                var result = await _helpTipRepository.GetSearchedHelpTipAsync(enteredQuery);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound("Help tip does not exist. You may need to create it first");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        //generates a stream link of the blob file
        [HttpGet]
        [Route("GenerateBlobStreamLink/{fileName}")]
        public async Task<IActionResult> GenerateBlobStreamLink(string fileName)
        {
            try
            {
                string blobStreamLink = await _blobRepository.GenerateBlobStreamLinkAsync(fileName);
                return Content(blobStreamLink, "text/plain");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error generating stream link: {ex.Message}");
            }
        }

        // Adds a new help tip
        [HttpPost]
        [Route("AddHelpTip")]
        public async Task<IActionResult> AddHelpTip([FromForm] HelpTipViewModel htViewModel)
        {
            try
            {
                // Process the uploaded file(s)
                var file = htViewModel.VideoFile;
                string fileName = file.FileName;

                //if file is empty notify user that no file is uploaded
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }
                else
                {
                    //if help tip video with same file name exists then notify user that it exists
                    var existingHelpBlob = await _helpTipRepository.GetABlobFile(file.FileName);
                    if (existingHelpBlob != null)
                    {
                        return BadRequest($"Help tip already exists");
                    }
                    else
                    {
                        //if file is not empty then process video and add new help tip
                        if (file != null && file.Length > 0)
                        {
                            byte[] fileData;
                            using (var memoryStream = new MemoryStream())
                            {
                                await file.CopyToAsync(memoryStream);
                                fileData = memoryStream.ToArray();
                            }

                            //renaming video to a sanitzed video name that doesnt cause error when adding to azure
                            string sanitizedFileName = Path.GetFileNameWithoutExtension(fileName)
                            .Replace(" ", "_")
                            .Replace("-", "_") // Replace hyphens with underscores if needed
                            .Replace("...", "_") // Replace multiple dots with a single underscore if needed
                            + Path.GetExtension(fileName);

                            fileName = sanitizedFileName;
                            // Upload the video file to Blob storage using the BlobRepository
                            string blobUrl = await _helpTipRepository.UploadBlobFile(fileName, fileData);
                            var filePath = blobUrl;

                            var helpTip = new Help
                            {
                                Name = htViewModel.Name,
                                Description = htViewModel.Description,
                                Date = DateTime.Now.ToString("dd-MM-yyyy"),
                                FilePath = filePath,
                                FileName = fileName,
                                Employee_ID = htViewModel.Employee_ID,
                            };

                            _helpTipRepository.Add(helpTip);
                            await _helpTipRepository.SaveChangesAsync();

                            return Ok(helpTip);
                        }
                    }
                    // Perform your desired logic with the received data
                    return Ok("Data received successfully!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error uploading video: {ex.Message}");
            }
        }

        // Edits details of a helpTip
        [HttpPut]
        [Route("EditHelpTip/{HelpID}")]
        public async Task<ActionResult<HelpTipViewModel>> EditHelpTip(int HelpID, [FromForm] HelpTipViewModel helpTipModel)
        {
            try
            {
                var existingHelpTip = await _helpTipRepository.GetAHelpTipAsync(HelpID);
                if (existingHelpTip != null)
                {
                    existingHelpTip.Name = helpTipModel.Name;
                    existingHelpTip.Description = helpTipModel.Description;
                    existingHelpTip.Date = DateTime.Now.ToString("dd-MM-yyyy");

                    //if new video is uploaded
                    var file = helpTipModel.VideoFile;
                    if (file != null && file.Length > 0)
                    {
                        _blobRepository.DeleteHelpBlob(existingHelpTip.FileName);
                        //sanitize the file name
                        string sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName)
                            .Replace(" ", "_")
                            .Replace("-", "_") // Replace hyphens with underscores if needed
                            .Replace("...", "_") // Replace multiple dots with a single underscore if needed
                            + Path.GetExtension(file.FileName);

                        //convert video to file data
                        byte[] fileData;
                        using (var memoryStream = new MemoryStream())
                        {
                            await file.CopyToAsync(memoryStream);
                            fileData = memoryStream.ToArray();
                        }
                        //assign sanitized file name
                        string fileName = sanitizedFileName;
                        // Upload the video file to Blob storage using the BlobRepository
                        string blobUrl = await _blobRepository.UploadBlobFile(fileName, fileData);
                        //assign the videoURL
                        var filePath = blobUrl;

                        //then change the fileName and filePath
                        existingHelpTip.FileName = fileName;
                        existingHelpTip.FilePath = filePath;
                    }

                    if (await _helpTipRepository.SaveChangesAsync())
                    {
                        return Ok(existingHelpTip);
                    }
                    else
                    {
                        return NotFound($"The help tip does not exist");
                    }
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }

        // Deletes a helpTip
        [HttpDelete]
        [Route("DeleteHelpTip/{HelpID}")]
        public async Task<IActionResult> DeleteHelpTip(int HelpID)
        {
            try
            {
                var existingHelpTip = await _helpTipRepository.GetAHelpTipAsync(HelpID);
                if (existingHelpTip != null)
                {
                    _blobRepository.DeleteHelpBlob(existingHelpTip.FileName);
                    _helpTipRepository.Delete(existingHelpTip);
                }
                else
                {
                    return NotFound($"The help tip does not exist");
                }

                if (await _helpTipRepository.SaveChangesAsync())
                {
                    return Ok(existingHelpTip);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }
    }
}