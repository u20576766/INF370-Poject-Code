import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Supplier } from '../shared/supplier';
import { Module } from 'src/app/shared/module';
import { EmployeeType } from 'src/app/shared/employee-type';
import { Voucher } from '../shared/voucher';
import { Student } from '../shared/student';
import { Equipment } from '../shared/equipment';
import { Vat } from '../shared/vat';
import { EquipmentType } from '../shared/equipment_type';
import { Faculty } from '../shared/faculty';
import { Department } from '../shared/department';
import { HelpTip } from '../shared/help-tip';
import { UserRole } from '../shared/user-role';
import { ResellerViewModel } from '../shared/ResellerViewModel';
import { resellerbookingVM } from '../shared/ResellerBookingVM';
import { Schedule } from '../shared/schedules';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PrescribedList } from '../shared/prescribedlist';
import { PrescribedBook } from '../shared/prescribedbook';
import { Employee } from '../shared/employee';
import { schedulebook } from '../shared/AddBooking';
import { BookEvaluation } from '../shared/bookevaluation';
import { ResaleLog } from '../shared/resalelog';
import { ScheduleDates } from '../shared/scheduleDates';
import { WalkInSaleBooksViewModel } from '../shared/walkinsaleBOOK';
import { WalkInSalesEquipmentViewModel } from '../shared/walkinsaleEQUIPMENT';
import { WalkInSaleViewModel } from '../shared/walkinSALE';
import { StudentBookEvaluation } from '../shared/bookevaluation2';
import { AuditTrail } from '../shared/audit-trail';
import { Order, OrderLine } from '../shared/order';
import { User } from '../shared/user';
import { BookReport } from '../shared/bookreport';
import { Book } from '../shared/books';
import { EquipmentModel } from '../shared/EquipmentModel';
import { CaptureEquipmentViewModel } from '../shared/captureEquipment';
import { ResellerPercent } from '../shared/ResellerPercent';
import {  StockTakeViewModel } from '../shared/stocktake';
import { WriteOffViewModel } from '../shared/WriteOff';





@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'https://localhost:7121/api/'

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {

  }

//-------------------------------WriteOff-------------------------------------------------------------------------------------------------

writeOff(model:WriteOffViewModel):Observable<any>{
  return this.httpClient.post(`${this.apiUrl}WriteOff/WriteOffStock`,model,{responseType:'text'});
}
  //-----------------------------Sale----------------------------------------------------------------------------

  getSaleTables(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MakeSale/ViewSale`, this.httpOptions);
  }

  generateWalkInSaleReport(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}SaleReport`, this.httpOptions);
  }

  /////make sale

  getSaleBooks(): Observable<any> {
    const url = `${this.apiUrl}BookInventory/GetBooks`;
    return this.httpClient.get(url)
  }

  getAllPaymentTypes(): Observable<any> {
    const url = `${this.apiUrl}MakeSale/GetPaymentTypes`;
    return this.httpClient.get(url, {})
  }

  addWalkInSale(walkInSale: WalkInSaleViewModel): Observable<any> {
    const url = `${this.apiUrl}MakeSale/AddWalkInSale`;
    return this.httpClient.post(url, walkInSale); // Send walkInSale object as the payload
  }


  addWalkInSaleBooks(walkInSaleBooks: WalkInSaleBooksViewModel): Observable<any> {
    const url = `${this.apiUrl}MakeSale/AddWalkInSaleBooks`;
    return this.httpClient.post(url, walkInSaleBooks, { responseType: 'text' })
  }

  addWalkInSaleEquipment(walkInSalesEquipment: WalkInSalesEquipmentViewModel): Observable<any> {
    const url = `${this.apiUrl}MakeSale/AddWalkInSaleEquipment`;
    return this.httpClient.post(url, walkInSalesEquipment, { responseType: 'text' })
  }


  //-----------------------------------------Resale---------------------------------------------------------------

  //---------------------Reseller_Percent --------------------------------------------------
  getresellerpercent(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Reseller/GetPercent`);
  }

  UpdatePercent(resellerpercent: ResellerPercent) {
    return this.httpClient.put(`${this.apiUrl}Reseller/UpdateResellerPercent`, resellerpercent);
  }


  // Use case 2.4: Evaluate book
  evaluateBook(bookingRef: string): Observable<any> {
    const url = `${this.apiUrl}Reseller/EvaluateBook/${bookingRef}`;
    return this.httpClient.get(url);
  }

  // Use case 2.5: Mark book as evaluated
  bookEvaluated(resellerBookId: number): Observable<any> {
    const url = `${this.apiUrl}Reseller/BookEvaluated/${resellerBookId}`;
    return this.httpClient.post(url, { responseType: 'text' });
  }


  // Use case 2.6: Write evaluation book log
  writeEvaluationBookLog(logData: BookEvaluation): Observable<any> {
    const url = `${this.apiUrl}Reseller/WriteEvaluationBookLog`;
    return this.httpClient.post(url, logData);
  }

  StudentwriteEvaluationBookLog(logDataStudent: StudentBookEvaluation): Observable<any> {
    const url = `${this.apiUrl}Reseller/StudentWriteEvaluationBookLog`;
    return this.httpClient.post(url, logDataStudent);
  }


  // Use case 2.5: Log resale exchange
  logResaleExchange(logData: ResaleLog): Observable<any> {
    const url = `${this.apiUrl}Reseller/LogResaleExchange`;
    return this.httpClient.post(url, logData);
  }

  // Use case 2.6: View pending booking
  getPendingBooking(studentId: number): Observable<any> {
    const url = `${this.apiUrl}Reseller/PendingBooking/${studentId}`;
    return this.httpClient.get(url);
  }

  // Use case 2.6: View evaluation booked
  getEvaluationBooked(studentId: number): Observable<any> {
    const url = `${this.apiUrl}Reseller/EvaluationBooked/${studentId}`;
    return this.httpClient.get(url);
  }

  // Use case 2.6: View evaluation completed
  getEvaluationCompleted(studentId: number): Observable<any> {
    const url = `${this.apiUrl}Reseller/EvaluationCompleted/${studentId}`;
    return this.httpClient.get(url);
  }

   //----------------------------------------------------SCHEDULE-----------------------------------------
  // Add new schedule slot
  addScheduleSlot(schedule: Schedule): Observable<any> {
    const url = `${this.apiUrl}Schedule/AddScheduleSlots`;
    return this.httpClient.post(url, schedule, { responseType: 'text' });
  }


  // Update schedule slot
  updateScheduleSlot(scheduleId: number, schedule: Schedule): Observable<any> {
    const url = `${this.apiUrl}Schedule/UpdateSlots/${scheduleId}`;
    return this.httpClient.put(url, schedule, { responseType: 'text' });
  }

  // Get deletable slots
  getNonDeletableSlots(): Observable<Schedule[]> {
    const url = `${this.apiUrl}Schedule/GetNotDeleteable`;
    return this.httpClient.get<Schedule[]>(url);
  }

  // Delete schedule slot
  deleteScheduleSlot(scheduleId: number): Observable<any> {
    const url = `${this.apiUrl}Schedule/DeleteEvaluationSlot/${scheduleId}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }

  // Get slot by ID
  getSlotById(scheduleId: number): Observable<Schedule> {
    const url = `${this.apiUrl}Schedule/GetSlot/${scheduleId}`;
    return this.httpClient.get<Schedule>(url);
  }

  // Get all schedule slots
  getAllScheduleSlots(): Observable<Schedule[]> {
    const url = `${this.apiUrl}Schedule/GetAllScheduleSlots`;
    return this.httpClient.get<Schedule[]>(url);
  }

  // Get schedule summary
  getScheduleSummary(): Observable<any> {
    const url = `${this.apiUrl}Schedule/GetScheduleSummary`;
    return this.httpClient.get(url);
  }


  // Get all schedule slots
  getScheduleSlotsToBooked(): Observable<ScheduleDates[]> {
    const url = `${this.apiUrl}Schedule/GetScheduleDates`;
    return this.httpClient.get<ScheduleDates[]>(url);
  }

  //-------------------------------------Employee--------------------------------------------------------------


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}Employee/GetAllEmployees`)
      .pipe(catchError(this.handleError));
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.apiUrl}Employee/GetEmployee/${id}`)
      .pipe(catchError(this.handleError));
  }

  addEmployee(employee: Employee): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}Employee/AddEmployee`, employee, { responseType: 'text' })
      .pipe(catchError(this.handleError)) as Observable<string>;
  }


  updateEmployee(id: number, employee: Employee): Observable<string> {
    return this.httpClient.put(`${this.apiUrl}Employee/UpdateEmployee/${id}`, employee, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }
  

  deleteEmployee(id: number): Observable<string> {
    return this.httpClient.delete(`${this.apiUrl}Employee/DeleteEmployee/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }


  //--------------------------------Prescribed Book-------------------------------------------------------------
  getModuleById(moduleId: number): Observable<Module> {
    return this.httpClient.get<Module>(this.apiUrl + `Module/GetModule/${moduleId}`);
  }
  // Function to get all prescribed books
  getAllPrescribedBooks(): Observable<PrescribedBook[]> {
    return this.httpClient.get<PrescribedBook[]>(this.apiUrl + 'PrescribedBook/GetAllPrescribedBooks');
  }

  addPrescribedBook(prescribedBook: PrescribedBook): Observable<string> {
    return this.httpClient.post(
      this.apiUrl + 'PrescribedBook/AddPrescribedBook',
      prescribedBook,
      {
        ...this.httpOptions,
        responseType: 'text' // Specify the response type as 'text'
      }
    ).pipe(
      catchError((error) => {
        console.error('Error adding prescribed book:', error);
        return throwError(error); // Re-throw the error to be handled by the component
      })
    );
  }


  GetPrescribedBookByISBN(isbn: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}PrescribedBook/GetPrescribedBookByISBN/${isbn}`)
      .pipe(map(result => [result])); // Wrap the single object in an array
  }

  // Function to update a prescribed book
  updatePrescribedBook(isbn: string, prescribedBook: PrescribedBook): Observable<any> {
    return this.httpClient.put<any>(
      this.apiUrl + `PrescribedBook/UpdatePrescribedBook?isbn=${isbn}`,
      prescribedBook,
      this.httpOptions
    );
  }

  // Function to delete a prescribed book
  deletePrescribedBook(isbn: string): Observable<any> {
    return this.httpClient.delete<any>(this.apiUrl + `PrescribedBook/DeletePrescribedBook?isbn=${isbn}`);
  }

  // Function to search for prescribed books by ISBN
  searchPrescribedBooks(searchText: string): Observable<PrescribedBook[]> {
    return this.httpClient.get<PrescribedBook[]>(this.apiUrl + `PrescribedBook/SearchPrescribedBooks/${searchText}`);
  }
  //-----------------------------------Upload Prescribed Book List------------------------------------------

  uploadPrescribedBookList(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + 'PrescribedBookLists/UploadPrescribedBookList', formData);
  }


  //----------------------------------Reseller -----------------------------------------
  AddSchedule(sche: Schedule): Observable<Schedule> {
    return this.httpClient.post<Schedule>(`${this.apiUrl}Schedules/AddSchedule`, sche)
      .pipe(
        tap((response) => console.log('AddSchedule Response:', response))
      );
  }

  //---------------------------------------------------Employee Type-----------------------------------------------
  //Get all employee types
  getAllEmployeeTypes(): Observable<EmployeeType[]> {
    const url = `${this.apiUrl}EmployeeType/GetAllEmployeeTypes`;
    return this.httpClient.get<EmployeeType[]>(url);
  }

  //Get Employee Type by Id
  getEmployeeType(employeeTypeId: number): Observable<EmployeeType> {
    const url = `${this.apiUrl}EmployeeType/GetAnEmployeeType/${employeeTypeId}`;
    return this.httpClient.get<EmployeeType>(url);
  }

  //Add Employee Type
  addEmployeeType(employeeType: EmployeeType): Observable<EmployeeType> {
    const url = `${this.apiUrl}EmployeeType/AddEmployeeType`; // Update the URL to call the correct endpoint
    return this.httpClient.post<EmployeeType>(url, employeeType);
  }


  //Update Employee Type
  updateEmployeeType(employeeTypeId: number, employeeType: EmployeeType): Observable<EmployeeType> {
    const url = `${this.apiUrl}EmployeeType/UpdateEmployeeType/${employeeTypeId}`;
    return this.httpClient.put<EmployeeType>(url, employeeType);
  }

  //Delete Employee Type
  deleteEmployeeType(employeeTypeId: number): Observable<EmployeeType> {
    const url = `${this.apiUrl}EmployeeType/DeleteEmployeeType/${employeeTypeId}`;
    return this.httpClient.delete<EmployeeType>(url);
  }

  //Search Employee Type
  getEmployeeTypes(input: string): Observable<EmployeeType[]> {
    const url = `${this.apiUrl}EmployeeType/SearchEmployeeType/${input}`;
    return this.httpClient.get<EmployeeType[]>(url);
  }

  //---------------------------------------------------------------------Stock Take-----------------------------

  updateBookStock(model: StockTakeViewModel): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockTake/UpdateBookStock`, model, {responseType:'text'});
  }

  updateEquipmentStock(model: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}StockTake/UpdateEquipmentStock`, model, {responseType:'text'});
  }

  //---------------------------------------------------------VOUCHERS-----------------------------------------------------------//
  GetAllTheVouchers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Voucher/GetAllVouchers`).pipe(map(result => result))
  }

  AddNewVoucher(newVoucher: Voucher) {
    return this.httpClient.post(this.apiUrl + `Voucher/AddVoucher`, newVoucher);
  }

  UpdateAVoucher(Voucher_ID: number, updatedVoucher: Voucher) {
    return this.httpClient.put(this.apiUrl + `Voucher/EditVoucher/${Voucher_ID}`, updatedVoucher);
  }

  DeleteVoucher(Voucher_ID: number) {
    return this.httpClient.delete(this.apiUrl + `Voucher/DeleteVoucher/${Voucher_ID}`);
  }

  GetSelectedVoucher(Voucher_ID: number) {
    return this.httpClient.get(this.apiUrl + `Voucher/GetAVoucher/${Voucher_ID}`);
  }

  SearchVoucherPercent(enteredQuery: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Voucher/SearchVoucherPercent/${enteredQuery}`).pipe(map(result => result));
  }

  //--------------------------------------- VAT-------------------------------------------------------------------------------------
  GetVAT(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}VAT/GetVAT`)
      .pipe(map(result => result))
  }

  EditVAT(percent: number, vat: Vat) {
    return this.httpClient.put(this.apiUrl + `VAT/EditVAT?VAT_ID=1&Percent=${percent}`, vat);

  }

   //---------------------------------------------------------STUDENTS-----------------------------------------------------------//
   GetAllTheStudents(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Student/GetAllStudents`).pipe(map(result => result))
  }
  
  AddNewStudent(newStudent: FormData) {
    return this.httpClient.post(this.apiUrl + `Student/AddStudent`, newStudent);
  }

  UpdateAStudent(student_ID: number, updatedStudent: Student) {
    return this.httpClient.put(this.apiUrl + `Student/EditStudent/${student_ID}`, updatedStudent);
  }

  DeleteStudent(student_ID: number) {
    return this.httpClient.delete(this.apiUrl + `Student/DeleteStudent/${student_ID}`);
  }

  GetSelectedStudent(student_ID: number) {
    return this.httpClient.get(this.apiUrl + `Student/GetAStudent/${student_ID}`);
  }

  SearchStudent(enteredQuery: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Student/GetSearchedStudent/${enteredQuery}`).pipe(map(result => result));
  }

  //---------------------------------------------------Supplier-----------------------------------------------
  //Get All Suppliers
  GetAllSuppliers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Supplier/GetAllSuppliers`)
      .pipe(map(result => result))
  }

  //Add Supplier
  AddSupplier(supp: Supplier) {
    return this.httpClient.post(this.apiUrl + `Supplier/AddSupplier`, supp);
  }

  //Update a Supplier
  UpdateSupplier(supplier_ID: Number, supp: Supplier) {
    return this.httpClient.put(this.apiUrl + `Supplier/EditSupplier/${supplier_ID}`, supp);
  }

  //Delete a supplier
  DeleteSupplier(supplier_ID: Number) {
    return this.httpClient.delete(this.apiUrl + `Supplier/DeleteSupplier/${supplier_ID}`);
  }


  //Get Supplier by ID
  GetSupplier(supplier_ID: Number) {
    return this.httpClient.get(this.apiUrl + `Supplier/GetSupplier/${supplier_ID}`);
  }

  //Get suppliers by text
  SearchSupplier(input: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Supplier/GetSupplierInput/${input}`)
      .pipe(map(result => result))
  }



  //-----------------------------------------------------------------Equipment Type--------------------------------------------------------

  //Get all the equipment types
  GetAllEquipmentTypes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}EquipmentType/GetAllEquipmentTypes`)
      .pipe(map(result => result))
  }

  //Add Equipment Type
  AddEquipmentType(et: EquipmentType) {
    return this.httpClient.post(this.apiUrl + `EquipmentType/AddEquipmentType`, et);
  }


  //Delete a equipment type
  DeleteEquipmentType(equipmentType_ID: Number) {
    return this.httpClient.delete(this.apiUrl + `EquipmentType/DeleteEquipmentType/${equipmentType_ID}`);
  }

  //Get Equipment Type by ID
  GetEquipmentType(equipmentType_ID: Number) {
    return this.httpClient.get(this.apiUrl + `EquipmentType/GetEquipmentType/${equipmentType_ID}`);
  }

  //Update a equipment Type
  updateEquipmentType(equipmentType_ID: Number, et: EquipmentType) {
    return this.httpClient.put(this.apiUrl + `EquipmentType/EditEquipmentType/${equipmentType_ID}`, et);
  }

  //Get equipment by text
  SearchEquipmentType(input: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}EquipmentType/GetEquipmentTypeInput/${input}`)
      .pipe(map(result => result))
  }

  //--------------------------------------------------------Faculty----------------------------------------
  //Get all the faculty
  GetAllFaculties(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Faculty/GetAllFaculty`)
      .pipe(map(result => result))
  }

  //Add Faculty
  AddFaculty(faculty: Faculty) {
    return this.httpClient.post(this.apiUrl + `Faculty/AddFaculty`, faculty);
  }

  //Update a faculty
  updateFaculty(faculty_ID: Number, fac: Faculty) {
    return this.httpClient.put(this.apiUrl + `Faculty/EditFaculty/${faculty_ID}`, fac);
  }

  //Get Faculty by ID
  GetFaculty(faculty_ID: Number) {
    return this.httpClient.get(this.apiUrl + `Faculty/GetFaculty/${faculty_ID}`);
  }

  //Delete a faculty
  DeleteFaculty(faculty_ID: Number) {
    return this.httpClient.delete(this.apiUrl + `Faculty/DeleteFaculty/${faculty_ID}`);
  }

  //Get equipment by text
  SearchFaculty(input: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Faculty/GetFacultyInput/${input}`)
      .pipe(map(result => result))
  }

  //-------------------------------------------Department--------------------------------------------
  GetAllDepartments(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Department/GetDepartment`)
      .pipe(map(result => result))
  }

  //Add Department
  AddDepartment(dep: Department) {
    return this.httpClient.post(this.apiUrl + `Department/AddDepartment`, dep);
  }

  //Update a Department
  updateDepartment(department_ID: Number, dep: Department) {
    return this.httpClient.put(this.apiUrl + `Department/EditDepartment/${department_ID}`, dep);
  }

  //Get Department by ID
  GetDepart(department_ID: Number) {
    return this.httpClient.get(this.apiUrl + `Department/GetDepartment/${department_ID}`);
  }

  //Delete a Department
  DeleteDepartment(department_ID: Number) {
    return this.httpClient.delete(this.apiUrl + `Department/DeleteDepartment/${department_ID}`);
  }

  //Get equipment by text
  SearchDepartment(input: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Department/GetDepartmentInput/${input}`)
      .pipe(map(result => result))
  }



  //-------------------------------------------Module--------------------------------------------
  GetAllModules(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Module/GetAllModules`)
      .pipe(map(result => result))
  }

  //Get module
  GetModules(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Module/GetAllModules`)
      .pipe(map(result => result))
  }

  //Add module
  AddModule(mod: Module) {
    return this.httpClient.post(this.apiUrl + `Module/AddModule`, mod);
  }

  //Update a module
  updateModule(module_ID: Number, mod: Module) {
    return this.httpClient.put(this.apiUrl + `Module/EditModule/${module_ID}`, mod);
  }

  //Get module by ID
  GetModule(module_ID: Number) {
    return this.httpClient.get(this.apiUrl + `Module/GetModule/${module_ID}`);
  }

  //Delete a module
  DeleteModule(module_ID: Number) {
    return this.httpClient.delete(this.apiUrl + `Module/DeleteModule/${module_ID}`);
  }

  //Get equipment by text
  SearchModule(input: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Module/GetModuleInput/${input}`)
      .pipe(map(result => result))
  }

  //-------------------------------------------------------------------------Equipment-------------------------------------

  //Get all the equipments
  GetEquipments(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Equipment/GetAllEquipments`)
      .pipe(map(result => result))
  }

  //Get equipment using search bar
  searchEquipment(searchText: String): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Equipment/GetEquipment/${searchText}`).pipe(
      map(result => result)
    )
  }

  //Get equipment using id
  GetEquipmentByid(equipment_ID: Number) {
    return this.httpClient.get(this.apiUrl + `Equipment/GetEquipmentById/${equipment_ID}`);
  }
  //Update equipment and add new price
  EditEquipment(equipment_ID: Number, equipment: EquipmentModel): Observable<any> {
    return this.httpClient.put(this.apiUrl + `Equipment/Editequipment/${equipment_ID}`, equipment, { responseType: 'text' });
  }



  //Delete equipment
  DeleteEquipment(equipment_ID: number): Observable<any> {
    const url = `${this.apiUrl}Equipment/DeleteEquipment/${equipment_ID}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }


  AddEquipment(equi: EquipmentModel): Observable<any> {
    const url = `${this.apiUrl}Equipment/AddEquipment`;
    return this.httpClient.post(url, equi, { responseType: 'text' });
  }

  CaptureEquipment(capture: CaptureEquipmentViewModel): Observable<any> {
    const url = `${this.apiUrl}CaptureEquipment/CaptureEquipment`;
    return this.httpClient.post(url, capture, { responseType: 'text' })
  }



  //----------------------------------------------------------Books---------------------------------------------

  //----------------------------------------------------------Books---------------------------------------------
  //Get all books
  GetBooks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}BookInventory/GetBooks`)
      .pipe(map(result => result))
  }
  //Add Book
  AddBook(book: Book) {
    return this.httpClient.post(this.apiUrl + 'BookInventory/AddBook', book);

  }
  //Update Book
  UpdateBook(isbn: string, book: Book) {
    return this.httpClient.put(this.apiUrl + `BookInventory/UpdateBook/${isbn}`, book)
  }
  GetBookByISBN(isbn: string): Observable<any> {
    return this.httpClient.get(this.apiUrl + `BookInventory/GetBookByISBN/${isbn}`);
  }
  DeleteBook(isbn: string) {
    return this.httpClient.delete(this.apiUrl + `BookInventory/DeleteBook/${isbn}`);
  }



  //---------------------------------------------------------------------Help Tips------------------------------
  GetAllTheHelpTips(): Observable<any> {
    return this.httpClient.get(this.apiUrl + `Help/GetAllHelpTips`).pipe(map(result => result))
  }

  AddNewHelpTip(newHelpTip: FormData) {
    return this.httpClient.post(this.apiUrl + `Help/AddHelpTip`, newHelpTip);
  }

  AddABlob(model: HelpTip): Observable<any> {
    //{ responseType: 'text' }
    return this.httpClient.post(this.apiUrl + 'BlobExplorer/Post', model);
  }

  GenerateVideoStreamLink(fileName: string): Observable<string> {
    return this.httpClient.get(this.apiUrl + `Help/GenerateBlobStreamLink/${fileName}`, { responseType: 'text' });
  }

  UpdateAHelpTip(Help_ID: number, updatedHelpTip: FormData) {
    return this.httpClient.put(this.apiUrl + `Help/EditHelpTip/${Help_ID}`, updatedHelpTip);
  }

  DeleteHelpTip(Help_ID: number) {
    return this.httpClient.delete(this.apiUrl + `Help/DeleteHelpTip/${Help_ID}`);
  }

  GetSelectedHelpTip(Help_ID: number) {
    return this.httpClient.get(this.apiUrl + `Help/GetAHelpTip/${Help_ID}`);
  }

  SearchHelpTips(enteredQuery: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Help/GetSearchedHelpTip/${enteredQuery}`).pipe(map(result => result));
  }


  //---------------------------------------Newsletters------------------------------

  GetAllTheNewsletters(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Newsletter/GetAllNewsletters`).pipe(map(result => result))
  }

  SortNewslettersByDescending(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Newsletter/SortByDescending`).pipe(map(result => result))
  }

  SendANewsletter(newsletter: FormData) {
    return this.httpClient.post(this.apiUrl + `Newsletter/SendNewsletter`, newsletter);
  }

  //---------------------------------------Audit Trail------------------------------//
  GenerateAuditTrail(auditTrail: FormData) {
    return this.httpClient.post(this.apiUrl + `AuditTrail/GenerateAuditTrail`, auditTrail);
  }

  GetAuditTrail(): Observable<any> {
    return this.httpClient.get(this.apiUrl + `AuditTrail/GetAllAuditTrails`).pipe(map(result => result))
  }

  GetFilteredAuditTrails(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate.toString()) // Convert Date to string
      .set('endDate', endDate.toString());     // Convert Date to string

    // Use params in the HTTP GET request
    return this.httpClient.get(this.apiUrl + 'AuditTrail/GetFilteredAuditTrails', { params });
  }

  GetFilteredByCategoryAuditTrails(selectedCategory: string, searchQuery: string): Observable<any> {
    const params = new HttpParams()
      .set('selectedCategory', selectedCategory)
      .set('searchQuery', searchQuery);

    return this.httpClient.get<any>(`${this.apiUrl}AuditTrail/GetAuditTrailsByCategories`, { params }).pipe(
      map(result => result)
    );
  }

  //------------------------------------------------------------------BackUp and Restore---------------------------------
  BackupData() {
    return this.httpClient.get(`${this.apiUrl}SystemData/BackupData`, this.httpOptions);
  }
  setBackupInterval(intervalMilliseconds: number): Observable<string> {
    const url: string = `${this.apiUrl}SystemData/setbackupinterval`;
    return this.httpClient.post<string>(url, intervalMilliseconds);
  }
  RestoreData() {
    return this.httpClient.post(`${this.apiUrl}SystemData/RestoreDatabase`, this.httpOptions);
  }


  //------------------------------------------------------------Orders------------------------------------------------------//
  GetAllOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Order/GetAllExistingOrders`).pipe(map(result => result))
  }

  GetOrdersByStatus(statusID: number): Observable<any> {
    return this.httpClient.get(this.apiUrl + `Order/GetOrderByStatus/${statusID}`);
  }

  GetStatusById(status_ID: number): Observable<any> {
    return this.httpClient.get(this.apiUrl + `OrderStatus/GetOrderStatus/${status_ID}`);
  }

  GetOrderByID(orderID: number): Observable<any> {
    return this.httpClient.get(this.apiUrl + `Order/GetOrder/${orderID}`);
  }

  GetOrderLinesByID(orderID: number): Observable<any> {
    return this.httpClient.get(this.apiUrl + `Order/GetOrderLines/${orderID}`);
  }

  GetOrderLines(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Order/GetAllOrderLine`).pipe(map(result => result));
  }

  ProcessOrder(ref: string, status: number, order: Order): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Order/ProcessOrder/${ref}/${status}`, order);
  }

  LogCollection(ref: string, coll: string, order: Order): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Order/LogCollection/${ref}/${coll}`, order);
  }

  SearchOrder(ref: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Order/GetOrderInput/${ref}`).pipe(map(result => result));
  }

  
  
  



  //-------------------------------------Reports--------------------------------------------------------------

  generateBookInventoryReport(): Observable<BookReport> {
    return this.httpClient.get<BookReport>(`${this.apiUrl}BookInventoryReport`);
  }


  GenerateEquipmentReport(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}EquipmentReport/GenerateEquipmentReport`, this.httpOptions);
  }

  GenerateResaleReport(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ResaleReport/GenerateResaleReport`, this.httpOptions);
  }

  GenerateOrderReport(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}OrderReport`, this.httpOptions);
  }

}
