import { Binary } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {
  intervalValue!: number;
  selectedTimeUnit!: string;
  message!: string;
  isButtonDisabled: boolean = false;

  constructor(private dataService: DataService, private router: Router) {
    this.intervalValue = 1;
    this.selectedTimeUnit = 'Minutes';
  }

  ngOnInit(): void {
    // Initialization logic here
  }

  setBackupInterval() {
    // Determine the interval in milliseconds based on the selected time unit
    let intervalMilliseconds = this.intervalValue;

    switch (this.selectedTimeUnit) {
      case 'Seconds':
        intervalMilliseconds *= 1000; // Convert seconds to milliseconds
        break;
      case 'Minutes':
        intervalMilliseconds *= 60000; // Convert minutes to milliseconds
        break;
      case 'Hours':
        intervalMilliseconds *= 3600000; // Convert hours to milliseconds
        break;
      case 'Days':
        intervalMilliseconds *= 86400000; // Convert days to milliseconds
        break;
      case 'Weeks':
        intervalMilliseconds *= 7 * 86400000; // Convert weeks to milliseconds (7 days per week)
        break;
      case 'Months':
        // Assume a month is 30 days for simplicity (adjust as needed)
        intervalMilliseconds *= 30 * 86400000; // Convert months to milliseconds
        break;
      default:
        // Handle other cases or show an error message
        break;
    }

    // Display a success message
    Swal.fire({
      icon: 'success',
      title: 'Backup Interval Set',
      text: `Interval successfully set to ${this.intervalValue} ${this.selectedTimeUnit}`,
    });

    this.isButtonDisabled = true;

    // Make a backup request with the calculated interval
    this.dataService.setBackupInterval(intervalMilliseconds)
      .subscribe(
        (response: string) => {
          this.message = response;
          console.log(response);
        },
        (error: any) => {
          console.error(error);
          this.message = 'Failed to update backup interval.';
        }
      );
  }

  //Backup function 
  BackupData() {
    const loadingAlert = Swal.fire({
      icon: 'info',
      title: 'Backing Up Data',
      text: 'Please wait...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    this.dataService.BackupData().subscribe(
      () => {

      },
      () => {
        loadingAlert.then(); // Close the loading alert
        Swal.fire({
          icon: 'success',
          title: 'Backup Successful',
          text: 'Data backup completed successfully.',
          confirmButtonText: 'OK'
        });


        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '1');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Backed Up System Data ");

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          });
        }


      }
    );
  }
  //Restore function
  RestoreData() {
    console.log('Starting data restore...');
    const loadingAlert = Swal.fire({
      icon: 'info',
      title: 'Restoring Data',
      text: 'Please wait...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    this.dataService.RestoreData().subscribe(

      () => {
        loadingAlert.then((result: SweetAlertResult<any>) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            return;
          }
          console.log('Data restore successful!');
          Swal.fire({
            icon: 'success',
            title: 'Data Restore Successful',
            text: 'Data Restore completed successfully.',
            confirmButtonText: 'OK'
          });


          let newObject = window.localStorage.getItem("loggedInUser");
          if (newObject !== null) {
            const userObject = JSON.parse(newObject);
            const fullname = userObject.name + " " + userObject.surname;

            let newTrail = new FormData();
            newTrail.append('AuditEntryTypeID', '2');
            newTrail.append('Employee_ID', userObject.employee_ID);
            newTrail.append('Comment', "Restored Data");

            this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
            });
          }

        });
      },
      (error) => {
        loadingAlert.then((result: SweetAlertResult<any>) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            return;
          }
          Swal.fire({
            icon: 'error',
            title: 'Data Restore Error',
            text: 'An error occurred while restoring data.',
            confirmButtonText: 'OK'
          });
        });
      }
    );
  }

}
