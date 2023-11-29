import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable} from 'rxjs';
import { Module } from 'src/app/shared/module';
import { Voucher } from '../shared/voucher';
import { Equipment } from '../shared/equipment';
import { EquipmentType } from '../shared/equipment_type';
import { Faculty } from '../shared/faculty';
import { Department } from '../shared/department';
import { ResellerVM } from '../shared/ResellerViewModel';
import { Schedule } from '../shared/schedules';
import { tap } from 'rxjs/operators';
import { ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from '../shared/shoppingcart';
import { OrderLine } from '../shared/order';
import { schedulebook } from '../shared/schedulebook';
import { ResaleLog } from '../shared/ResaleLogVM';
import { BookEvaluation } from '../shared/bookevaluation';
import { StudentBookEvaluation } from '../shared/studentbookevaluation';
import { ScheduleDates } from '../shared/scheduledates';
import { ResellerPercent } from '../shared/ResellerPercent';
import { Tree } from '../shared/Tree';
import { EmployeeType } from '../shared/employee-type';
import { Employee } from '../shared/employee';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PaymentInfo } from '../shared/payfast';

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


  showProfile: boolean = false;
  // Function to toggle the showProfile value when the button is clicked
  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  AddSchedule(sche: Schedule): Observable<Schedule> {
    return this.httpClient.post<Schedule>(`${this.apiUrl}Schedules/AddSchedule`, sche)
      .pipe(
        tap((response) => console.log('AddSchedule Response:', response))
      );
  }

  //---------------------Reseller_Percent --------------------------------------------------
  getresellerpercent(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Reseller/GetPercent`);
  }

  UpdatePercent(resellerpercent: ResellerPercent) {
    return this.httpClient.put(`${this.apiUrl}Reseller/UpdateResellerPercent`, resellerpercent);
  }


  //---------------------------Reseller----------------------------------------------------------------------------------------------------------------------------------------
  getScheduleSlotsToBooked(): Observable<ScheduleDates[]> {
    const url = `${this.apiUrl}Schedule/GetScheduleDates`;
    return this.httpClient.get<ScheduleDates[]>(url);
  }



  deleteBookFromResale(resellerBookId: number): Observable<any> {
    const url = `${this.apiUrl}Reseller/DeleteBookFromResale/${resellerBookId}`;
    return this.httpClient.delete(url, { responseType: 'text' })
  }

  // Use case 2.1: Check book estimate
  checkBookEstimate(ISBN: string): Observable<any> {
    const url = `${this.apiUrl}Reseller/CheckBookEstimate/${ISBN}`;
    return this.httpClient.get(url);
  }

  // Use case 2.2: Add book to resale cart
  addBookToResaleCart(resellerData: ResellerVM): Observable<any> {
    const url = `${this.apiUrl}Reseller/AddBookToResaleCart`;
    return this.httpClient.post(url, resellerData, { responseType: 'text' });
  }

  // Use case 2.3: Schedule book evaluation
  createBooking(scheduleId: number): Observable<any> {
    const url = `${this.apiUrl}Reseller/CreateBooking/${scheduleId}`;
    return this.httpClient.post(url, {});
  }
  //schedulebook.ts
  AddBooking(ResellerBookBooked: schedulebook): Observable<any> {
    const url = `${this.apiUrl}Reseller/AddBooking`;
    return this.httpClient.post(url, ResellerBookBooked);
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



  //====================================HELP TIPS=======================================//
  GetAllTheHelpTips(): Observable<any> {
    return this.httpClient.get(this.apiUrl + `Help/GetAllHelpTips`).pipe(map(result => result))
  }


  SearchHelpTips(enteredQuery: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Help/GetSearchedHelpTip/${enteredQuery}`).pipe(map(result => result));
  }

  GenerateVideoStreamLink(fileName: string): Observable<string> {
    return this.httpClient.get(this.apiUrl + `Help/GenerateBlobStreamLink/${fileName}`, { responseType: 'text' });
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

  SearchVoucher(enteredQuery: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Voucher/GetSearchedVouchers/${enteredQuery}`).pipe(map(result => result));
  }

  SearchStudent(enteredQuery: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Student/GetSearchedStudents/${enteredQuery}`).pipe(map(result => result));
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

  //Tree faculty,department and modules
  getAllFacultiesWithDepartmentModules(): Observable<Tree> {
    return this.httpClient.get<any>(`${this.apiUrl}Faculty/Tree`)
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
  EditEquipment(equipment_ID: Number, equipment: Equipment) {
    return this.httpClient.put(this.apiUrl + `Equipment/Editequipment/${equipment_ID}`, equipment);
  }

  //Delete equipment
  DeleteEquipment(equipment_ID: Number) {
    return this.httpClient.delete(this.apiUrl + `Equipment/DeleteEquipment/${equipment_ID}`)
  }

  AddEquipment(equi: Equipment) {
    return this.httpClient.post(this.apiUrl + 'Equipment/Addequipment', equi);
  }



  //------------------------------------------------------------------Books-------------------------------------
  GetBooks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}BookInventory/GetBooks`)
      .pipe(
        catchError(this.handleError)
      );
  }

  AddBookToCart(studentid: number, Cbook: ShoppingCartBook) {
    return this.httpClient.post(this.apiUrl + `ShoppingCart_Book/AddShoppingCart_Book/${studentid}`, Cbook);
  }

  AddEquipToCart(studentid: number, Cequip: ShoppingCartEquipment) {
    return this.httpClient.post(this.apiUrl + `ShoppingCart_Equipment/AddShoppingCart_Equipment/${studentid}`, Cequip);
  }

  DeleteBookItem(studentid: number, bookid: number) {
    return this.httpClient.delete(this.apiUrl + `ShoppingCart/DeleteBookItem/${studentid}/${bookid}`)
  }

  DeleteEuipItem(studentid: number, equipid: number) {
    return this.httpClient.delete(this.apiUrl + `ShoppingCart/DeleteEuipItem/${studentid}/${equipid}`)
  }

  GetShoppingCartID(studentId: Number) {
    return this.httpClient.get(this.apiUrl + `ShoppingCart/GetShoppingCart/${studentId}`);
  }



  GetShoppingCartEquipment(studentId: number) {
    return this.httpClient.get(`${this.apiUrl}ShoppingCart_Equipment/GetShoppingCart_Equipments/${studentId}`);
  }

  GetShoppingCartBook(studentId: number) {
    return this.httpClient.get(`${this.apiUrl}ShoppingCart_Book/GetShoppingCart_Books/${studentId}`);
  }

  ClearCart(student_ID: number) {
    return this.httpClient.delete(this.apiUrl + `ShoppingCart/ClearShoppingCart/${student_ID}`);
  }


  private shoppingCartSource = new BehaviorSubject<ShoppingCart | null>(null);
  public shoppingCart$: Observable<any> = this.shoppingCartSource.asObservable();

  studentID = localStorage.getItem('studentId');
  sID = parseInt(this.studentID ?? '0', 10);

  getShoppingCart(studentID: number) {
    this.httpClient.get(this.apiUrl + `ShoppingCart/GetShoppingCart/${this.sID}`).subscribe(
      (response: any) => {
        this.shoppingCartSource.next(response);
      },
      (error: any) => {
        console.error('Error fetching shopping cart:', error);
      }
    );
  }


  GetDiscountAmount(voucher_Code: string, student_ID: number) {
    return this.httpClient.get(this.apiUrl + `ShoppingCart/CalculateDiscount?voucherCode=${voucher_Code}&studentid=${student_ID}`);
  }

  GetDiscountAmount2(student_ID: number) {
    return this.httpClient.get(this.apiUrl + `ShoppingCart/CalculateDiscount?&studentid=${student_ID}`);
  }

  CreateOrderLines(studentid: number, orderLine: OrderLine) {
    return this.httpClient.post(this.apiUrl + `Order/CreateOrderLinesFromCart/${studentid}`, orderLine);
  }

  CalculatTotal(studentID: number) {
    return this.httpClient.get(this.apiUrl + `ShoppingCart/CalculateTotal/${studentID}`);
  }

  CancelOrder(studentid: number) {
    return this.httpClient.delete(this.apiUrl + `Order/CancelOrder/${studentid}`)
  }

  GetOrdersByStatus(statusID: number): Observable<any> {
    return this.httpClient.get(this.apiUrl + `Order/GetOrderByStatus/${statusID}`);
  }

  GetOrderLines(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Order/GetAllOrderLine`).pipe(map(result => result));
  }


  //-------------------------------CartBook & CartEquipment-------------------------------------------
  IncrementBook(bookid: number, studentid: number, bcart: ShoppingCartBook) {
    return this.httpClient.put(this.apiUrl + `ShoppingCart_Book/IncreaseBook/${bookid}/${studentid}`, bcart);
  }

  DecrementBook(bookid: number, studentid: number, bcart: ShoppingCartBook) {
    return this.httpClient.put(this.apiUrl + `ShoppingCart_Book/DecreaseBook/${bookid}/${studentid}`, bcart);
  }

  DecrementEquip(equipid: number, studentid: number, ecart: ShoppingCartEquipment) {
    return this.httpClient.put(this.apiUrl + `ShoppingCart_Equipment/DecreaseEquipment/${equipid}/${studentid}`, ecart);
  }

  IncrementEquip(equipid: number, studentid: number, ecart: ShoppingCartEquipment) {
    return this.httpClient.put(this.apiUrl + `ShoppingCart_Equipment/IncreaseEquipment/${equipid}/${studentid}`, ecart);
  }


  CreatePayment(pay: PaymentInfo): Observable<PaymentResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.httpClient.post<PaymentResponse>(`${this.apiUrl}Payment/CreatePayment`, pay, {
      headers: headers
    });
  }  

  
  //------------------------Employees-------------------------------------------------------------------------
  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
  
  getAllEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}Employee/GetAllEmployees`)
      .pipe(catchError(this.handleError));
  }

  //Get all employee types
  getAllEmployeeTypes(): Observable<EmployeeType[]> {
    const url = `${this.apiUrl}EmployeeType/GetAllEmployeeTypes`;
    return this.httpClient.get<EmployeeType[]>(url);
  }

  
}