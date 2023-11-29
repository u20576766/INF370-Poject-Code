import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderStatus, OrderLine } from 'src/app/shared/order';
import { Student } from 'src/app/shared/student';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ready-orders',
  templateUrl: './ready-orders.component.html',
  styleUrls: ['./ready-orders.component.scss']
})
export class ReadyOrdersComponent {
  
  statusId: number = 2;
  orders: Order[] = [];
  arrStudents: Student[] = [];
  lines: OrderLine[] = [];
  upOrder: Order = new Order()

  LoggedInName: string = "";
  empType: number = 0;
  employeeID: number = 0;

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getAllStudents();
    this.getOrders();
    this.getOrderLines();

    //User Information
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.employeeID = userObject.employee_ID;
      this.LoggedInName = userObject.name + " " + userObject.surname;
      this.empType = userObject.employee_Type_ID;
    }
  }

  getOrders() {
    this.orders = [];
    this.data.GetOrdersByStatus(this.statusId).subscribe(result => {
      let orList: any[] = result;
      this.orders = orList;
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

  getAllStudents() {
    this.data.GetAllTheStudents().subscribe(
      (result) => {
        this.arrStudents = result;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching students.',
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

  countItemsWithOrderID(orderID: number): number {
    return this.lines.filter(ol => ol.order_ID === orderID).length;
  }

  // UpdateSupplier page link
  updateOrder(orderID: number) {
    this.router.navigate(['/updateOrder', orderID]);
  }

  // Search for orders
  searchInput: string = "";
  searchOrder() {
    if (this.searchInput.trim() === "") {
      this.getOrders();
    } 
    else {
      this.data.SearchOrder(this.searchInput).subscribe(result => {
        let orList: any[] = result;
        this.orders = [];
        orList.forEach((element) => {
          this.orders.push(element);
        });
      });
    }
  }
}
