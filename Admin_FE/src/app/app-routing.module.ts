import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CloudComponent } from './cloud/cloud.component';
import { EmployeesComponent } from './employees/employees.component';
import { HelpTipsComponent } from './help-tips/help-tips.component';
import { InventoryComponent } from './inventory/inventory.component';
import { BooksComponent } from './inventory/books/books.component';
import { LabEquipmentComponent } from './inventory/lab-equipment/lab-equipment.component';
import { UpdateLabEquipmentComponent } from './inventory/lab-equipment/update-lab-equipment/update-lab-equipment.component';
import { AddLabEquipmentComponent } from './inventory/lab-equipment/add-lab-equipment/add-lab-equipment.component';
import { EquipmentTypeComponent } from './inventory/lab-equipment/equipment-type/equipment-type.component';
import { AddEquipmentTypeComponent } from './inventory/lab-equipment/equipment-type/add-equipment-type/add-equipment-type.component';
import { UpdateEquipmentTypeComponent } from './inventory/lab-equipment/equipment-type/update-equipment-type/update-equipment-type.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';
import { ResaleComponent } from './resale/resale.component';
import { SaleComponent } from './sale/sale.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { StudentsComponent } from './students/students.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './supplier/update-supplier/update-supplier.component';
import { VatComponent } from './vat/vat.component';
import { UpdateVatComponent } from './vat/update-vat/update-vat.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { FacultyComponent } from './inventory/books/faculty/faculty.component';
import { DepartmentComponent } from './inventory/books/faculty/department/department.component';
import { AddDepartmentComponent } from './inventory/books/faculty/department/add-department/add-department.component';
import { UpdateDepartmentComponent } from './inventory/books/faculty/department/update-department/update-department.component';
import { ModuleComponent } from './inventory/books/faculty/module/module.component';
import { AddFacultyComponent } from './inventory/books/faculty/add-faculty/add-faculty.component';
import { UpdateFacultyComponent } from './inventory/books/faculty/update-faculty/update-faculty.component';
import { AddModuleComponent } from './inventory/books/faculty/module/add-module/add-module.component';
import { UpdateModuleComponent } from './inventory/books/faculty/module/update-module/update-module.component';
import { EmployeeTypeComponent } from './employees/employee-type/employee-type.component';
import { AddEmployeeComponent } from './employees/manage-employee/add-employee/add-employee.component';
import { UpdateEmployeeTypeComponent } from './employees/employee-type/update-employee-type/update-employee-type.component';
import { AddEmployeeTypeComponent } from './employees/employee-type/add-employee-type/add-employee-type.component';
import { AddVoucherComponent } from './vouchers/add-voucher/add-voucher.component';
import { EditVoucherComponent } from './vouchers/edit-voucher/edit-voucher.component';
import { AddStudentComponent } from './students/add-student/add-student.component';
import { EditStudentComponent } from './students/edit-student/edit-student.component';
import { AddSaleComponent } from './sale/add-sale/add-sale.component';
import { UpdateEmployeeComponent } from './employees/manage-employee/update-employee/update-employee.component';
import { ManageEmployeeComponent } from './employees/manage-employee/manage-employee.component';
import { PrescribedBookComponent } from './inventory/books/prescribed-book/prescribed-book.component';
import { CaptureEquipmentComponent } from './inventory/lab-equipment/capture-equipment/capture-equipment.component';
import { PrescribedBookListComponent } from './inventory/books/prescribed-book/prescribed-book-list/prescribed-book-list.component';
import { CaptureEquipComponent } from './inventory/lab-equipment/capture-equipment/capture-equip/capture-equip.component';
import { AddPresBookComponent } from './inventory/books/prescribed-book/add-pres-book/add-pres-book.component';
import { EditHelptipComponent } from './help-tips/edit-helptip/edit-helptip.component';
import { AddHelptipsComponent } from './help-tips/add-helptips/add-helptips.component';
import { StockTakeComponent } from './inventory/stock-take/stock-take.component';
import { WriteOffComponent } from './inventory/write-off/write-off.component';
import { AddBookComponent } from './inventory/books/add-book/add-book.component';
import { UpdateBookComponent } from './inventory/books/update-book/update-book.component';
import { PlacedOrdersComponent } from './orders/placed-orders/placed-orders.component';
import { ReadyOrdersComponent } from './orders/ready-orders/ready-orders.component';
import { CollectedOrdersComponent } from './orders/collected-orders/collected-orders.component';

import { EvaluateBooksComponent } from './resale/evaluate-books/evaluate-books.component';
import { LogResaleComponent } from './resale/log-resale/log-resale.component';
import { NoBookingWriteEvaluationComponent } from './resale/no-booking-write-evaluation/no-booking-write-evaluation.component';
import { WriteEvaluationComponent } from './resale/write-evaluation/write-evaluation.component';

import { AddScheduleComponent } from './schedule/add-schedule/add-schedule.component';
import { UpdateScheduleSlotComponent } from './schedule/update-schedule-slot/update-schedule-slot.component';

import { SendNewsletterComponent } from './newsletter/send-newsletter/send-newsletter.component';

import { AudittrailReportComponent } from './reports/audittrail-report/audittrail-report.component';
import { EquipmentReportComponent } from './reports/equipment-report/equipment-report.component';
import { BookReportComponent } from './reports/book-report/book-report.component';
import { ResaleReportComponent } from './reports/resale-report/resale-report.component';
import { OrderReportComponent } from './reports/order-report/order-report.component';
import { AppComponent } from './app.component';
import { LogOrderComponent } from './orders/ready-orders/log-order/log-order.component';
import { ScheduleReportComponent } from './reports/schedule-report/schedule-report.component';
import { WalkinsaleReportComponent } from './reports/walkinsale-report/walkinsale-report.component';
import { ChangeRequestComponent } from './change-request/change-request.component';

import { StockTakeEquipmentComponent } from './inventory/stock-take-equipment/stock-take-equipment.component';


const routes: Routes = [

     //Mmapula -StockTake and WriteOff
     {path:'StockTakeEquipment/:id' , component: StockTakeEquipmentComponent},
     { path: 'stock-take/:isbn', component: StockTakeComponent },
     { path: 'write-off/:id', component: WriteOffComponent },
  { path: 'change-request', component: ChangeRequestComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'cloud', component: CloudComponent },
  { path: 'employees', component: EmployeesComponent },

  { path: 'inventory', component: InventoryComponent },
  { path: 'books', component: BooksComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'update-book/:id', component: UpdateBookComponent },
  { path: 'prescribed-book', component: PrescribedBookComponent },
  { path: 'add-pres-book', component: AddPresBookComponent },
  { path: 'prescribed-book-list', component: PrescribedBookListComponent },
  { path: 'lab_equipment', component: LabEquipmentComponent },
  { path: 'capture-order', component: CaptureEquipmentComponent },
  { path: 'capture-equip', component: CaptureEquipComponent },
  { path: 'stock-take', component: StockTakeComponent },
  { path: 'write-off', component: WriteOffComponent },

  { path: 'update_equipment/:id', component: UpdateLabEquipmentComponent },
  { path: 'add_equipment', component: AddLabEquipmentComponent },

  { path: 'equipment_type', component: EquipmentTypeComponent },
  { path: 'add-equipment-type', component: AddEquipmentTypeComponent },
  { path: 'updateET/:id', component: UpdateEquipmentTypeComponent },

  {path:'logResale/:id', component:LogResaleComponent},
  {path:'WalkInEvaluation',component:NoBookingWriteEvaluationComponent},
  {path:'WriteEvaluation/:id',component : WriteEvaluationComponent},
  {path:'EvaluateBooks',component:EvaluateBooksComponent},


  { path: 'faculty', component: FacultyComponent },
  { path: 'add-faculty', component: AddFacultyComponent },
  { path: 'updateFac/:id', component: UpdateFacultyComponent },

  { path: 'department', component: DepartmentComponent },
  { path: 'add-department', component: AddDepartmentComponent },
  { path: 'updateDep/:id', component: UpdateDepartmentComponent },

  { path: 'module', component: ModuleComponent },
  { path: 'add-module', component: AddModuleComponent },
  { path: 'updateMod/:id', component: UpdateModuleComponent },

  { path: 'help-tips', component: HelpTipsComponent },
  { path: 'add-helptips', component: AddHelptipsComponent },
  { path: 'edit-helptip/:id', component: EditHelptipComponent },

  {path: 'audit-trail', component: AudittrailReportComponent},
  {path: 'equip-report', component: EquipmentReportComponent},
  {path: 'book-report', component: BookReportComponent},
  {path: 'resale-report', component: ResaleReportComponent},
  {path: 'order-report', component: OrderReportComponent},
  {path : 'schedule-report', component:ScheduleReportComponent},
  {path : 'sale-report', component:WalkinsaleReportComponent},

  { path: 'newsletter', component: NewsletterComponent },
  { path: 'send-newsletter', component: SendNewsletterComponent },

  { path: 'orders', component: OrdersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'resale', component: ResaleComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'add-sale', component: AddSaleComponent },

  { path: 'schedule', component: ScheduleComponent },
  {path :'Add-Slot',component:AddScheduleComponent },
  {path :'Update-Slot/:id',component:UpdateScheduleSlotComponent},

  { path: 'students', component: StudentsComponent },
  { path: 'add-student', component: AddStudentComponent },
  { path: 'edit-student/:id', component: EditStudentComponent },

  { path: 'supplier', component: SupplierComponent },
  { path: 'add_supplier', component: AddSupplierComponent },
  { path: 'update/:id', component: UpdateSupplierComponent },

  {path: 'order-placed', component: PlacedOrdersComponent},
  {path: 'order-ready', component: ReadyOrdersComponent},
  {path: 'order-collect', component: CollectedOrdersComponent},
  {path: 'updateOrder/:id', component: LogOrderComponent},


  { path: 'vat', component: VatComponent },
  { path: 'updateVAT', component: UpdateVatComponent },

  { path: 'vouchers', component: VouchersComponent },
  { path: 'add-voucher', component: AddVoucherComponent },
  { path: 'edit-voucher/:id', component: EditVoucherComponent },

  { path: 'employee_type', component: EmployeeTypeComponent },
  { path: 'add-employeetype', component: AddEmployeeTypeComponent },
  { path: 'UpdateE_Type/:id', component: UpdateEmployeeTypeComponent },
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: 'update-employee/:id', component: UpdateEmployeeComponent },
  { path: 'manage-employee', component: ManageEmployeeComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
