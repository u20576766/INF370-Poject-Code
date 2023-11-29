import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuditTrail } from 'src/app/shared/audit-trail';
import { Student } from 'src/app/shared/student';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {

  constructor(private dataService: DataService, private router: Router, private snackbar: MatSnackBar) { }
  selectedValue!: string;

  formAddStudent: FormGroup = new FormGroup
    ({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      cell_Number: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      subscription: new FormControl('',Validators.required)

    })

  ngOnInit(): void { }

  assignSubscription() {
    const selectElement = document.getElementById('subscription') as HTMLSelectElement;
    this.selectedValue = selectElement.value;
  }

  addNewStudent() {
    if (!this.formAddStudent.valid) {
      //trigger your form controls
      Object.values(this.formAddStudent.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
        Swal.fire('Please fill in the form', '', 'info');
      });
    }
    else {
      let newStudent = new FormData();
      newStudent.append('name', this.formAddStudent.value.name);
      newStudent.append('surname', this.formAddStudent.value.surname);
      newStudent.append('cell_Number', this.formAddStudent.value.cell_Number);
      newStudent.append('email', this.formAddStudent.value.email);
      newStudent.append('subscribed', this.selectedValue);

      this.dataService.AddNewStudent(newStudent).subscribe(result => {

        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '49');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added new student '" + this.formAddStudent.value.name + " " + this.formAddStudent.value.surname + "'");

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
            Swal.fire('Success', 'Student has been successfully added.', 'success');
            this.router.navigate(['/students'])
          });
        }
        else {
          console.log("loggedInUser is null");
        }


      },
      (errorResponse) => {
        Swal.fire(errorResponse.error,'','error');
      });
    }

  }

  confirmAddStudent() {
    const email = this.formAddStudent.value.email;
  
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (emailRegex.test(email)) {
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you want to add this student?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
      }).then((result) => {
        if (result.isConfirmed) {
          this.addNewStudent();
        }
      });
    } else {
      Swal.fire('Please add a valid email address', '', 'error');
    }
  }
  

  abortAddStudent() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Student has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/students']);
    });
  }

}