using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using UniBooks_Backend.Models;

namespace UniBooks_Backend
{
    public class ContextSeedService
    {
        private readonly IServiceProvider _serviceProvider;

        public ContextSeedService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task InitializeContextAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                if (!await roleManager.Roles.AnyAsync())
                {
                    await roleManager.CreateAsync(new IdentityRole { Name = "Administrator" });
                    await roleManager.CreateAsync(new IdentityRole { Name = "Employee" });
                    await roleManager.CreateAsync(new IdentityRole { Name = "Student" });
                }

                if (!await userManager.Users.AnyAsync())
                {
                    var student = new AppUser
                    {
                        FirstName = "Student",
                        LastName = "User",
                        UserName = "student@example.com",
                        Email = "student@example.com",
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(student, "123456");
                    await userManager.AddToRoleAsync(student, "Student");
                    await userManager.AddClaimsAsync(student, new Claim[]
                    {
                        new Claim(ClaimTypes.Email, student.Email),
                        new Claim(ClaimTypes.Surname, student.LastName)
                    });

                    var admin = new AppUser
                    {
                        FirstName = "admin",
                        LastName = "jackson",
                        UserName = "admin@example.com",
                        Email = "admin@example.com",
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(admin, "123456");
                    await userManager.AddToRolesAsync(admin, new[] { "Administrator", "Employee" });
                    await userManager.AddClaimsAsync(admin, new Claim[]
                    {
                        new Claim(ClaimTypes.Email, admin.Email),
                        new Claim(ClaimTypes.Surname, admin.LastName)
                    });

                    var employee = new AppUser
                    {
                        FirstName = "employee",
                        LastName = "wilson",
                        UserName = "employee@example.com",
                        Email = "employee@example.com",
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(employee, "123456");
                    await userManager.AddToRoleAsync(employee, "Employee");
                    await userManager.AddClaimsAsync(employee, new Claim[]
                    {
                        new Claim(ClaimTypes.Email, employee.Email),
                        new Claim(ClaimTypes.Surname, employee.LastName)
                    });
                }
            }
        }
    }
}
