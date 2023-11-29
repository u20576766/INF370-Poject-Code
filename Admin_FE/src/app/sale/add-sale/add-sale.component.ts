import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/shared/student';
import { DataService } from 'src/app/services/data.service';
import { Book, Books } from 'src/app/shared/books';
import { PaymentType } from 'src/app/shared/paymentTypes';
import { EquipmentViewModel } from 'src/app/shared/EquipmentViewModel';
import { Voucher } from 'src/app/shared/voucher';
import { WalkInSaleBooksViewModel } from 'src/app/shared/walkinsaleBOOK';
import { WalkInSalesEquipmentViewModel } from 'src/app/shared/walkinsaleEQUIPMENT';
import { WalkInSaleViewModel } from 'src/app/shared/walkinSALE';
import { Router } from '@angular/router';
import { Equi } from 'src/app/shared/equipment2';
import { Equipment } from 'src/app/shared/equipment2';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { Vat } from 'src/app/shared/vat';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent {


  LoggedInName: string = "";
  empType: number = 0;
  employeeID: number = 0;
  arrStudents: Student[] = []
  fullname:string ="";
  VAT:Vat[]=[];
  constructor(private data: DataService, private router: Router,private cdRef: ChangeDetectorRef) { }

  retrievedstudent: Student[] = [];
  studentsection: boolean = false;
  paymentTypes: PaymentType[] = [];
  books: Book[] = [];
  equipment: EquipmentViewModel[] = [];
  selectedPaymentType: number | null = null; // Store the selected payment type ID
  quantityBoughtEquipment: number[] = new Array(this.equipment.length).fill(0);
  TotalPayment: number | null = null;
  cartEquipment: { EquipmentID: number; QuantityBought: number; name: string; TotalAmount: number }[] = [];
  WalkInSaleAdded: any;
  searchQuery: string = "";
  VATpercent :any;

  ngOnInit(): void {
    this.getBooks();
    this.getPaymentTypes();
    this.getEquipment();
    this.getAllVouchers();
   // this.SearchBooksEquipment();
    this.getVAT();


  }

  getVAT() {
    this.data.GetVAT().subscribe(result => {
      this.VAT = result // Assign VAT values to the array
   // After fetching VAT values, access the first VAT object and its percent value
      } )

  }




  SearchStudent() {
    const students = (document.querySelector('[name="student"]') as HTMLInputElement).value;

    if (students == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Student surname error',
        text: 'Please provide student surname.',
        confirmButtonText: 'OK'
      });
    } else {
      this.data.SearchStudent(students).subscribe(
        result => {
          if (result && result.length > 0) {
            this.retrievedstudent = result;
            console.log(this.retrievedstudent);

            // Display students using SweetAlert
            const studentList = this.retrievedstudent.map(student => `${student.name} ${student.surname}`);
            Swal.fire({
              title: 'Select a student',
              input: 'select',
              inputOptions: Object.fromEntries(this.retrievedstudent.map((student, index) => [index, `${student.name} ${student.surname}`])),
              inputPlaceholder: 'Select a student',
              showCancelButton: true,
              confirmButtonText: 'Select',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
                const selectedIndex = result.value;

                if (selectedIndex === undefined || selectedIndex === null || selectedIndex === '') {
                  Swal.fire('Error', 'Please select a student', 'error');
                } else {
                  const selectedStudent = this.retrievedstudent[selectedIndex];
                  this.selectStudent(selectedStudent);
                  this.studentsection = true;
                }
              }

            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No students found',
              text: 'No students were found with the provided surname.',
              confirmButtonText: 'OK'
            });
            console.log('Received null data from the API.');
          }
        },
        error => {
          console.error('An error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching students. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }







  selectedStudent: Student | null = null;
  selectedStudentID: number = 0;

  selectStudent(student: Student) {
    this.selectedStudent = student;
    this.selectedStudentID = student.student_ID;
  }

  getBooks() {
      this.data.getSaleBooks().subscribe((response)=> {
        this.books = response.$values;
        console.log(this.books);
        this.SearchBooksEquipment();
      },
      error => {
        console.error('Error fetching equipment:', error);
        Swal.fire('Error','There was an error fetching books.Please contact support','error' );

      })
  }


  equipments: Equipment[] = [];
  equi: Equi[] = [];
  getEquipment(){
    this.data.GetEquipments().subscribe(
      (result: Equipment) => {
        this.equi = result.$values;
        console.log(this.equi)
        this.SearchBooksEquipment()
      },
      error => {
        console.error('Error fetching equipment:', error);
        Swal.fire('Error','There was an error fetching equipments.Please contact support','error' );
      }
    );
  }





  getPaymentTypes() {
    this.data.getAllPaymentTypes().subscribe(
      result => {
        if (result && result.$values) {
          this.paymentTypes = result.$values;
          console.log('Retrieved Payment Types:', this.paymentTypes);
        } else {
          console.log('Received null or invalid data for payment types from the API.');
        }
      },
      error => {
        console.error('An error occurred while fetching payment types:', error);
      }
    );
  }


  cartBook: { BookID?: number | undefined; QuantityBought: number; AmountTotal: number; title: string }[] = [];

  quantityBought: number[] = new Array(this.books.length).fill(0);

  addToCart(book: Book, quantityBought: number): void {
    if (quantityBought > 0) {
      const existingCartItem = this.cartBook.find(item => item.BookID === book.$id);

      if (
        quantityBought > book.quantity || // Check if quantity exceeds the available stock
        (existingCartItem &&
          quantityBought > book.quantity - existingCartItem.QuantityBought)
      ) {
        Swal.fire('The quantity added to cart is greater than quantity in stock', '', 'error');
      } else {
        if (existingCartItem) {
          existingCartItem.QuantityBought += quantityBought;
          existingCartItem.AmountTotal = existingCartItem.QuantityBought * book.price;
        } else {
          const cartItem = {
            BookID:  book.book_ID,
            title: book.title,
            QuantityBought: quantityBought,
            AmountTotal: quantityBought * book.price,
          };
          this.cartBook.push(cartItem);
        }

        const bookIndex = this.books.findIndex(b => b.$id === book.$id);
        if (bookIndex !== -1) {
          this.books[bookIndex].quantity -= quantityBought;
        }

        this.quantityBought[bookIndex] = 0;

        console.log('Updated Cart:', this.cartBook);
        console.log('Updated books array:', this.books);

        const totalAmountBooks = this.cartBook.reduce((total, item) => total + item.AmountTotal, 0);
        const totalAmountEquipment = this.cartEquipment.reduce((total, item) => total + item.TotalAmount, 0);
        this.TotalPayment = totalAmountBooks + totalAmountEquipment;
      }
    } else {
      Swal.fire('No quantity was selected. Please add quantity ');
    }
  }




 CheckOutCart(){

 // Check if a student is selected
 if (!this.selectedStudentID) {
  Swal.fire('Please select a student', '', 'warning');
  return;
}

// Check if there is anything in the carts
if (this.cartBook.length === 0 && this.cartEquipment.length === 0) {
  Swal.fire('There is nothing in the cart', '', 'warning');
  return;
}

// Check if a payment type is selected
if (!this.selectedPaymentType) {
  Swal.fire('Please select a payment type', '', 'warning');
  return;
}

Swal.fire({
  title: 'Please confirm to capture sale?',
  showConfirmButton: true,
  showDenyButton: true,
  confirmButtonColor: "green",
  confirmButtonText: 'Confirm,capture sale.',
  denyButtonText: 'No'
}).then((result) => {
  if (result.isConfirmed) //if user clicked yes
  {
//start excecuting
      this.CheckOutSale();
  }});
 }







  ///CheckOut
  CheckOutSale() {
    console.log('Selected Payment Type ID:', this.selectedPaymentType);
    //User Information
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.employeeID = userObject.employee_ID;
      this.LoggedInName = userObject.name + " " + userObject.surname;
      this.empType = userObject.employee_Type_ID;
    }

    if (this.selectedPaymentType !== null) {
      //now we create  new walkinsale
      const walkinsale: WalkInSaleViewModel = new WalkInSaleViewModel();
      walkinsale.paymentType_ID = this.selectedPaymentType;
      walkinsale.employee_ID = this.employeeID;
      walkinsale.student_ID = this.selectedStudentID;

      const totalAmountBooks = this.cartBook.reduce((total, item) => total + item.AmountTotal, 0);
      const totalAmountEquipment = this.cartEquipment.reduce((total, item) => total + item.TotalAmount, 0);
      walkinsale.totalAmount = totalAmountBooks + totalAmountEquipment;

      if (this.Voucher !== null && this.Voucher.length > 0) {
        const voucherPercent: number = this.Voucher[0]?.percent || 0; // Convert to number using parseInt
        walkinsale.voucher_ID = this.Voucher[0]?.voucher_ID || 0;
        const discountAmount = (totalAmountBooks * voucherPercent) / 100;
        walkinsale.totalAmount = totalAmountBooks - discountAmount + totalAmountEquipment;
      } else {
        walkinsale.voucher_ID = 0;
        walkinsale.totalAmount = totalAmountBooks + totalAmountEquipment;
      }

      //add walkinsale and get respond back
      this.data.addWalkInSale(walkinsale).subscribe(
        (reponse) => {
          this.WalkInSaleAdded = reponse;
          console.log(this.WalkInSaleAdded)

          if (this.WalkInSaleAdded) {
            console.log('Adding books and equipments')

            //adding books, AFTERING GETTINGBOOKS
            if (this.cartBook !== null) {

              for (var i = 0; i < this.cartBook.length; i++) {
                const book: WalkInSaleBooksViewModel = new WalkInSaleBooksViewModel();
                book.book_ID = this.cartBook[i].BookID // Use the value or default to 0 // Convert to integer and use 0 as default value
                book.quantity = this.cartBook[i].QuantityBought;
                book.totalCosts = this.cartBook[i].AmountTotal;
                book.walkInSale_ID = this.WalkInSaleAdded.walkInSale_ID;
                console.log(book)

                this.data.addWalkInSaleBooks(book).subscribe((response) => {
                  if (typeof response == 'string' && response.includes('Added successfully')) {
                    console.log("Added")
                  }
                  else {
                    Swal.fire('Error , processsing the sale.Try again','','error')
                  }

                }//, (error)=>{
                  // this.showAddErrorAddingModal= true;
                  //}
                );
              }

            }


            //adding equipments
            if (this.cartEquipment !== null) {

              for (var i = 0; i < this.cartEquipment.length; i++) {
                const e: WalkInSalesEquipmentViewModel = new WalkInSalesEquipmentViewModel();
                e.equipment_ID = this.cartEquipment[i].EquipmentID;
                e.quantity = this.cartEquipment[i].QuantityBought;
                e.totalCosts = this.cartEquipment[i].TotalAmount;
                e.walkInSale_ID = this.WalkInSaleAdded.walkInSale_ID;

                this.data.addWalkInSaleEquipment(e).subscribe((response) => {
                  if (typeof response == 'string' && response.includes('Added successfully')) {
                    console.log("Added")
                  }
                  else {
                    Swal.fire('Error , processsing the sale.Try again','','error')
                  }

                },(error)=>{
                  Swal.fire('Error , processsing the sale.Try again','','error')
                  }
                );
              }

            }//done adding equipments
          }//if walkinsales had an error , checks if its there
        },
        (error) => {
          Swal.fire('Error , processsing the sale.Try again','','error')
        }// walkinsale dataservices

      );
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        this.fullname = userObject.name + " " + userObject.surname;


      let newTrail = new FormData();
      newTrail.append('AuditEntryTypeID', '71');
      newTrail.append('Employee_ID', userObject.employee_ID);
      newTrail.append('Comment', "Captured Sale");

      this.data.GenerateAuditTrail(newTrail).subscribe(response => {
        Swal.fire('Sale has been captured  successfully','','success');
      this.router.navigate(['/sale'])
      });
    }
    else {
      console.log("loggedInUser is null");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while capturing sale.',
        confirmButtonText: 'OK'
      });
    }






    }

  }//end of checkout


  addToCartEquipment(equipment: EquipmentViewModel, quantityBought: number): void {
    // Check if a valid quantity is selected
    if (quantityBought > 0) {
      const existingCartItem = this.cartEquipment.find(item => item.EquipmentID === equipment.equipment_ID);

      if (
        quantityBought > equipment.quantity_On_Hand ||
        (existingCartItem &&
          quantityBought > equipment.quantity_On_Hand - existingCartItem.QuantityBought)
      ) {
        Swal.fire('The quantity added to cart is greater than quantity in stock', '', 'error');
      } else {
        if (existingCartItem) {
          existingCartItem.QuantityBought += quantityBought;
        } else {
          const cartItem = {
            EquipmentID: equipment.equipment_ID,
            QuantityBought: quantityBought,
            name: equipment.name,
            TotalAmount: quantityBought * equipment.amountWithVAT
          };
          this.cartEquipment.push(cartItem);
        }

        const equipmentIndex = this.equi.findIndex(e => e.equipment_ID === equipment.equipment_ID);
        console.log(equipmentIndex)
        if (equipmentIndex !== -1) {
          // Update the displayed quantity_On_Hand here
          this.equi[equipmentIndex].quantity_On_Hand -= quantityBought;

          // Trigger manual change detection
          this.cdRef.detectChanges();
        }

        // Update the quantityBoughtEquipment
        this.quantityBoughtEquipment[equipmentIndex] = 0;

        // Output the updated Cart and equipment array
        console.log('Updated Equipment Cart:', this.cartEquipment);
        console.log('Updated equipment array:', this.equi);

        // Calculate the total payment
        const totalAmountBooks = this.cartBook.reduce((total, item) => total + item.AmountTotal, 0);
        const totalAmountEquipment = this.cartEquipment.reduce((total, item) => total + item.TotalAmount, 0);
        this.TotalPayment = totalAmountBooks + totalAmountEquipment;
      }
    } else {
      Swal.fire('No quantity was selected. Please add quantity ');
    }
  }


  //vouchers
  voucher_Code: string = '';
  voucherExists: boolean = false;
  Voucher: Voucher[] = [];
  voucherpercent: number = 0;
  arrVouchers: Voucher[] = []
// RETRIEVE ALL VOUCHERS
getAllVouchers() {
  this.arrVouchers = [];
  this.data.GetAllTheVouchers().subscribe(result => {
    let listVouchers: any[] = result
    listVouchers.forEach((element) => {
      this.arrVouchers.push(element)
    });
  })
}




getVoucher() {
  const voucherCode = (document.querySelector('[name="voucher-code"]') as HTMLInputElement).value;

  if (voucherCode === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Voucher Code Error',
      text: 'Please enter a voucher code.',
      confirmButtonText: 'OK'
    });
  } else {
    // Filter through the retrieved vouchers to find a matching voucher
    const matchedVoucher = this.arrVouchers.find(voucher => voucher.voucher_Code === voucherCode);

    if (matchedVoucher) {
      Swal.fire({
        icon: 'info',
        title: 'Voucher Details',
        html: `
          <p><strong>Voucher Code:</strong> ${matchedVoucher.voucher_Code}</p>
          <p><strong>Expiry Date:</strong> ${matchedVoucher.expiry_Date}</p>
          <p><strong>Percent:</strong> ${matchedVoucher.percent}%</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Accept',
        cancelButtonText: 'Decline',
      }).then((result) => {
        if (result.isConfirmed) {
          // User accepted the voucher, store it in this.Voucher
          this.Voucher = [matchedVoucher];
          this.voucherExists = true;
        } else {
          // User declined the voucher
          Swal.fire({
            icon: 'info',
            title: 'Voucher Declined',
            text: 'You have declined the voucher.',
            confirmButtonText: 'OK'
          });
          // Reset the voucherExists flag
          this.voucherExists = false;
        }
      });
    } else {
      // Voucher not found, show an icon SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Voucher Not Found',
        text: 'No voucher found with the provided code.',
        confirmButtonText: 'OK'
      });
      // Reset the voucherExists flag
      this.voucherExists = false;
    }
  }
}


removeFromCartEquipment(equipment: any): void {
  const index = this.cartEquipment.findIndex(item => item.EquipmentID === equipment.EquipmentID);

  if (index !== -1) {
    this.cartEquipment.splice(index, 1);

    // Restore the quantity on hand to the original equipment array
    const originalEquipmentIndex = this.equipment.findIndex(e => e.equipment_ID === equipment.EquipmentID);
    if (originalEquipmentIndex !== -1) {
      this.equipment[originalEquipmentIndex].quantity_On_Hand += equipment.QuantityBought;
    }

    const totalAmountBooks = this.cartBook.reduce((total, item) => total + item.AmountTotal, 0);
    const totalAmountEquipment = this.cartEquipment.reduce((total, item) => total + item.TotalAmount, 0);
    this.TotalPayment = totalAmountBooks + totalAmountEquipment;

    console.log('Updated Equipment Cart after removing equipment:', this.cartEquipment);
    console.log('Updated equipment array after removing equipment:', this.equipment);
  }
}
removeFromCartBook(book: any): void {
  const index = this.cartBook.findIndex(item => item.BookID === book.BookID);

  if (index !== -1) {
    const removedBook = this.cartBook.splice(index, 1)[0];

    // Restore the quantity to the original books array
    const originalBookIndex = this.books.findIndex(b => b.$id === removedBook.BookID);
    if (originalBookIndex !== -1) {
      this.books[originalBookIndex].quantity += removedBook.QuantityBought;
    }

    const totalAmountBooks = this.cartBook.reduce((total, item) => total + item.AmountTotal, 0);
    const totalAmountEquipment = this.cartEquipment.reduce((total, item) => total + item.TotalAmount, 0);
    this.TotalPayment = totalAmountBooks + totalAmountEquipment;

    console.log('Updated Cart after removing book:', this.cartBook);
    console.log('Updated books array after removing book:', this.books);
  }
}


filteredEquipments: any[] = [];
filteredBooks:any[]=[];

SearchBooksEquipment() {
  const lowerCaseSearch = this.searchQuery?.trim()?.toLowerCase();

  if (!lowerCaseSearch) {
    this.filteredEquipments = this.equi;
    this.filteredBooks = this.books;
    return;
  }

  this.filteredEquipments = this.equi.filter(eq =>
    eq && (
      eq.name?.toLowerCase().includes(lowerCaseSearch) ||
      eq.description?.toLowerCase().includes(lowerCaseSearch) ||
      eq.equipment_Types?.name?.toLowerCase().includes(lowerCaseSearch) ||
      eq.module_Code?.toLowerCase().includes(lowerCaseSearch)
    )
  );

  this.filteredBooks = this.books.filter(b =>
    b && (
      b.authorName?.toLowerCase().includes(lowerCaseSearch) ||
      b.isbn?.includes(lowerCaseSearch) ||
      b.title?.toLowerCase().includes(lowerCaseSearch) ||
      b.edition?.toString()?.toLowerCase().includes(lowerCaseSearch) ||
      b.module_Code?.toString()?.toLowerCase().includes(lowerCaseSearch)
    )
  );

  // Rest of your code

  console.log('Search Query:', this.searchQuery);
  console.log('Filtered Equipments:', this.filteredEquipments);
  console.log('Filtered Books:', this.filteredBooks);
}


}
