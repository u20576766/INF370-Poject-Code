using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Reflection.Emit;
using System.Diagnostics;
using System.IO.Pipelines;
using System.Reflection;
using System;
using System.ComponentModel.DataAnnotations;
using Org.BouncyCastle.Utilities.Collections;
using System.Data;
using Microsoft.EntityFrameworkCore.Metadata;
using UniBooks_Backend.ViewModels;
using MailKit.Search;
using System.Security.Cryptography.X509Certificates;
using UniBooks_Backend.Model;

namespace UniBooks_Backend.Models
{
    public class AppDbContext:IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions <AppDbContext> options) : base(options) { }
        
      


        //Lungelo//
        public DbSet<Book_Inventory> Books { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Order_Status> OrderStatus { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ShoppingCart> ShoppingCart { get; set; }
        public DbSet<ShoppingCart_Book> ShoppingCartBook { get; set; }
        public DbSet<ShoppingCart_Equipment> ShoppingCartEquipment { get; set; }
        public DbSet<Order_Line> OrderLine { get; set; }
        public DbSet<Equipment_Type> EquipmentType { get; set; }
        public DbSet<ChangeRequest> ChangeRequests { get; set; }

        //Mmapula//
        public DbSet<EquipmentOrder_Captured> EquipmentOrder_CapturedEntity { get; set; }
        public DbSet<Reseller_Book> ResellerBook { get; set; }
        public DbSet<Reseller_Book_Status> ResellerBookStatus { get; set; }
        public DbSet<Evalaution_Book_Log> EvalautionBookLog { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Resale_Log> ResaleLog { get; set; }
        public DbSet<WalkInSale> WalkInSales { get; set; }
        public DbSet<Payment_Type> PaymentType { get; set; }
        public DbSet<WalkInSaleBooks> walkinsalebooks { get; set; }
        public DbSet<WalkInSalesEquipment> WalkinsaleEquipment { get; set; }
        public List<WalkInSaleBookLink> WalkInSaleBooksLinks { get; set; }
        public List<WalkInSaleEquipmentLink> WalkInSalesEquipment { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<ResalePercent> resalePercent { get; set; }


        //Wisani
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Audit_Entry_Type> AuditEntryTypes { get; set; }
        public DbSet<Audit_Trail> AuditTrails { get; set; }
        public DbSet<Employee_Type> EmployeeTypes { get; set; }
        public DbSet<Newsletter> Newsletters { get; set; }
        public DbSet<Help> Help { get; set; }
        public DbSet<Student_Newsletter> StudentNewsletter { get; set; }
        public DbSet<Student> Students { get; set; }
      
        public DbSet<Voucher> Vouchers { get; set; }

        //--------------------\\



        //Unchanged
        public DbSet<Department> Departments { get; set; }
        public DbSet<Employee> Employees { get; set; }
       
        public DbSet<EquipmentOrder> EquipmentOrders { get; set; }

        public DbSet<Faculty> Faculties { get; set; }

        public DbSet<Module> Modules { get; set; }

        public DbSet<Prescribed_Book> PrescribedBook { get; set; }
        public DbSet<Prescribed_Book_List> PrescribedBookList { get; set; }
        public DbSet<Price> Prices { get; set; }

        public DbSet<Stock_Take> StockTake { get; set; }
        public DbSet<Stock_Take_Line> StockTakeLine { get; set; }

        public DbSet<VAT> VATs { get; set; }

        public DbSet<Write_Off> WriteOff { get; set; }
        public DbSet<Write_Off_Line> WriteOffLine { get; set; }
      
       
       

      
     

      
       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            //Lungelo//

            // Change Requests - Student Relationship
            modelBuilder.Entity<ChangeRequest>()
                .HasOne(cr => cr.Students)
                .WithMany(s => s.ChangeRequests)
                .HasForeignKey(cr => cr.Student_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Change Requests - Employees Relationship
            modelBuilder.Entity<ChangeRequest>()
                .HasOne(cr => cr.Employees)
                .WithMany(e => e.ChangeRequests)
                .HasForeignKey(cr => cr.Employee_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Order Line
            modelBuilder.Entity<Order_Line>()
                .HasKey(u => new { u.Item_ID });

            modelBuilder.Entity<Order_Line>()
                .HasOne(k => k.Orders)
                .WithMany(o => o.OrderLine)
                .HasForeignKey(u => u.Order_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order_Line>()
                .HasOne(u => u.Book_Inventory)
                .WithMany(o => o.OrderLine)
                .HasForeignKey(i => i.Book_ID)
                .OnDelete(DeleteBehavior.Restrict); // Set to DeleteBehavior.SetNull

            modelBuilder.Entity<Order_Line>()
                .HasOne(u => u.Equipment)
                .WithMany(o => o.OrderLine)
                .HasForeignKey(i => i.Equipment_ID)
                .OnDelete(DeleteBehavior.Restrict);


            //Shopping Cart 
            modelBuilder.Entity<ShoppingCart>()
                .HasOne(s => s.Student)
                .WithOne(s => s.ShoppingCart)
                .HasForeignKey<ShoppingCart>(sc => sc.StudentID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);


            // Shopping Cart Equipment
            modelBuilder.Entity<ShoppingCart_Equipment>()
                .HasKey(o => new { o.Equipment_ID, o.ShoppingCart_ID });

            modelBuilder.Entity<ShoppingCart_Equipment>()
                .HasOne(i => i.ShoppingCart)
                .WithMany(o => o.ShoppingCartEquipment)
                .HasForeignKey(f => f.ShoppingCart_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ShoppingCart_Equipment>()
                .HasOne(k => k.Equipments)
                .WithMany(p => p.ShoppingCartEquipment)
                .HasForeignKey(o => o.Equipment_ID)
                .OnDelete(DeleteBehavior.Restrict);


            // Shopping Cart Book
            modelBuilder.Entity<ShoppingCart_Book>()
                .HasKey(o => new { o.Book_ID, o.ShoppingCart_ID });

            modelBuilder.Entity<ShoppingCart_Book>()
                .HasOne(k => k.Books)
                .WithMany(L => L.ShoppingCartBook)
                .HasForeignKey(p => p.Book_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ShoppingCart_Book>()
                .HasOne(o => o.ShoppingCart)
                .WithMany(p => p.ShoppingCartBook)
                .HasForeignKey(o => o.ShoppingCart_ID)
                .OnDelete(DeleteBehavior.Restrict);


            // Order and Voucher
            modelBuilder.Entity<Order>()
                .HasOne(j => j.Vouchers)
                .WithMany(i => i.Orders)
                .HasForeignKey(i => i.Voucher_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Order Status and Order
            modelBuilder.Entity<Order>()
                .HasOne(j => j.OrderStatus)
                .WithMany(i => i.Orders)
                .HasForeignKey(i => i.Order_Status_ID)
                .OnDelete(DeleteBehavior.Restrict);

            //ORDER AND STUDENT 
            modelBuilder.Entity<Order>()
        .HasOne(o => o.Students)
        .WithMany(s => s.Orders)
        .HasForeignKey(o => o.Student_ID)
        .OnDelete(DeleteBehavior.Restrict);

            //----------------\\

            //Mmapula
            modelBuilder.Entity<ResalePercent>()
                .HasData(new
                {
                    Percent_Id = 1,
                    Percent_Value = 2.00m
                });

            modelBuilder.Entity<EquipmentOrder_Captured>()
    .HasOne(eoc => eoc.Employees)              // EquipmentOrder_Captured references Employee
    .WithMany(emp => emp.EquipmentOrder_CapturedEntity) // Employee has a collection of EquipmentOrder_Captured
    .HasForeignKey(eoc => eoc.Employee_ID);    // The foreign key property



            //walkinsalelinks
            modelBuilder.Entity<WalkInSaleBookLink>()
    .HasKey(sc => new { sc.WalkInSale_ID, sc.Book_ID });

            modelBuilder.Entity<WalkInSaleEquipmentLink>()
                .HasKey(sc => new { sc.WalkInSale_ID, sc.Equipment_ID });

            // Configure relationships
            modelBuilder.Entity<WalkInSaleBookLink>()
                .HasOne(sc => sc.WalkInSale)
                .WithMany(s => s.WalkInSaleBooksLink)
                .HasForeignKey(sc => sc.WalkInSale_ID);

            modelBuilder.Entity<WalkInSaleBookLink>()
                .HasOne(sc => sc.Book)
                .WithMany(s => s.WalkInSalesBooksLink)
                .HasForeignKey(sc => sc.Book_ID);

            modelBuilder.Entity<WalkInSaleEquipmentLink>()
                .HasOne(sc => sc.WalkInSale)
                .WithMany(s => s.WalkInSaleEquipmentLink)
                .HasForeignKey(sc => sc.WalkInSale_ID);

            modelBuilder.Entity<WalkInSaleEquipmentLink>()
                .HasOne(sc => sc.Equipment)
                .WithMany(s => s.WalkInSaleEquipmentLink)
                .HasForeignKey(sc => sc.Equipment_ID);


            //walkin
            modelBuilder.Entity<WalkInSalesEquipment>()
                .HasKey(sc => new { sc.Equipment_ID, sc.WalkInSale_ID });
            modelBuilder.Entity<WalkInSaleBooks>()
                .HasKey(k => new { k.Book_ID, k.WalkInSale_ID });

            modelBuilder.Entity<WalkInSalesEquipment>()
               .HasOne(k => k.Equipments)
               .WithMany(L => L.Walkinsaleequipment)
               .HasForeignKey(K => K.Equipment_ID)
               .IsRequired(true)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WalkInSalesEquipment>()
                .HasOne(k => k.Walkinsale)
                .WithMany(L => L.walkinsaleequipment)
                .HasForeignKey(K => K.WalkInSale_ID);
            modelBuilder.Entity<WalkInSaleBooks>()
               .HasOne(k => k.Walkinsale)
               .WithMany(L => L.walkinsalebooks)
               .HasForeignKey(K => K.WalkInSale_ID);

            modelBuilder.Entity<WalkInSaleBooks>()
             .HasOne(k => k.Books)
             .WithMany(L => L.Walkinsalesbooks)
             .HasForeignKey(K => K.Book_ID)
             .IsRequired(true)
             .OnDelete(DeleteBehavior.Restrict);


            //payment type and walkinsale 
            modelBuilder.Entity<WalkInSale>()
                .HasOne(j => j.PaymentType)
                .WithMany(i => i.WalkInSales)
                .HasForeignKey(i => i.PaymentType_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WalkInSale>()
               .HasOne(j => j.Employees)
               .WithMany(i => i.WalkInSales)
               .HasForeignKey(i => i.Employee_ID)
               .OnDelete(DeleteBehavior.Restrict);


            //walkinsale and voucher 
            modelBuilder.Entity<WalkInSale>()
                .HasOne(j => j.Vouchers)
                .WithMany(i => i.WalkInSales)
                .HasForeignKey(i => i.Voucher_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            //walkinsale and student 
            modelBuilder.Entity<WalkInSale>()
                .HasOne(j => j.Students)
                .WithMany(i => i.WalkInSales)
                .HasForeignKey(i => i.Student_ID)
                .OnDelete(DeleteBehavior.Restrict);

            //booking and evaluation 
            modelBuilder.Entity<Evalaution_Book_Log>()
             .HasOne(e => e.Students)  // The lambda should be correct
             .WithMany(s => s.EvalautionBookLogs)  // The lambda should be correct
              .HasForeignKey(e => e.Student_ID)
              .IsRequired(false);


            modelBuilder.Entity<Evalaution_Book_Log>()
             .HasOne(e => e.Bookings)
             .WithOne(s => s.EvaluationBookLog)
             .HasForeignKey<Evalaution_Book_Log>(B => B.Booking_ID)
             .IsRequired(false);

            //booking and reseller book
            modelBuilder.Entity<Booking>()
         .HasMany(booking => booking.ResellerBook)
         .WithOne(resellerBook => resellerBook.Bookings)
         .HasForeignKey(resellerBook => resellerBook.Booking_ID)
         .OnDelete(DeleteBehavior.Restrict);



            //booking and schedule 
            modelBuilder.Entity<Booking>()
                .HasOne(k => k.Schedules)
                .WithMany(u => u.Bookings)
                .HasForeignKey(u => u.Schedule_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Link between Schedule and Employee
            modelBuilder.Entity<Schedule>()
                .HasOne(o => o.Employees)
                .WithMany(i => i.Schedules)
                .HasForeignKey(o => o.Employee_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Resale Log and Evaluation
            modelBuilder.Entity<Resale_Log>()
               .HasOne(resale => resale.EvalautionBookLog) // Resale_Log has one Evalaution_Book_Log
               .WithOne(evaluation => evaluation.ResaleLog) // Evalaution_Book_Log has one Resale_Log
               .HasForeignKey<Resale_Log>(resale => resale.Evaluation_Book_Log_ID); // Foreign key property in Resale_Log


            // Link between Reseller and Prescribed Book
            modelBuilder.Entity<Reseller_Book>()
                .HasOne(k => k.PrescribedBook)
                .WithMany(i => i.ResellerBook)
                .HasForeignKey(k => k.ISBN)
                .OnDelete(DeleteBehavior.Restrict);

            // Link to Reseller Status and Reseller Book
            modelBuilder.Entity<Reseller_Book>()
                .HasOne(k => k.ResellerBookStatus)
                .WithMany(l => l.ResellerBook)
                .HasForeignKey(i => i.Reseller_Book_Status_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Reseller Book link to Student
            modelBuilder.Entity<Reseller_Book>()
                .HasOne(k => k.Students)
                .WithMany(k => k.ResellerBook)
                .HasForeignKey(l => l.Student_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Define the relationship between EquipmentOrder_Captured and Equipment
            modelBuilder.Entity<EquipmentOrder_Captured>()
                .HasOne(ec => ec.Equipments)
                .WithMany(e => e.EquipmentOrder_CapturedEntity)
                .HasForeignKey(ec => ec.Equipment_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Define the relationship between EquipmentOrder_Captured and EquipmentOrder
            modelBuilder.Entity<EquipmentOrder_Captured>()
                .HasKey(ec => new { ec.EquipmentOrder_ID, ec.Equipment_ID }); // Define composite primary key

            modelBuilder.Entity<EquipmentOrder_Captured>()
                .HasOne(ec => ec.EquipmentOrders)
                .WithMany(eo => eo.EquipmentOrder_CapturedEntity)
                .HasForeignKey(ec => ec.EquipmentOrder_ID)
                .OnDelete(DeleteBehavior.Restrict);

            //----------\\


            //Wisani

            //AUDIT TRAILS 
            modelBuilder.Entity<Audit_Trail>()
               .HasOne(o => o.AuditEntryTypes)
               .WithMany(i => i.AuditTrail)
               .HasForeignKey(o => o.Audit_Entry_Type_ID)
               .IsRequired(true)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Audit_Trail>()
            .HasOne(k => k.Employees)
            .WithMany(i => i.AuditTrail)
            .HasForeignKey(k => k.Employee_ID)
            .IsRequired(true)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Audit_Entry_Type>()
                .HasKey(K => new { K.Audit_Entry_Type_ID });

            modelBuilder.Entity<Audit_Trail>()
                .HasKey(O => new { O.Audit_Trail_ID });

            //student and newsltters 
            modelBuilder.Entity<Student_Newsletter>()
             .HasKey(sn => new { sn.Student_ID, sn.Newsletter_ID });

            modelBuilder.Entity<Student_Newsletter>()
                .HasOne(sn => sn.Students)
                .WithMany(s => s.StudentNewsletter)
                .HasForeignKey(sn => sn.Student_ID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student_Newsletter>()
                .HasOne(sn => sn.Newsletters)
                .WithMany(n => n.StudentNewsletter)
                .HasForeignKey(sn => sn.Newsletter_ID)
                .OnDelete(DeleteBehavior.Cascade);


            //Employee generates many Newsletters
            modelBuilder.Entity<Newsletter>()
            .HasOne(i => i.Employees)
              .WithMany(k => k.Newsletters)
              .HasForeignKey(k => k.Employee_ID)
              .OnDelete(DeleteBehavior.Restrict);

            // Help and Employee
            modelBuilder.Entity<Help>()
                .HasOne(j => j.Employees)
                .WithMany(i => i.Help)
                .HasForeignKey(i => i.Employee_ID)
                .OnDelete(DeleteBehavior.Restrict);

            //user and student 
            modelBuilder.Entity<Student>()
                .HasOne(s => s.AppUsers)
                .WithOne(u => u.Students)
                .HasForeignKey<Student>(L => L.User_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            //employee and user
            modelBuilder.Entity<Employee>()
              .HasOne(i => i.AppUsers)
              .WithOne(i => i.Employees)
              .HasForeignKey<Employee>(i => i.User_ID)
               .OnDelete(DeleteBehavior.Restrict);



            //-----------------------\\




            modelBuilder.Entity<Student>()
           .Property(s => s.Timestamp)
           .IsConcurrencyToken();



            //pk
            modelBuilder.Entity<Book_Inventory>()
                .HasKey(k => new { k.Book_ID });

            modelBuilder.Entity<Department>()
                .HasKey(k => new { k.Department_ID });
            modelBuilder.Entity<Equipment>()
                .HasKey(o => new { o.Equipment_ID });
          

            
            //Write - Off
            modelBuilder.Entity<Write_Off>()
                .HasOne(u => u.Employees)
                .WithMany(k => k.WriteOff)
                .HasForeignKey(u => u.Employee_ID)
                .OnDelete(DeleteBehavior.Restrict);

            

            //write off 
            modelBuilder.Entity<Write_Off_Line>()
               .HasOne(i => i.Equipments)
               .WithMany(k => k.WriteOffLine)
               .HasForeignKey(i => i.Equipment_ID)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Write_Off_Line>()
                .HasOne(k => k.Books)
                .WithMany(s => s.WriteOffLine)
                .HasForeignKey(k => k.Book_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            //write off line and write off 
            modelBuilder.Entity<Write_Off_Line>()
               .HasOne(i => i.WriteOff)
               .WithMany(o => o.WriteOffLine)
               .HasForeignKey(i => i.Write_Off_ID)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Write_Off_Line>()
                .HasKey(i => new { i.Write_Off_ID });

            //write oof and employe
            //Write - Off
            modelBuilder.Entity<Write_Off>()
                .HasOne(u => u.Employees)
                .WithMany(k => k.WriteOff)
                .HasForeignKey(u => u.Employee_ID)
                .OnDelete(DeleteBehavior.Restrict);

            //stock take and employee 
            modelBuilder.Entity<Stock_Take>()
            .HasOne(u => u.Employees)
            .WithMany(k => k.StockTake)
            .HasForeignKey(u => u.Employee_ID)
            .OnDelete(DeleteBehavior.Restrict);



            //stocktakeline and books and equipment
            modelBuilder.Entity<Stock_Take_Line>()
               .HasOne(i => i.Equipments)
               .WithMany(k => k.StockTakeLine)
               .HasForeignKey(i => i.Equipment_ID)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Stock_Take_Line>()
                .HasOne(k => k.Books)
                .WithMany(s => s.StockTakeLine)
                .HasForeignKey(k => k.Book_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            //stock take line and stock take 
            modelBuilder.Entity<Stock_Take_Line>()
               .HasOne(i => i.StockTake)
               .WithMany(o => o.StockTakeLine)
               .HasForeignKey(i => i.StockTake_ID)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Stock_Take_Line>()
                .HasKey(i => new { i.StockTake_ID });

            

            

            

            // Employee Type has many Employees
            modelBuilder.Entity<Employee>()
                .HasOne(B => B.EmployeeType)
                .WithMany(B => B.Employees)
                .HasForeignKey(B => B.Employee_Type_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Modules has many Prescribed Books
            modelBuilder.Entity<Prescribed_Book>()
                .HasOne(K => K.Modules)
                .WithMany(a => a.PrescribedBook)
                .HasForeignKey(b => b.Module_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Link between Reseller and Prescribed Book
            modelBuilder.Entity<Reseller_Book>()
                .HasOne(k => k.PrescribedBook)
                .WithMany(i => i.ResellerBook)
                .HasForeignKey(k => k.ISBN)
                .OnDelete(DeleteBehavior.Restrict);
            // Books and Prescribed
            modelBuilder.Entity<Book_Inventory>()
                .HasOne(p => p.PrescribedBook)
                .WithMany(p => p.Books)
                .HasForeignKey(p => p.ISBN)
                .OnDelete(DeleteBehavior.Restrict);
            //VAT
            modelBuilder.Entity<VAT>()
                .HasData(
                new
                {
                    VAT_ID = 1,
                    Percent = 15.00m
                });

            // Equipment and Prices
            modelBuilder.Entity<Price>()
                .HasOne(o => o.Equipments)
                .WithMany(i => i.Prices)
                .HasForeignKey(o => o.Equipment_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // Books and Prices
            modelBuilder.Entity<Price>()
                .HasOne(o => o.Books)
                .WithMany(i => i.Prices)
                .HasForeignKey(o => o.Book_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            



            // EquipmentOrder and Supplier
            modelBuilder.Entity<EquipmentOrder>()
                .HasOne(eo => eo.Suppliers)
                .WithMany(s => s.EquipmentOrders)
                .HasForeignKey(eo => eo.Supplier_ID)
                .OnDelete(DeleteBehavior.Restrict);


            // Equipment and Module
            modelBuilder.Entity<Equipment>()
                .HasOne(K => K.Modules)
                .WithMany(o => o.Equipments)
                .HasForeignKey(o => o.Module_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Equipment and Equipment Type
            modelBuilder.Entity<Equipment>()
                .HasOne(i => i.Equipment_Types)
                .WithMany(i => i.Equipments)
                .HasForeignKey(o => o.EquipmentType_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Equipment and Prices
            modelBuilder.Entity<Price>()
                .HasOne(o => o.Equipments)
                .WithMany(i => i.Prices)
                .HasForeignKey(o => o.Equipment_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Faculties has many Departments
            modelBuilder.Entity<Department>()
                .HasOne(b => b.Faculties)
                .WithMany(a => a.Departments)
                .HasForeignKey(b => b.Faculty_ID)
                .OnDelete(DeleteBehavior.Restrict);

            // Departments has many Modules
            modelBuilder.Entity<Module>()
                .HasOne(b => b.Departments)
                .WithMany(a => a.Modules)
                .HasForeignKey(b => b.Department_ID)
                .OnDelete(DeleteBehavior.Restrict);


            //payment type 
            //Payment Type
            modelBuilder.Entity<Payment_Type>().HasData(
                new Payment_Type { PaymentType_ID = 1, PaymentType_Name = "Card", Description = "Payment via Card" },
                new Payment_Type { PaymentType_ID = 2, PaymentType_Name = "Cash", Description = "Payment via Cash" }
            );


            //Reseller _ Status 
            modelBuilder.Entity<Reseller_Book_Status>()
                .HasData(
                new
                {
                    Reseller_Book_Status_ID = 1,
                    StatusName = "Waiting for booking",
                    Description = "Book evaluation"

                });
            modelBuilder.Entity<Reseller_Book_Status>()
                .HasData(
                new
                {
                    Reseller_Book_Status_ID = 2,
                    StatusName = "Booked for evaluation",
                    Description = "Book booked for evalaution"

                });

            modelBuilder.Entity<Reseller_Book_Status>()
            .HasData(
            new
            {
                Reseller_Book_Status_ID = 3,
                StatusName = "Evalaution Completed",
                Description = ""

            });

            //order status
            modelBuilder.Entity<Order_Status>()
               .HasData(
               new
               {
                   Order_Status_ID = 1,
                   StatusName = "Order placed",
                   Description = "Order is being prepared "

               });
            modelBuilder.Entity<Order_Status>()
                .HasData(
                new
                {
                    Order_Status_ID = 2,
                    StatusName = "Ready for collection",
                    Description = "Order is ready for collection"

                });
            modelBuilder.Entity<Order_Status>()
                .HasData(
                new
                {
                    Order_Status_ID = 3,
                    StatusName = "Order collected",
                    Description = "Order cycle completed"

                });

            //---------------------------------------AUDIT ENTRY TYPE VALUES---------------------------------------------------//
            modelBuilder.Entity<Audit_Entry_Type>().HasData(
               new Audit_Entry_Type { Audit_Entry_Type_ID = 1, UserAction = "BackUpSystemData" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 2, UserAction = "RestoreSystemData" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 3, UserAction = "UpdateVAT" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 4, UserAction = "ViewVAT" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 5, UserAction = "AddUserRole" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 6, UserAction = "UpdateUserRole" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 7, UserAction = "DeleteUserRole" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 8, UserAction = "AddHelpTip" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 9, UserAction = "UpdateHelpTip" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 10, UserAction = "DeleteHelpTip" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 11, UserAction = "SendNewsletter" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 12, UserAction = "PerformStockTake" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 13, UserAction = "WriteOffInventory" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 14, UserAction = "ViewAuditTrail" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 15, UserAction = "UploadPrescribedBookList" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 16, UserAction = "AddPrescribedBook" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 17, UserAction = "AddBook" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 18, UserAction = "UpdateBook" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 19, UserAction = "DeleteBook" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 20, UserAction = "AddModule" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 21, UserAction = "UpdateModule" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 22, UserAction = "DeleteModule" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 23, UserAction = "AddFaculty" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 24, UserAction = "UpdateFaculty" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 25, UserAction = "DeleteFaculty" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 26, UserAction = "AddDepartment" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 27, UserAction = "UpdateDepartment" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 28, UserAction = "DeleteDepartment" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 29, UserAction = "AddEvaluationSchedule" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 30, UserAction = "UpdateEvaluationSchedule" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 31, UserAction = "RemoveEvaluationSchedule" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 32, UserAction = "EvaluationScheduleSummary" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 33, UserAction = "GenerateBookVoucher" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 34, UserAction = "UpdateBookVoucher" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 35, UserAction = "DeleteBookVoucher" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 36, UserAction = "AddEmployee" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 37, UserAction = "UpdateEmployee" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 38, UserAction = "DeleteEmployee" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 39, UserAction = "AddEmployeeType" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 40, UserAction = "UpdateEmployeeType" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 41, UserAction = "DeleteEmployeeType" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 42, UserAction = "AddEquipment" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 43, UserAction = "UpdateEquipment" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 44, UserAction = "DeleteEquipment" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 45, UserAction = "AddEquipmentType" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 46, UserAction = "UpdateEquipmentType" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 47, UserAction = "DeleteEquipmentType" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 48, UserAction = "CaptureEquipment" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 49, UserAction = "AddStudent" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 50, UserAction = "UpdateStudent" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 51, UserAction = "DeleteStudent" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 52, UserAction = "WalkInSalesReport" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 53, UserAction = "BookInventoryReport" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 54, UserAction = "LabEquipmentInventoryReport" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 55, UserAction = "OnlineOrdersReport" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 56, UserAction = "ResellersReport" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 57, UserAction = "AuditTrailReport" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 58, UserAction = "AddSupplier" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 59, UserAction = "UpdateSupplier" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 60, UserAction = "DeleteSupplier" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 61, UserAction = "DownloadNewsletterFile" },

               new Audit_Entry_Type { Audit_Entry_Type_ID = 62, UserAction = "LoggedIn" },
               new Audit_Entry_Type { Audit_Entry_Type_ID = 63, UserAction = "LoggedOut" },
                new Audit_Entry_Type { Audit_Entry_Type_ID = 64, UserAction = "ProcessOrder" },
                new Audit_Entry_Type { Audit_Entry_Type_ID = 65, UserAction = "LogCollection" },
                new Audit_Entry_Type { Audit_Entry_Type_ID = 66, UserAction = "MakeSale" },
                new Audit_Entry_Type { Audit_Entry_Type_ID = 67, UserAction = "GenerateSalesSummary" },


                    new Audit_Entry_Type { Audit_Entry_Type_ID = 68, UserAction = "EvaluatedBook" },
                        new Audit_Entry_Type { Audit_Entry_Type_ID = 69, UserAction = "LoggedResaleExchange" },
                            new Audit_Entry_Type { Audit_Entry_Type_ID = 70, UserAction = "UpdateResellerPercent" },
                            new Audit_Entry_Type { Audit_Entry_Type_ID =71 , UserAction ="CapturedSale"}


                 );
        }



    }
}
