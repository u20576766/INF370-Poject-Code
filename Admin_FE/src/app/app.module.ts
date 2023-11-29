import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { MaterialModule } from './shared/material.module';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SaleComponent } from './sale/sale.component';
import { InventoryComponent } from './inventory/inventory.component';
import { OrdersComponent } from './orders/orders.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { ResaleComponent } from './resale/resale.component';
import { EmployeesComponent } from './employees/employees.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudentsComponent } from './students/students.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { HelpTipsComponent } from './help-tips/help-tips.component';
import { ReportsComponent } from './reports/reports.component';
import { SupplierComponent } from './supplier/supplier.component';
import { VatComponent } from './vat/vat.component';
import { CloudComponent } from './cloud/cloud.component';
import { LabEquipmentComponent } from './inventory/lab-equipment/lab-equipment.component';
import { EquipmentTypeComponent } from './inventory/lab-equipment/equipment-type/equipment-type.component';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './supplier/update-supplier/update-supplier.component';
import { UpdateVatComponent } from './vat/update-vat/update-vat.component';
import { UpdateLabEquipmentComponent } from './inventory/lab-equipment/update-lab-equipment/update-lab-equipment.component';
import { AddLabEquipmentComponent } from './inventory/lab-equipment/add-lab-equipment/add-lab-equipment.component';
import { AddEquipmentTypeComponent } from './inventory/lab-equipment/equipment-type/add-equipment-type/add-equipment-type.component';
import { UpdateEquipmentTypeComponent } from './inventory/lab-equipment/equipment-type/update-equipment-type/update-equipment-type.component';
import { AddVoucherComponent } from './vouchers/add-voucher/add-voucher.component';
import { BooksComponent } from './inventory/books/books.component';
import { FacultyComponent } from './inventory/books/faculty/faculty.component';
import { DepartmentComponent } from './inventory/books/faculty/department/department.component';
import { ModuleComponent } from './inventory/books/faculty/module/module.component';
import { AddFacultyComponent } from './inventory/books/faculty/add-faculty/add-faculty.component';
import { UpdateFacultyComponent } from './inventory/books/faculty/update-faculty/update-faculty.component';
import { AddDepartmentComponent } from './inventory/books/faculty/department/add-department/add-department.component';
import { UpdateDepartmentComponent } from './inventory/books/faculty/department/update-department/update-department.component';
import { AddModuleComponent } from './inventory/books/faculty/module/add-module/add-module.component';
import { UpdateModuleComponent } from './inventory/books/faculty/module/update-module/update-module.component';
import { EmployeeTypeComponent } from './employees/employee-type/employee-type.component';
import { AddEmployeeComponent } from './employees/manage-employee/add-employee/add-employee.component';
import { AddEmployeeTypeComponent } from './employees/employee-type/add-employee-type/add-employee-type.component';
import { UpdateEmployeeTypeComponent } from './employees/employee-type/update-employee-type/update-employee-type.component';//
import { EditStudentComponent } from './students/edit-student/edit-student.component';
import { EditVoucherComponent } from './vouchers/edit-voucher/edit-voucher.component';
import { UpdateEmployeeComponent } from './employees/manage-employee/update-employee/update-employee.component';
import { ManageEmployeeComponent } from './employees/manage-employee/manage-employee.component';
import { PrescribedBookComponent } from './inventory/books/prescribed-book/prescribed-book.component';
import { PrescribedBookListComponent } from './inventory/books/prescribed-book/prescribed-book-list/prescribed-book-list.component';
import { CaptureEquipmentComponent } from './inventory/lab-equipment/capture-equipment/capture-equipment.component';
import { CaptureEquipComponent } from './inventory/lab-equipment/capture-equipment/capture-equip/capture-equip.component';
import { AddPresBookComponent } from './inventory/books/prescribed-book/add-pres-book/add-pres-book.component';
import { EditHelptipComponent } from './help-tips/edit-helptip/edit-helptip.component';
import { AddHelptipsComponent } from './help-tips/add-helptips/add-helptips.component';
import { StockTakeComponent } from './inventory/stock-take/stock-take.component';
import { WriteOffComponent } from './inventory/write-off/write-off.component';
import { AddBookComponent } from './inventory/books/add-book/add-book.component';
import { UpdateBookComponent } from './inventory/books/update-book/update-book.component';
import { PlacedOrdersComponent } from './orders/placed-orders/placed-orders.component';
import { CollectedOrdersComponent } from './orders/collected-orders/collected-orders.component';
import { ReadyOrdersComponent } from './orders/ready-orders/ready-orders.component';
import { EvaluateBooksComponent } from './resale/evaluate-books/evaluate-books.component';
import { LogResaleComponent } from './resale/log-resale/log-resale.component';
import { NoBookingWriteEvaluationComponent } from './resale/no-booking-write-evaluation/no-booking-write-evaluation.component';
import { WriteEvaluationComponent } from './resale/write-evaluation/write-evaluation.component';

import { AddScheduleComponent } from './schedule/add-schedule/add-schedule.component';
import { UpdateScheduleSlotComponent } from './schedule/update-schedule-slot/update-schedule-slot.component';

import { SendNewsletterComponent } from './newsletter/send-newsletter/send-newsletter.component';
import { AudittrailReportComponent } from './reports/audittrail-report/audittrail-report.component';
import { AddStudentComponent } from './students/add-student/add-student.component';
import { AddSaleComponent } from './sale/add-sale/add-sale.component';
import { StockTakeEquipmentComponent } from './inventory/stock-take-equipment/stock-take-equipment.component';
import { OrderReportComponent } from './reports/order-report/order-report.component';
import { ResaleReportComponent } from './reports/resale-report/resale-report.component';
import { WalkinsaleReportComponent } from './reports/walkinsale-report/walkinsale-report.component';
import { BookReportComponent } from './reports/book-report/book-report.component';
import { EquipmentReportComponent } from './reports/equipment-report/equipment-report.component';
import { LogOrderComponent } from './orders/ready-orders/log-order/log-order.component';
import { ScheduleReportComponent } from './reports/schedule-report/schedule-report.component';
import { ChangeRequestComponent } from './change-request/change-request.component';

@NgModule({
  declarations: [
    AppComponent,
    StockTakeEquipmentComponent,
    DashboardComponent,
    SaleComponent,
    InventoryComponent,
    OrdersComponent,
    VouchersComponent,
    ResaleComponent,
    EmployeesComponent,
    ScheduleComponent,
    StudentsComponent,
    NewsletterComponent,
    HelpTipsComponent,
    ReportsComponent,
    SupplierComponent,
    VatComponent,
    CloudComponent,
    LabEquipmentComponent,
    EquipmentTypeComponent,
    AddSupplierComponent,
    UpdateSupplierComponent,
    UpdateVatComponent,
    AddEquipmentTypeComponent,
    UpdateEquipmentTypeComponent,
    AddVoucherComponent,
    BooksComponent,
    // AddBookComponent,
    // UpdateBookComponent,
    UpdateLabEquipmentComponent,
    AddLabEquipmentComponent,
    UpdateEquipmentTypeComponent,
    AddEquipmentTypeComponent,
    FacultyComponent,
    DepartmentComponent,
    ModuleComponent,
    AddFacultyComponent,
    UpdateFacultyComponent,
    AddDepartmentComponent,
    UpdateDepartmentComponent,
    AddModuleComponent,
    UpdateModuleComponent,
    EmployeeTypeComponent,
    AddEmployeeComponent,
    AddEmployeeTypeComponent,
    UpdateEmployeeTypeComponent,
    AddStudentComponent,
    EditStudentComponent,
    EditVoucherComponent,
    UpdateEmployeeComponent,
    ManageEmployeeComponent,
    PrescribedBookComponent,
    PrescribedBookListComponent,
    CaptureEquipmentComponent,
    CaptureEquipComponent,
    AddPresBookComponent,
    EditHelptipComponent,
    AddHelptipsComponent,
    StockTakeComponent,
    WriteOffComponent,
    AddBookComponent,
    UpdateBookComponent,
    PlacedOrdersComponent,
    ReadyOrdersComponent,
    CollectedOrdersComponent,
    EvaluateBooksComponent,
    LogResaleComponent,
    WriteEvaluationComponent, 
    NoBookingWriteEvaluationComponent,
    AddScheduleComponent,
    UpdateScheduleSlotComponent,
    SendNewsletterComponent,
    AudittrailReportComponent,
    AddSaleComponent,
    OrderReportComponent,
    ResaleReportComponent,
    BookReportComponent,
    EquipmentReportComponent,
    LogOrderComponent,
    ScheduleReportComponent,
    WalkinsaleReportComponent,
    ChangeRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CalendarModule,
    MaterialModule
  ],
  providers: [ DatePipe, CurrencyPipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
