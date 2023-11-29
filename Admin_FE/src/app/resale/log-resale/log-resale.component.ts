import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResaleLog } from 'src/app/shared/resalelog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { parse } from 'date-fns';
@Component({
  selector: 'app-log-resale',
  templateUrl: './log-resale.component.html',
  styleUrls: ['./log-resale.component.scss']
})
export class LogResaleComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private dataservices: DataService, private router: Router) { }

  showErrorModal: boolean = false;
  evaluationid: number = 0;
  storedlog: any | null = null;
  showSuccessCapture: boolean = false;
  showAddErrorAddingModal: boolean = false;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const passedId = params['id']; // Make sure 'id' matches the parameter name in your route
      console.log('Passed ID:', passedId);
      this.evaluationid = passedId;
    })
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  logResale() {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    const textarea = (document.querySelector('[name="myTextarea"]') as HTMLInputElement).value;
    const amountEx = (document.querySelector('[name="AmountExchanged"]') as HTMLInputElement).value;
    console.log(parseFloat(amountEx));

    if (textarea == '') {
      Swal.fire('Please provide evaluation description of the books evaluated', '', 'warning');
    }
    else {
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you want to capture resale exchnage information?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          const exchange: ResaleLog = {
            date: formattedDate,
            description: textarea,
            amount_Exchanged: parseFloat(amountEx),
            evalaution_Book_Log_ID: this.evaluationid
          }

          console.log(exchange);
          this.dataservices.logResaleExchange(exchange).subscribe(
            (response) => {
              this.storedlog = response;
              this.showSuccessCapture = true;
              //console.log(this.storedlog);
               //then add info to audit trail
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        const fullname = userObject.name + " " + userObject.surname;

        let newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '69');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Logged resale exchange '" +"");

        this.dataservices.GenerateAuditTrail(newTrail).subscribe(response => {

          Swal.fire('Success', 'Resale exchange information  has been updated successfully', 'success');
          this.router.navigate(['/resale'])
        });
      }
      else {
        console.log("loggedInUser is null");
        Swal.fire('Error', 'Capturing of resale exchange was unsuccessful. Please try again', 'error');
      }

            }
            ,
            (error) => {
              // Handle error here
              Swal.fire('Error', 'Capturing of resale exchange was unsuccessful. Please try again', 'error');
            }
          );
        }
      })


    }
  }



  cancelExchange() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Log Resale Exchange has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/resale']);
    });
  }


}
