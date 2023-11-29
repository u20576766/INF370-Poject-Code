using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using UniBooks_Backend.Models;

namespace UniBooks_Backend.Factory
{
    public class AppUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser>
    {
        public AppUserClaimsPrincipalFactory(
        UserManager<AppUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor)
        {
        }
    
    }
}


