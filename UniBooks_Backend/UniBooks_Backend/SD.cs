
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace UniBooks_Backend
{
    public static class SD
    {
        // Roles
        public const string StudentRole = "Student";
        public const string EmployeeRole = "Employee";
        public const string AdministratorRole = "Administrator";

        public const string AdminUserName = "unibooks.thebookmarket@gmail.com";
        public const string SuperAdminChangeNotAllowed = "Super Admin change is not allowed!";
        public const int MaximumLoginAttempts = 3;

        public static class Policies
        {
            public const string StudentPolicy = "StudentPolicy";
            public const string FlexibleUserPolicy = "FlexibleUserPolicy";
            public const string AdminEmailPolicy = "AdminEmailPolicy";
            public const string WilsonSurnamePolicy = "WilsonSurnamePolicy";
            public const string EmployeeEmailAndSurnamePolicy = "EmployeeEmailAndSurnamePolicy";
        }
    }
}
