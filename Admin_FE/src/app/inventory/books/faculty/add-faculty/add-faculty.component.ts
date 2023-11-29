import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faculty } from 'src/app/shared/faculty';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-faculty',
  templateUrl: './add-faculty.component.html',
  styleUrls: ['./add-faculty.component.scss']
})
export class AddFacultyComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private snackbar: MatSnackBar) { }

  formAdd: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {}

  showAddConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this faculty?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addFaculty();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      icon: 'error',
      title: 'Cancelled',
      text: 'Add Faculty has been aborted.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/faculty']);
    });
  }

  addFaculty() {
    let fac = new Faculty();
    fac.faculty_Name = this.formAdd.value.name;

    this.data.AddFaculty(fac).subscribe((response: any) => {
      let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '23');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added A New Faculty: " + this.formAdd.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
      Swal.fire({
        icon: 'success',
        title: 'Faculty Added',
        text: 'Faculty has been added to the system.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        this.router.navigate(['/faculty']);
      });
    });
  }
}
