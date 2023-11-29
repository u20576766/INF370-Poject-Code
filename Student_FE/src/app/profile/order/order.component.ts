import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderLine } from 'src/app/shared/order';
import { Student } from 'src/app/shared/student';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  statusId: number = 1;
  orders: Order[] = [];
  orders2: Order[] = [];
  orders3: Order[] = [];
  lines: OrderLine[] = [];

  studentID = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentID ?? '0', 10);

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getOrders();
    this.getOrders2();
    this.getOrders3();
    this.getOrderLines();
    console.log(this.orders)
    console.log(this.sID)
  }

  getOrders() {
    this.orders = [];
    this.data.GetOrdersByStatus(1).subscribe(
      (result) => {
        let orList: any[] = result;
        // Filter orders by studentID
        this.orders = orList.filter((order) => order.student_ID === this.sID);
        // Format order dates
        this.orders.forEach((order) => {
          order.order_Date = this.formatDate(order.order_Date);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching orders.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
  getOrderLines() {
    this.data.GetOrderLines().subscribe(
      (result) => {
        this.lines = result;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching order lines.',
          confirmButtonText: 'OK'
        });
      }
    );
  }


  getOrders2() {
    this.orders2 = [];
    this.data.GetOrdersByStatus(2).subscribe(
      (result) => {
        let orList: any[] = result;
        // Filter orders by studentID
        this.orders2 = orList.filter((order) => order.student_ID === this.sID);
        // Format order dates
        this.orders2.forEach((order) => {
          order.order_Date = this.formatDate(order.order_Date);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching orders.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  getOrders3() {
    this.orders3 = [];
    this.data.GetOrdersByStatus(3).subscribe(
      (result) => {
        let orList: any[] = result;
        // Filter orders by studentID
        this.orders3 = orList.filter((order) => order.student_ID === this.sID);
        // Format order dates
        this.orders3.forEach((order) => {
          order.order_Date = this.formatDate(order.order_Date);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching orders.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  // Function to format date as "dd Month yyyy"
  formatDate(dateString: string): string {
    const parts = dateString.split('-'); // Assuming the format is dd-mm-yyyy
    const day = String(parts[0]).padStart(2, '0');
    const month = String(parts[1]).padStart(2, '0');
    const year = parts[2];

    // Array of month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = parseInt(month, 10) - 1; // Subtract 1 since months are 0-based in JavaScript Date objects
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const monthName = monthNames[monthIndex];

    return `${day} ${monthName} ${formattedDate.getFullYear()}`;
  }
}
