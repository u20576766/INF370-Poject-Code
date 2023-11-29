import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/shared/student';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditTrail } from 'src/app/shared/audit-trail';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute, private snackbar: MatSnackBar) { }

  //Creating the form 
  editedStudent: Student = new Student();

  formEditStudent: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    cell_Number: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    subscription: new FormControl('',Validators.required)
  })

  ngOnInit(): void {

    //get id
    this.activatedRoute.params.subscribe(params => {


      //get data by query
      this.dataService.GetSelectedStudent(params['id']).subscribe(response => {

        //place response in page
        this.editedStudent = response as Student;

        //place retrieved data in cells
        this.formEditStudent.controls['name'].setValue(this.editedStudent.name);
        this.formEditStudent.controls['surname'].setValue(this.editedStudent.surname);
        this.formEditStudent.controls['cell_Number'].setValue(this.editedStudent.cell_Number);
        this.formEditStudent.controls['email'].setValue(this.editedStudent.email);

        console.log(this.editedStudent.subscribed);

        if ((this.editedStudent.subscribed) == false) {
          this.formEditStudent.controls['subscription'].setValue('false');
        }
        else {
          this.formEditStudent.controls['subscription'].setValue('true');
        }
      })

    })

  }
  selectedValue!: string;

  assignSubscription() {
    const selectElement = document.getElementById('subscription') as HTMLSelectElement;
    this.selectedValue = selectElement.value;
  }

  editAStudent() {
    let selectedStudent = new Student();
    selectedStudent.name = this.formEditStudent.value.name;
    selectedStudent.surname = this.formEditStudent.value.surname;
    selectedStudent.cell_Number = this.formEditStudent.value.cell_Number;
    selectedStudent.email = this.formEditStudent.value.email;
    selectedStudent.subscribed = this.selectedValue === 'true';

    this.dataService.UpdateAStudent(this.editedStudent.student_ID, selectedStudent).subscribe((response: any) => {
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        const fullname = userObject.name + " " + userObject.surname;

        let newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '50');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Updated Student Details '" + selectedStudent.name + " " + selectedStudent.surname + "' ");

        this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          Swal.fire('Student has been updated successfully', '', 'success');
          this.router.navigate(['/students'])
        });
      }
      else {
        console.log("loggedInUser is null");
      }


    });

  }

  confirmUpStudent() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this student?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.editAStudent();
      }
    });
  }

  abortUpStudent() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update Student has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/students']);
    });
  }

}