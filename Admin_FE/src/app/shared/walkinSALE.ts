export class WalkInSaleViewModel {
  totalAmount: number = 0;
  date: Date;
  student_ID: number = 0;
  voucher_ID: number = 0;
  employee_ID: number = 0;
  paymentType_ID: number = 0;

  constructor() {
   this.date = new Date(); // Initialize the date property with the current date and time
  }
}
