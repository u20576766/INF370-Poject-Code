using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniBooks_Backend.Migrations
{
    public partial class again : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditEntryTypes",
                columns: table => new
                {
                    Audit_Entry_Type_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserAction = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditEntryTypes", x => x.Audit_Entry_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeTypes",
                columns: table => new
                {
                    Employee_Type_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeTypes", x => x.Employee_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentType",
                columns: table => new
                {
                    EquipmentType_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentType", x => x.EquipmentType_ID);
                });

            migrationBuilder.CreateTable(
                name: "Faculties",
                columns: table => new
                {
                    Faculty_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Faculty_Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Faculties", x => x.Faculty_ID);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatus",
                columns: table => new
                {
                    Order_Status_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatus", x => x.Order_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "PaymentType",
                columns: table => new
                {
                    PaymentType_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentType_Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentType", x => x.PaymentType_ID);
                });

            migrationBuilder.CreateTable(
                name: "PrescribedBookList",
                columns: table => new
                {
                    Prescribed_Book_List_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Excel_File = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescribedBookList", x => x.Prescribed_Book_List_ID);
                });

            migrationBuilder.CreateTable(
                name: "resalePercent",
                columns: table => new
                {
                    Percent_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percent_Value = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resalePercent", x => x.Percent_Id);
                });

            migrationBuilder.CreateTable(
                name: "ResellerBookStatus",
                columns: table => new
                {
                    Reseller_Book_Status_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResellerBookStatus", x => x.Reseller_Book_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    Supplier_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Supplier_Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Supplier_Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Supplier_CellNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Supplier_Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Supplier_ID);
                });

            migrationBuilder.CreateTable(
                name: "VATs",
                columns: table => new
                {
                    VAT_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percent = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VATs", x => x.VAT_ID);
                });

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    Voucher_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Voucher_Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Percent = table.Column<decimal>(type: "decimal(18,2)", maxLength: 4, nullable: false),
                    Expiry_Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.Voucher_ID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Student_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cell_Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Subscribed = table.Column<bool>(type: "bit", nullable: false),
                    Timestamp = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false),
                    User_ID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Student_ID);
                    table.ForeignKey(
                        name: "FK_Students_AspNetUsers_User_ID",
                        column: x => x.User_ID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Employee_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cell_Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Physical_Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    BirthDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Emergency_Contact_Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Emergency_Contact_Cell = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Employee_Type_ID = table.Column<int>(type: "int", nullable: false),
                    User_ID = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Employee_ID);
                    table.ForeignKey(
                        name: "FK_Employees_AspNetUsers_User_ID",
                        column: x => x.User_ID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employees_EmployeeTypes_Employee_Type_ID",
                        column: x => x.Employee_Type_ID,
                        principalTable: "EmployeeTypes",
                        principalColumn: "Employee_Type_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Department_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Department_Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Faculty_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Department_ID);
                    table.ForeignKey(
                        name: "FK_Departments_Faculties_Faculty_ID",
                        column: x => x.Faculty_ID,
                        principalTable: "Faculties",
                        principalColumn: "Faculty_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentOrders",
                columns: table => new
                {
                    EquipmentOrder_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Receipt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Supplier_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentOrders", x => x.EquipmentOrder_ID);
                    table.ForeignKey(
                        name: "FK_EquipmentOrders_Suppliers_Supplier_ID",
                        column: x => x.Supplier_ID,
                        principalTable: "Suppliers",
                        principalColumn: "Supplier_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Order_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Order_Reference_Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Order_Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Order_Total = table.Column<decimal>(type: "decimal(18,2)", maxLength: 7, nullable: false),
                    Collector_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date_Of_Collection = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Student_ID = table.Column<int>(type: "int", nullable: false),
                    Order_Status_ID = table.Column<int>(type: "int", nullable: false),
                    Voucher_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Order_ID);
                    table.ForeignKey(
                        name: "FK_Orders_OrderStatus_Order_Status_ID",
                        column: x => x.Order_Status_ID,
                        principalTable: "OrderStatus",
                        principalColumn: "Order_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Students_Student_ID",
                        column: x => x.Student_ID,
                        principalTable: "Students",
                        principalColumn: "Student_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Vouchers_Voucher_ID",
                        column: x => x.Voucher_ID,
                        principalTable: "Vouchers",
                        principalColumn: "Voucher_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingCart",
                columns: table => new
                {
                    ShoppingCart_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Discount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Count = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    SubTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingCart", x => x.ShoppingCart_ID);
                    table.ForeignKey(
                        name: "FK_ShoppingCart_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "Student_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AuditTrails",
                columns: table => new
                {
                    Audit_Trail_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DateTimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false),
                    Audit_Entry_Type_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditTrails", x => x.Audit_Trail_ID);
                    table.ForeignKey(
                        name: "FK_AuditTrails_AuditEntryTypes_Audit_Entry_Type_ID",
                        column: x => x.Audit_Entry_Type_ID,
                        principalTable: "AuditEntryTypes",
                        principalColumn: "Audit_Entry_Type_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AuditTrails_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChangeRequests",
                columns: table => new
                {
                    Request_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Student_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false),
                    Query = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Submit_Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false),
                    Response = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Response_Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChangeRequests", x => x.Request_ID);
                    table.ForeignKey(
                        name: "FK_ChangeRequests_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChangeRequests_Students_Student_ID",
                        column: x => x.Student_ID,
                        principalTable: "Students",
                        principalColumn: "Student_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Help",
                columns: table => new
                {
                    Help_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Help", x => x.Help_ID);
                    table.ForeignKey(
                        name: "FK_Help_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Newsletters",
                columns: table => new
                {
                    Newsletter_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Subject = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Newsletters", x => x.Newsletter_ID);
                    table.ForeignKey(
                        name: "FK_Newsletters_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    Schedule_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Slots_Available = table.Column<int>(type: "int", maxLength: 1, nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.Schedule_ID);
                    table.ForeignKey(
                        name: "FK_Schedules_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StockTake",
                columns: table => new
                {
                    StockTake_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTake", x => x.StockTake_ID);
                    table.ForeignKey(
                        name: "FK_StockTake_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WalkInSales",
                columns: table => new
                {
                    WalkInSale_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", maxLength: 8, nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Student_ID = table.Column<int>(type: "int", nullable: false),
                    Voucher_ID = table.Column<int>(type: "int", nullable: true),
                    Employee_ID = table.Column<int>(type: "int", nullable: false),
                    PaymentType_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalkInSales", x => x.WalkInSale_ID);
                    table.ForeignKey(
                        name: "FK_WalkInSales_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WalkInSales_PaymentType_PaymentType_ID",
                        column: x => x.PaymentType_ID,
                        principalTable: "PaymentType",
                        principalColumn: "PaymentType_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WalkInSales_Students_Student_ID",
                        column: x => x.Student_ID,
                        principalTable: "Students",
                        principalColumn: "Student_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WalkInSales_Vouchers_Voucher_ID",
                        column: x => x.Voucher_ID,
                        principalTable: "Vouchers",
                        principalColumn: "Voucher_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WriteOff",
                columns: table => new
                {
                    Write_Off_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Write_Off_Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WriteOff", x => x.Write_Off_ID);
                    table.ForeignKey(
                        name: "FK_WriteOff_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Modules",
                columns: table => new
                {
                    Module_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Module_Code = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Department_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.Module_ID);
                    table.ForeignKey(
                        name: "FK_Modules_Departments_Department_ID",
                        column: x => x.Department_ID,
                        principalTable: "Departments",
                        principalColumn: "Department_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentNewsletter",
                columns: table => new
                {
                    Student_ID = table.Column<int>(type: "int", nullable: false),
                    Newsletter_ID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentNewsletter", x => new { x.Student_ID, x.Newsletter_ID });
                    table.ForeignKey(
                        name: "FK_StudentNewsletter_Newsletters_Newsletter_ID",
                        column: x => x.Newsletter_ID,
                        principalTable: "Newsletters",
                        principalColumn: "Newsletter_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentNewsletter_Students_Student_ID",
                        column: x => x.Student_ID,
                        principalTable: "Students",
                        principalColumn: "Student_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Booking_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Num_Of_Books = table.Column<int>(type: "int", nullable: false),
                    Reference_Num = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Schedule_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Booking_ID);
                    table.ForeignKey(
                        name: "FK_Bookings_Schedules_Schedule_ID",
                        column: x => x.Schedule_ID,
                        principalTable: "Schedules",
                        principalColumn: "Schedule_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Equipments",
                columns: table => new
                {
                    Equipment_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Quantity_On_Hand = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Module_ID = table.Column<int>(type: "int", nullable: false),
                    EquipmentType_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipments", x => x.Equipment_ID);
                    table.ForeignKey(
                        name: "FK_Equipments_EquipmentType_EquipmentType_ID",
                        column: x => x.EquipmentType_ID,
                        principalTable: "EquipmentType",
                        principalColumn: "EquipmentType_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Equipments_Modules_Module_ID",
                        column: x => x.Module_ID,
                        principalTable: "Modules",
                        principalColumn: "Module_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PrescribedBook",
                columns: table => new
                {
                    ISBN = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublisherName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AuthorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BasePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Edition = table.Column<int>(type: "int", maxLength: 5, nullable: false),
                    Year = table.Column<int>(type: "int", maxLength: 4, nullable: false),
                    Module_ID = table.Column<int>(type: "int", nullable: false),
                    Prescribed_Book_List_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescribedBook", x => x.ISBN);
                    table.ForeignKey(
                        name: "FK_PrescribedBook_Modules_Module_ID",
                        column: x => x.Module_ID,
                        principalTable: "Modules",
                        principalColumn: "Module_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PrescribedBook_PrescribedBookList_Prescribed_Book_List_ID",
                        column: x => x.Prescribed_Book_List_ID,
                        principalTable: "PrescribedBookList",
                        principalColumn: "Prescribed_Book_List_ID");
                });

            migrationBuilder.CreateTable(
                name: "EvalautionBookLog",
                columns: table => new
                {
                    Evaluation_Book_Log_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Booking_ID = table.Column<int>(type: "int", nullable: true),
                    Student_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvalautionBookLog", x => x.Evaluation_Book_Log_ID);
                    table.ForeignKey(
                        name: "FK_EvalautionBookLog_Bookings_Booking_ID",
                        column: x => x.Booking_ID,
                        principalTable: "Bookings",
                        principalColumn: "Booking_ID");
                    table.ForeignKey(
                        name: "FK_EvalautionBookLog_Students_Student_ID",
                        column: x => x.Student_ID,
                        principalTable: "Students",
                        principalColumn: "Student_ID");
                });

            migrationBuilder.CreateTable(
                name: "EquipmentOrder_CapturedEntity",
                columns: table => new
                {
                    Equipment_ID = table.Column<int>(type: "int", nullable: false),
                    EquipmentOrder_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false),
                    Employee_ID = table.Column<int>(type: "int", nullable: false),
                    Quantity_Bought = table.Column<int>(type: "int", maxLength: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentOrder_CapturedEntity", x => new { x.EquipmentOrder_ID, x.Equipment_ID });
                    table.ForeignKey(
                        name: "FK_EquipmentOrder_CapturedEntity_Employees_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "Employees",
                        principalColumn: "Employee_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipmentOrder_CapturedEntity_EquipmentOrders_EquipmentOrder_ID",
                        column: x => x.EquipmentOrder_ID,
                        principalTable: "EquipmentOrders",
                        principalColumn: "EquipmentOrder_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EquipmentOrder_CapturedEntity_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingCartEquipment",
                columns: table => new
                {
                    ShoppingCart_ID = table.Column<int>(type: "int", nullable: false),
                    Equipment_ID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingCartEquipment", x => new { x.Equipment_ID, x.ShoppingCart_ID });
                    table.ForeignKey(
                        name: "FK_ShoppingCartEquipment_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ShoppingCartEquipment_ShoppingCart_ShoppingCart_ID",
                        column: x => x.ShoppingCart_ID,
                        principalTable: "ShoppingCart",
                        principalColumn: "ShoppingCart_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WalkinsaleEquipment",
                columns: table => new
                {
                    Equipment_ID = table.Column<int>(type: "int", nullable: false),
                    WalkInSale_ID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalkinsaleEquipment", x => new { x.Equipment_ID, x.WalkInSale_ID });
                    table.ForeignKey(
                        name: "FK_WalkinsaleEquipment_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WalkinsaleEquipment_WalkInSales_WalkInSale_ID",
                        column: x => x.WalkInSale_ID,
                        principalTable: "WalkInSales",
                        principalColumn: "WalkInSale_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WalkInSaleEquipmentLink",
                columns: table => new
                {
                    WalkInSale_ID = table.Column<int>(type: "int", nullable: false),
                    Equipment_ID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalkInSaleEquipmentLink", x => new { x.WalkInSale_ID, x.Equipment_ID });
                    table.ForeignKey(
                        name: "FK_WalkInSaleEquipmentLink_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WalkInSaleEquipmentLink_WalkInSales_WalkInSale_ID",
                        column: x => x.WalkInSale_ID,
                        principalTable: "WalkInSales",
                        principalColumn: "WalkInSale_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Book_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity_On_Hand = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ISBN = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Book_ID);
                    table.ForeignKey(
                        name: "FK_Books_PrescribedBook_ISBN",
                        column: x => x.ISBN,
                        principalTable: "PrescribedBook",
                        principalColumn: "ISBN",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ResellerBook",
                columns: table => new
                {
                    Reseller_Book_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Estimated_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageFront = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageBack = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageBinder = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageOpen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Student_ID = table.Column<int>(type: "int", nullable: false),
                    ISBN = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Reseller_Book_Status_ID = table.Column<int>(type: "int", nullable: false),
                    Booking_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResellerBook", x => x.Reseller_Book_ID);
                    table.ForeignKey(
                        name: "FK_ResellerBook_Bookings_Booking_ID",
                        column: x => x.Booking_ID,
                        principalTable: "Bookings",
                        principalColumn: "Booking_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResellerBook_PrescribedBook_ISBN",
                        column: x => x.ISBN,
                        principalTable: "PrescribedBook",
                        principalColumn: "ISBN",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResellerBook_ResellerBookStatus_Reseller_Book_Status_ID",
                        column: x => x.Reseller_Book_Status_ID,
                        principalTable: "ResellerBookStatus",
                        principalColumn: "Reseller_Book_Status_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResellerBook_Students_Student_ID",
                        column: x => x.Student_ID,
                        principalTable: "Students",
                        principalColumn: "Student_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ResaleLog",
                columns: table => new
                {
                    ResaleLog_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Amount_Exchanged = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Evaluation_Book_Log_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResaleLog", x => x.ResaleLog_ID);
                    table.ForeignKey(
                        name: "FK_ResaleLog_EvalautionBookLog_Evaluation_Book_Log_ID",
                        column: x => x.Evaluation_Book_Log_ID,
                        principalTable: "EvalautionBookLog",
                        principalColumn: "Evaluation_Book_Log_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderLine",
                columns: table => new
                {
                    Item_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Order_ID = table.Column<int>(type: "int", nullable: true),
                    ItemName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Equipment_ID = table.Column<int>(type: "int", nullable: true),
                    Book_ID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderLine", x => x.Item_ID);
                    table.ForeignKey(
                        name: "FK_OrderLine_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderLine_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderLine_Orders_Order_ID",
                        column: x => x.Order_ID,
                        principalTable: "Orders",
                        principalColumn: "Order_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Prices",
                columns: table => new
                {
                    Price_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Equipment_ID = table.Column<int>(type: "int", nullable: true),
                    Book_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prices", x => x.Price_ID);
                    table.ForeignKey(
                        name: "FK_Prices_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Prices_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingCartBook",
                columns: table => new
                {
                    Book_ID = table.Column<int>(type: "int", nullable: false),
                    ShoppingCart_ID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingCartBook", x => new { x.Book_ID, x.ShoppingCart_ID });
                    table.ForeignKey(
                        name: "FK_ShoppingCartBook_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ShoppingCartBook_ShoppingCart_ShoppingCart_ID",
                        column: x => x.ShoppingCart_ID,
                        principalTable: "ShoppingCart",
                        principalColumn: "ShoppingCart_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StockTakeLine",
                columns: table => new
                {
                    StockTake_ID = table.Column<int>(type: "int", nullable: false),
                    Book_ID = table.Column<int>(type: "int", nullable: true),
                    Equipment_ID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTakeLine", x => x.StockTake_ID);
                    table.ForeignKey(
                        name: "FK_StockTakeLine_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockTakeLine_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockTakeLine_StockTake_StockTake_ID",
                        column: x => x.StockTake_ID,
                        principalTable: "StockTake",
                        principalColumn: "StockTake_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WalkInSaleBookLink",
                columns: table => new
                {
                    WalkInSale_ID = table.Column<int>(type: "int", nullable: false),
                    Book_ID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalkInSaleBookLink", x => new { x.WalkInSale_ID, x.Book_ID });
                    table.ForeignKey(
                        name: "FK_WalkInSaleBookLink_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WalkInSaleBookLink_WalkInSales_WalkInSale_ID",
                        column: x => x.WalkInSale_ID,
                        principalTable: "WalkInSales",
                        principalColumn: "WalkInSale_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WriteOffLine",
                columns: table => new
                {
                    Write_Off_ID = table.Column<int>(type: "int", maxLength: 5, nullable: false),
                    Equipment_ID = table.Column<int>(type: "int", nullable: true),
                    Book_ID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WriteOffLine", x => x.Write_Off_ID);
                    table.ForeignKey(
                        name: "FK_WriteOffLine_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WriteOffLine_Equipments_Equipment_ID",
                        column: x => x.Equipment_ID,
                        principalTable: "Equipments",
                        principalColumn: "Equipment_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WriteOffLine_WriteOff_Write_Off_ID",
                        column: x => x.Write_Off_ID,
                        principalTable: "WriteOff",
                        principalColumn: "Write_Off_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "walkinsalebooks",
                columns: table => new
                {
                    Book_ID = table.Column<int>(type: "int", nullable: false),
                    WalkInSale_ID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WalkInSaleBookLinkBook_ID = table.Column<int>(type: "int", nullable: true),
                    WalkInSaleBookLinkWalkInSale_ID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_walkinsalebooks", x => new { x.Book_ID, x.WalkInSale_ID });
                    table.ForeignKey(
                        name: "FK_walkinsalebooks_Books_Book_ID",
                        column: x => x.Book_ID,
                        principalTable: "Books",
                        principalColumn: "Book_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_walkinsalebooks_WalkInSaleBookLink_WalkInSaleBookLinkWalkInSale_ID_WalkInSaleBookLinkBook_ID",
                        columns: x => new { x.WalkInSaleBookLinkWalkInSale_ID, x.WalkInSaleBookLinkBook_ID },
                        principalTable: "WalkInSaleBookLink",
                        principalColumns: new[] { "WalkInSale_ID", "Book_ID" });
                    table.ForeignKey(
                        name: "FK_walkinsalebooks_WalkInSales_WalkInSale_ID",
                        column: x => x.WalkInSale_ID,
                        principalTable: "WalkInSales",
                        principalColumn: "WalkInSale_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AuditEntryTypes",
                columns: new[] { "Audit_Entry_Type_ID", "UserAction" },
                values: new object[,]
                {
                    { 1, "BackUpSystemData" },
                    { 2, "RestoreSystemData" },
                    { 3, "UpdateVAT" },
                    { 4, "ViewVAT" },
                    { 5, "AddUserRole" },
                    { 6, "UpdateUserRole" },
                    { 7, "DeleteUserRole" },
                    { 8, "AddHelpTip" },
                    { 9, "UpdateHelpTip" },
                    { 10, "DeleteHelpTip" },
                    { 11, "SendNewsletter" },
                    { 12, "PerformStockTake" },
                    { 13, "WriteOffInventory" },
                    { 14, "ViewAuditTrail" },
                    { 15, "UploadPrescribedBookList" },
                    { 16, "AddPrescribedBook" },
                    { 17, "AddBook" },
                    { 18, "UpdateBook" },
                    { 19, "DeleteBook" },
                    { 20, "AddModule" },
                    { 21, "UpdateModule" },
                    { 22, "DeleteModule" },
                    { 23, "AddFaculty" },
                    { 24, "UpdateFaculty" },
                    { 25, "DeleteFaculty" },
                    { 26, "AddDepartment" },
                    { 27, "UpdateDepartment" },
                    { 28, "DeleteDepartment" },
                    { 29, "AddEvaluationSchedule" },
                    { 30, "UpdateEvaluationSchedule" },
                    { 31, "RemoveEvaluationSchedule" },
                    { 32, "EvaluationScheduleSummary" },
                    { 33, "GenerateBookVoucher" },
                    { 34, "UpdateBookVoucher" },
                    { 35, "DeleteBookVoucher" },
                    { 36, "AddEmployee" },
                    { 37, "UpdateEmployee" },
                    { 38, "DeleteEmployee" },
                    { 39, "AddEmployeeType" },
                    { 40, "UpdateEmployeeType" },
                    { 41, "DeleteEmployeeType" },
                    { 42, "AddEquipment" }
                });

            migrationBuilder.InsertData(
                table: "AuditEntryTypes",
                columns: new[] { "Audit_Entry_Type_ID", "UserAction" },
                values: new object[,]
                {
                    { 43, "UpdateEquipment" },
                    { 44, "DeleteEquipment" },
                    { 45, "AddEquipmentType" },
                    { 46, "UpdateEquipmentType" },
                    { 47, "DeleteEquipmentType" },
                    { 48, "CaptureEquipment" },
                    { 49, "AddStudent" },
                    { 50, "UpdateStudent" },
                    { 51, "DeleteStudent" },
                    { 52, "WalkInSalesReport" },
                    { 53, "BookInventoryReport" },
                    { 54, "LabEquipmentInventoryReport" },
                    { 55, "OnlineOrdersReport" },
                    { 56, "ResellersReport" },
                    { 57, "AuditTrailReport" },
                    { 58, "AddSupplier" },
                    { 59, "UpdateSupplier" },
                    { 60, "DeleteSupplier" },
                    { 61, "DownloadNewsletterFile" },
                    { 62, "LoggedIn" },
                    { 63, "LoggedOut" },
                    { 64, "ProcessOrder" },
                    { 65, "LogCollection" },
                    { 66, "MakeSale" },
                    { 67, "GenerateSalesSummary" },
                    { 68, "EvaluatedBook" },
                    { 69, "LoggedResaleExchange" },
                    { 70, "UpdateResellerPercent" },
                    { 71, "CapturedSale" }
                });

            migrationBuilder.InsertData(
                table: "OrderStatus",
                columns: new[] { "Order_Status_ID", "Description", "StatusName" },
                values: new object[,]
                {
                    { 1, "Order is being prepared ", "Order placed" },
                    { 2, "Order is ready for collection", "Ready for collection" },
                    { 3, "Order cycle completed", "Order collected" }
                });

            migrationBuilder.InsertData(
                table: "PaymentType",
                columns: new[] { "PaymentType_ID", "Description", "PaymentType_Name" },
                values: new object[,]
                {
                    { 1, "Payment via Card", "Card" },
                    { 2, "Payment via Cash", "Cash" }
                });

            migrationBuilder.InsertData(
                table: "ResellerBookStatus",
                columns: new[] { "Reseller_Book_Status_ID", "Description", "StatusName" },
                values: new object[,]
                {
                    { 1, "Book evaluation", "Waiting for booking" },
                    { 2, "Book booked for evalaution", "Booked for evaluation" },
                    { 3, "", "Evalaution Completed" }
                });

            migrationBuilder.InsertData(
                table: "VATs",
                columns: new[] { "VAT_ID", "Percent" },
                values: new object[] { 1, 15.00m });

            migrationBuilder.InsertData(
                table: "resalePercent",
                columns: new[] { "Percent_Id", "Percent_Value" },
                values: new object[] { 1, 2.00m });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AuditTrails_Audit_Entry_Type_ID",
                table: "AuditTrails",
                column: "Audit_Entry_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_AuditTrails_Employee_ID",
                table: "AuditTrails",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Schedule_ID",
                table: "Bookings",
                column: "Schedule_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Books_ISBN",
                table: "Books",
                column: "ISBN");

            migrationBuilder.CreateIndex(
                name: "IX_ChangeRequests_Employee_ID",
                table: "ChangeRequests",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ChangeRequests_Student_ID",
                table: "ChangeRequests",
                column: "Student_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Faculty_ID",
                table: "Departments",
                column: "Faculty_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Employee_Type_ID",
                table: "Employees",
                column: "Employee_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_User_ID",
                table: "Employees",
                column: "User_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentOrder_CapturedEntity_Employee_ID",
                table: "EquipmentOrder_CapturedEntity",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentOrder_CapturedEntity_Equipment_ID",
                table: "EquipmentOrder_CapturedEntity",
                column: "Equipment_ID");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentOrders_Supplier_ID",
                table: "EquipmentOrders",
                column: "Supplier_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_EquipmentType_ID",
                table: "Equipments",
                column: "EquipmentType_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_Module_ID",
                table: "Equipments",
                column: "Module_ID");

            migrationBuilder.CreateIndex(
                name: "IX_EvalautionBookLog_Booking_ID",
                table: "EvalautionBookLog",
                column: "Booking_ID",
                unique: true,
                filter: "[Booking_ID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_EvalautionBookLog_Student_ID",
                table: "EvalautionBookLog",
                column: "Student_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Help_Employee_ID",
                table: "Help",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Modules_Department_ID",
                table: "Modules",
                column: "Department_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Newsletters_Employee_ID",
                table: "Newsletters",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLine_Book_ID",
                table: "OrderLine",
                column: "Book_ID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLine_Equipment_ID",
                table: "OrderLine",
                column: "Equipment_ID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLine_Order_ID",
                table: "OrderLine",
                column: "Order_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Order_Status_ID",
                table: "Orders",
                column: "Order_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Student_ID",
                table: "Orders",
                column: "Student_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Voucher_ID",
                table: "Orders",
                column: "Voucher_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PrescribedBook_Module_ID",
                table: "PrescribedBook",
                column: "Module_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PrescribedBook_Prescribed_Book_List_ID",
                table: "PrescribedBook",
                column: "Prescribed_Book_List_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Prices_Book_ID",
                table: "Prices",
                column: "Book_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Prices_Equipment_ID",
                table: "Prices",
                column: "Equipment_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ResaleLog_Evaluation_Book_Log_ID",
                table: "ResaleLog",
                column: "Evaluation_Book_Log_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ResellerBook_Booking_ID",
                table: "ResellerBook",
                column: "Booking_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ResellerBook_ISBN",
                table: "ResellerBook",
                column: "ISBN");

            migrationBuilder.CreateIndex(
                name: "IX_ResellerBook_Reseller_Book_Status_ID",
                table: "ResellerBook",
                column: "Reseller_Book_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ResellerBook_Student_ID",
                table: "ResellerBook",
                column: "Student_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_Employee_ID",
                table: "Schedules",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCart_StudentID",
                table: "ShoppingCart",
                column: "StudentID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCartBook_ShoppingCart_ID",
                table: "ShoppingCartBook",
                column: "ShoppingCart_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCartEquipment_ShoppingCart_ID",
                table: "ShoppingCartEquipment",
                column: "ShoppingCart_ID");

            migrationBuilder.CreateIndex(
                name: "IX_StockTake_Employee_ID",
                table: "StockTake",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_StockTakeLine_Book_ID",
                table: "StockTakeLine",
                column: "Book_ID");

            migrationBuilder.CreateIndex(
                name: "IX_StockTakeLine_Equipment_ID",
                table: "StockTakeLine",
                column: "Equipment_ID");

            migrationBuilder.CreateIndex(
                name: "IX_StudentNewsletter_Newsletter_ID",
                table: "StudentNewsletter",
                column: "Newsletter_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Students_User_ID",
                table: "Students",
                column: "User_ID",
                unique: true,
                filter: "[User_ID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_WalkInSaleBookLink_Book_ID",
                table: "WalkInSaleBookLink",
                column: "Book_ID");

            migrationBuilder.CreateIndex(
                name: "IX_walkinsalebooks_WalkInSale_ID",
                table: "walkinsalebooks",
                column: "WalkInSale_ID");

            migrationBuilder.CreateIndex(
                name: "IX_walkinsalebooks_WalkInSaleBookLinkWalkInSale_ID_WalkInSaleBookLinkBook_ID",
                table: "walkinsalebooks",
                columns: new[] { "WalkInSaleBookLinkWalkInSale_ID", "WalkInSaleBookLinkBook_ID" });

            migrationBuilder.CreateIndex(
                name: "IX_WalkinsaleEquipment_WalkInSale_ID",
                table: "WalkinsaleEquipment",
                column: "WalkInSale_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WalkInSaleEquipmentLink_Equipment_ID",
                table: "WalkInSaleEquipmentLink",
                column: "Equipment_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WalkInSales_Employee_ID",
                table: "WalkInSales",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WalkInSales_PaymentType_ID",
                table: "WalkInSales",
                column: "PaymentType_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WalkInSales_Student_ID",
                table: "WalkInSales",
                column: "Student_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WalkInSales_Voucher_ID",
                table: "WalkInSales",
                column: "Voucher_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WriteOff_Employee_ID",
                table: "WriteOff",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WriteOffLine_Book_ID",
                table: "WriteOffLine",
                column: "Book_ID");

            migrationBuilder.CreateIndex(
                name: "IX_WriteOffLine_Equipment_ID",
                table: "WriteOffLine",
                column: "Equipment_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AuditTrails");

            migrationBuilder.DropTable(
                name: "ChangeRequests");

            migrationBuilder.DropTable(
                name: "EquipmentOrder_CapturedEntity");

            migrationBuilder.DropTable(
                name: "Help");

            migrationBuilder.DropTable(
                name: "OrderLine");

            migrationBuilder.DropTable(
                name: "Prices");

            migrationBuilder.DropTable(
                name: "ResaleLog");

            migrationBuilder.DropTable(
                name: "resalePercent");

            migrationBuilder.DropTable(
                name: "ResellerBook");

            migrationBuilder.DropTable(
                name: "ShoppingCartBook");

            migrationBuilder.DropTable(
                name: "ShoppingCartEquipment");

            migrationBuilder.DropTable(
                name: "StockTakeLine");

            migrationBuilder.DropTable(
                name: "StudentNewsletter");

            migrationBuilder.DropTable(
                name: "VATs");

            migrationBuilder.DropTable(
                name: "walkinsalebooks");

            migrationBuilder.DropTable(
                name: "WalkinsaleEquipment");

            migrationBuilder.DropTable(
                name: "WalkInSaleEquipmentLink");

            migrationBuilder.DropTable(
                name: "WriteOffLine");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AuditEntryTypes");

            migrationBuilder.DropTable(
                name: "EquipmentOrders");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "EvalautionBookLog");

            migrationBuilder.DropTable(
                name: "ResellerBookStatus");

            migrationBuilder.DropTable(
                name: "ShoppingCart");

            migrationBuilder.DropTable(
                name: "StockTake");

            migrationBuilder.DropTable(
                name: "Newsletters");

            migrationBuilder.DropTable(
                name: "WalkInSaleBookLink");

            migrationBuilder.DropTable(
                name: "Equipments");

            migrationBuilder.DropTable(
                name: "WriteOff");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "OrderStatus");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropTable(
                name: "WalkInSales");

            migrationBuilder.DropTable(
                name: "EquipmentType");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "PrescribedBook");

            migrationBuilder.DropTable(
                name: "PaymentType");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "PrescribedBookList");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "EmployeeTypes");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Faculties");
        }
    }
}
