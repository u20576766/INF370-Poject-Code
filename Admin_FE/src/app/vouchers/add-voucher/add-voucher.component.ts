import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuditTrail } from 'src/app/shared/audit-trail';
import { Voucher } from 'src/app/shared/voucher';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.scss']
})
export class AddVoucherComponent {

  constructor(private dataService: DataService, private router: Router) { }

  formAddVoucher: FormGroup = new FormGroup
    ({
      percent: new FormControl('', [Validators.required]),
      expiry_Date: new FormControl('', [Validators.required]),
    })
  strDay: string = "";
  strMonth: string = "";
  newDate: string = "";
  currentDate = new Date();
  minimumDate: string = "";


  ngOnInit(): void {
    //setting up the current date to limit the date picker in the format datepicker takes (yyyy-MM-dd)
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1; // Months are zero-based, so you need to add 1
    const day = this.currentDate.getDate();
    if (day < 10) {
      this.strDay = "0" + day.toString();
    }
    else {
      this.strDay = day.toString()
    };

    if (month < 10) {
      this.strMonth = "0" + month.toString();
    }
    else {
      this.strMonth = month.toString();
    }
    this.minimumDate = year.toString() + "-" + this.strMonth + "-" + this.strDay;

  }


  AbortAddVoucher() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Voucher has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/vouchers']);
    });
  }

  ConfirmAddVoucher() {

    if ((!this.formAddVoucher.valid)) {
      //trigger your form controls
      Object.values(this.formAddVoucher.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }

        Swal.fire('Please fill in the form', '', 'info');
      });
    }
    if (((this.formAddVoucher.value.percent) > 99) || ((this.formAddVoucher.value.percent) < 1)) {
      Swal.fire('Please fill in a numeric value between 1 and 100', '', 'error');
    }
    else {
      Swal.fire({
        icon: 'question',
        title: 'Please confirm that these are the correct voucher details',
        text: "Discount: " + this.formAddVoucher.value.percent + "% | Expiry Date: " + this.formAddVoucher.value.expiry_Date,
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          this.addNewVoucher();
        }
      })
    }


  }

  addNewVoucher() {
    this.strDay = "";
    this.strMonth = "";
    //retrieving selected date and converting it to the string format of the DB
    const dateString = this.formAddVoucher.value.expiry_Date;
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    if (day < 10) {
      this.strDay = "0" + day.toString();
    }
    else {
      this.strDay = day.toString()
    };

    if (month < 10) {
      this.strMonth = "0" + month.toString();
    }
    else {
      this.strMonth = month.toString();
    }
    this.newDate = this.strDay + "-" + this.strMonth + "-" + year.toString();

    let newVoucher = new Voucher();
    newVoucher.percent = this.formAddVoucher.value.percent;
    newVoucher.expiry_Date = this.newDate;

    this.dataService.AddNewVoucher(newVoucher).subscribe(result => {

      //then add info to audit trail
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        const fullname = userObject.name + " " + userObject.surname;

        let newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '33');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Added new voucher '" + newVoucher.percent + "% Off, Expires " + newVoucher.expiry_Date + "' ");

        this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          Swal.fire('Voucher has been added successfully', '', 'success');
          this.router.navigate(['/vouchers'])
        });
      }
      else {
        console.log("loggedInUser is null");
      }
    },
      (errorResponse) => {
        if (errorResponse.error) {
          const errorMessage = errorResponse.error;
          if (errorMessage == 'A voucher with same details already exists') {
            Swal.fire('A voucher with same details already exists', '', 'error');
            this.router.navigate(['/vouchers'])
          }

        }
      });
  }



}