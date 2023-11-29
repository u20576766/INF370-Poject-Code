using UniBooks_Backend.Factory;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UniBooks_Backend.Models;
using UniBooks_Backend.Repository;
using UniBooks_Backend;
using System.Text.Json.Serialization;
using UniBooks_Backend.Interface_Repository;
using UniBooks_Backend.Repositories;
using UniBooks_Backend.Interfaces;
using UniBooks_Backend.Interface_Repoistory;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using UniBooks_Backend.InterfaceRepositories;
using Microsoft.SqlServer.Management.Smo.Agent;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;



var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;


// Inside ConfigureServices method
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    options.JsonSerializerOptions.MaxDepth = 32;
});
// be able to authenticate users using JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // validate the token based on the key we have provided inside appsettings.development.json JWT:Key
            ValidateIssuerSigningKey = true,
            // the issuer singning key based on JWT:Key
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Tokens:Key"])),
            // the issuer which in here is the api project url we are using
            ValidIssuer = builder.Configuration["Tokens:Issuer"],
            // validate the issuer (who ever is issuing the JWT)
            ValidateIssuer = true,
            // don't validate audience (angular side)
            ValidateAudience = false
        };
    });
builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});




// Identity Configuration
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    // password configuration
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireDigit = true;
    options.User.RequireUniqueEmail = true;
    // for email confirmation
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddUserManager<UserManager<AppUser>>()// make use of UserManager to create users
 .AddRoles<IdentityRole>() // be able to add roles
    .AddRoleManager<RoleManager<IdentityRole>>() // be able to make use of RoleManager
    .AddSignInManager<SignInManager<AppUser>>() // make use of Signin manager
    .AddDefaultTokenProviders(); // be able to create tokens for email confirmation

// Add Repositories
builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, AppUserClaimsPrincipalFactory>();
builder.Services.AddScoped<IPrescribedBookListRepository, PrescribedBookListRepository>();
builder.Services.AddScoped<IPrescribedBookRepository, PrescribedBookRepository>();
builder.Services.AddScoped<IFacultyRepository, FacultyRepository>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IModuleRepository, ModuleRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IBook_InventoryRepository, Book_InventoryRepository>();
builder.Services.AddScoped<IStockTakeRepository, StockTakeRepository>();
builder.Services.AddScoped<IWriteOffRepository, WriteOffRepository>();
builder.Services.AddScoped<IBookInventoryReportRepository, BookInventoryReportRepository>();
builder.Services.AddScoped<IEquipmentReportRepository,EquipmentReportRepository>();
builder.Services.AddScoped<IResaleReportRepository, ResaleReportRepository>();
builder.Services.AddScoped<IOrderReportRepository, OrderReportRepository>();
builder.Services.AddScoped<ISaleReportRepository, SaleReportRepository>();

// Add other repositories as needed

//wisani
builder.Services.AddScoped<IHelpRepository, HelpRepository>();
builder.Services.AddScoped<IBlobRepository, BlobRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<INewsletterRepository, NewsletterRepository>();
builder.Services.AddScoped<IVoucherRepository, VoucherRepository>();
builder.Services.AddScoped<IAuditTrailRepository, AuditTrailRepository>();
builder.Services.AddScoped<IStudent_NewsletterRepository, Student_NewsletterRepository>();

//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IEmployeeTypeRepository, EmployeeTypeRepository>();

//lungelo
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderStatusRepository, OrderStatusRepository>();
builder.Services.AddScoped<IShoppingCart_BookRepository, ShoppingCart_BookRepository>();
builder.Services.AddScoped<IShoppingCart_EquipmentRepository, ShoppingCart_EquipmentRepository>();
builder.Services.AddScoped<IShoppingCartRepository, ShoppingCartRepository>();
builder.Services.AddScoped<IChangeRequestRepository, ChangeRequestRepository>();
builder.Services.AddHttpClient();

//mmapula
builder.Services.AddScoped<IResellerRepository, ResellerRepository>();
builder.Services.AddScoped<ICaptureEquipment, CaptureEquipmentRepository>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<IEquipmentTypeRepository, EquipmentTypeRepository>();
builder.Services.AddScoped<IEquipmentRepository, EquipmentRepository>();
builder.Services.AddScoped<IVATRepository, VATRepository>();
builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();
builder.Services.AddScoped<IMakeSaleRepository, MakeSaleRepository>();

//nkosinathi
builder.Services.AddScoped<SystemDataRepository>();
builder.Services.AddScoped<DatabaseRestoreRepository>();
builder.Services.AddScoped<BlobRepository>();
//builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddSingleton(x => new BlobServiceClient(builder.Configuration.GetConnectionString("AzureBlobConnectionString")));

builder.Services.Configure<DataProtectionTokenProviderOptions>(options => options.TokenLifespan = TimeSpan.FromHours(3));

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Example API",
        Version = "v1",
        Description = "An example of an ASP.NET Core Web API",
        Contact = new OpenApiContact
        {
            Name = "The Book Market",
            Email = "unibooks.thebookmarket@gmail.com",
            Url = new Uri("https://thebookmarket.business.site/"),
        },
    });
});

// Inside ConfigureServices method
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<EmailService>();

// be able to inject JWTService class inside our Controllers
builder.Services.AddScoped<JWTService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<ContextSeedService>();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState
        .Where(x => x.Value.Errors.Count > 0)
        .SelectMany(x => x.Value.Errors)
        .Select(x => x.ErrorMessage).ToArray();

        var toReturn = new
        {
            Errors = errors
        };

        return new BadRequestObjectResult(toReturn);
    };
});

// Program.cs
builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy(SD.Policies.StudentPolicy, policy => policy.RequireRole(SD.StudentRole));

    opt.AddPolicy(SD.Policies.FlexibleUserPolicy, policy => policy.RequireRole(SD.EmployeeRole, SD.AdministratorRole));

    opt.AddPolicy(SD.Policies.AdminEmailPolicy, policy => policy.RequireClaim(ClaimTypes.Email, SD.AdminUserName));
    opt.AddPolicy(SD.Policies.WilsonSurnamePolicy, policy => policy.RequireClaim(ClaimTypes.Surname, "wilson"));
    opt.AddPolicy(SD.Policies.EmployeeEmailAndSurnamePolicy, policy => policy.RequireClaim(ClaimTypes.Surname, "employee")
        .RequireClaim(ClaimTypes.Email, "employee@example.com"));
    opt.AddPolicy("VIPPolicy", policy => policy.RequireAssertion(context =>
    {
        // Implement your custom VIP policy logic here
        var user = context.User;
        return user.IsInRole(SD.EmployeeRole) && user.HasClaim(c => c.Type == ClaimTypes.Email && c.Value.Contains("vip"));
    }));
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniBooks Backend API V1");
    });
}





app.UseCors();
app.UseRouting();
app.UseHttpsRedirection();

// adding UseAuthentication into our pipeline and this should come before UseAuthorization
// Authentication verifies the identity of a user or service, and authorization determines their access rights.
app.UseAuthentication();
app.UseAuthorization();

// is going to look for index.html and serving our api application using index.html
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
//app.MapFallbackToController("Index", "Fallback");

#region ContextSeed
using var scope = app.Services.CreateScope();
try
{
    var contextSeedService = scope.ServiceProvider.GetService<ContextSeedService>();
    await contextSeedService.InitializeContextAsync();
}
catch (Exception ex)
{
    var logger = scope.ServiceProvider.GetService<ILogger<Program>>();
    logger.LogError(ex.Message, "Failed to initialize and seed the database");
}
#endregion

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();



