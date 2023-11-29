import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faculty } from 'src/app/shared/faculty';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-faculty',
  templateUrl: './update-faculty.component.html',
  styleUrls: ['./update-faculty.component.scss']
})
export class UpdateFacultyComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute, private snackbar: MatSnackBar) { }

  // Creating the form 
  upFaculty: Faculty = new Faculty();
  formUpdate: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Get id
    this.activated.params.subscribe(params => {
      // Get data by query
      this.data.GetFaculty(params['id']).subscribe(response => {
        // Place response in page
        this.upFaculty = response as Faculty;
        // Place retrieved data in cells
        this.formUpdate.controls['name'].setValue(this.upFaculty.faculty_Name);
      });
    });
  }

  UpdateFaculty() {
    let fac = new Faculty();
    fac.faculty_Name = this.formUpdate.value.name;

    this.data.updateFaculty(this.upFaculty.faculty_ID, fac).subscribe(
      (response: any) => {
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '24');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated A Faculty: " + this.formUpdate.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        Swal.fire({
          icon: 'success',
          title: 'Faculty Updated',
          text: 'Faculty has been successfully updated.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/faculty']);
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the faculty. Please try again later.',
          showConfirmButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  showUpdateAlert() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this faculty?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UpdateFaculty();
      }
    });
  }

  showAbortAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Cancelled',
      text: 'Update Faculty has been aborted.',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/faculty']);
    });
  }
}


