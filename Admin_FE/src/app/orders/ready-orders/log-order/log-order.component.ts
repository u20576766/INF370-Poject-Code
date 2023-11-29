import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderStatus, OrderLine } from 'src/app/shared/order';
import { Student } from 'src/app/shared/student';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-order',
  templateUrl: './log-order.component.html',
  styleUrls: ['./log-order.component.scss']
})
export class LogOrderComponent {

  orders: Order[] = [];
  arrStudents: Student[] = [];
  lines: OrderLine[] = [];

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute) { }


  ngOnInit(): void {
    this.GetOrderById()
    this.getAllStudents(); 
    this.getOrderLines();
  }


  upOrder: Order = new Order();
  formUpdate: FormGroup = new FormGroup({
    coll: new FormControl('', [Validators.required])
  })


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

  GetOrderById() {
    //get id
    this.activated.params.subscribe(params => {
      //get data by query
      this.data.GetOrderByID(params['id']).subscribe(response => {

        //place response in page
        this.upOrder = response as Order;

        //place retrieved data in cells
        this.formUpdate.controls['coll'].setValue(this.upOrder.collector_Name);
      })

    })  
    //this.data.GetOrderByID(this.upOrder.order_ID).subscribe(
    //)
  }

  getStudentName(): string {
    const student = this.arrStudents.find(s => s.student_ID === this.upOrder.student_ID);
    return student ? `${student.name} ${student.surname}` : '';
  }

  getOrderLinesForOrder(orderID: number): OrderLine[] {
    return this.lines.filter(ol => ol.order_ID === orderID);
  }

  LogCollection() {
    let orderUP = new Order()

    this.data.LogCollection(this.upOrder.order_Reference_Number, this.formUpdate.value.coll, orderUP).subscribe(
      (response: any) => {
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '65');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Logged Order Collection: #" + this.upOrder.order_Reference_Number);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        this.router.navigate(['/order-collect']);
        Swal.fire('Success', 'Order #' + this.upOrder.order_Reference_Number + ' Collection has been successfully logged', 'success');
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to log order collection', 'error');
      }
    );
  }

  showUpdateConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to log a collection for this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.LogCollection();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Log Collection has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/order-ready']);
    });
  }
}
