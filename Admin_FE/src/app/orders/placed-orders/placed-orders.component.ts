import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderStatus, OrderLine } from 'src/app/shared/order';
import { Student } from 'src/app/shared/student';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-placed-orders',
  templateUrl: './placed-orders.component.html',
  styleUrls: ['./placed-orders.component.scss']
})
export class PlacedOrdersComponent implements OnInit {

  statusId: number = 1;
  orders: Order[] = [];
  arrStudents: Student[] = [];
  lines: OrderLine[] = [];
  upOrder: Order = new Order()

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

  processOrder(ref: string): void {
    Swal.fire({
      icon: 'question',
      title: 'Confirm',
      text: 'Are you sure you want to process this order?',
      showCancelButton: true,
      confirmButtonText: 'Process',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 2;
        this.data.ProcessOrder(ref, status, this.upOrder).subscribe(
          (response: any) => {
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '64');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Processed Order For Collection: #" + ref);

              this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
            }
            else {
              console.log("loggedInUser is null");
            }
            this.router.navigate(['/order-ready']);
            Swal.fire('Success', 'Order #' + ref + ' has been successfully processed.', 'success');

          },
          (error: any) => {
            Swal.fire('Error', 'An error occurred while processing the order.', 'error');
          }
        );
      }
    });
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



