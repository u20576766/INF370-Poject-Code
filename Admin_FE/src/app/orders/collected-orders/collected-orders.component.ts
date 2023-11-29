import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderStatus, OrderLine } from 'src/app/shared/order';
import { Student } from 'src/app/shared/student';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collected-orders',
  templateUrl: './collected-orders.component.html',
  styleUrls: ['./collected-orders.component.scss']
})
export class CollectedOrdersComponent implements OnInit {

  statusId: number = 3; // Corrected variable name: statusId
  orderStatus: OrderStatus[] = []; // Corrected variable name: orders
  orders: Order[] = [];
  arrStudents: Student[] = [];
  lines: OrderLine[]= [];

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getAllStudents();
    this.getOrders();
    this.getOrderLines();
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
