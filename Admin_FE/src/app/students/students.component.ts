import { Component, OnInit } from '@angular/core';
import { Student } from '../shared/student';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { AuditTrail } from '../shared/audit-trail';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  arrStudents: Student[] = []
  selectedStudent!: Student;
  constructor(private dataService: DataService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllStudents()
  }

  //Get All Suppliers
  getAllStudents() {
    this.arrStudents = [];
    this.dataService.GetAllTheStudents().subscribe(result => {
      let listStudents: any[] = result
      listStudents.forEach((element) => {
        this.arrStudents.push(element)
      });
    })
  }

  searchQuery: string = "";
  searchStudent() {
    if (this.searchQuery.trim() === "") {
      this.getAllStudents();
    }
    else {
      this.dataService.SearchStudent(this.searchQuery).subscribe(result => {
        let listStudents: any[] = result;
        this.arrStudents = [];
        listStudents.forEach((element) => {
          this.arrStudents.push(element);
        });
      }
      );
    }
  }

  goToEditStudent(student_ID: Number) {
    this.router.navigate(['/edit-student', student_ID]);
  }

  deleteStudent(student_ID: number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this student?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) //if user clicked yes
      {
        //get selected student with same id
        this.dataService.GetSelectedStudent(student_ID).subscribe(response => {
          //capture the retrieved student details
          this.selectedStudent = response as Student;

          //delete student
          this.dataService.DeleteStudent(student_ID).subscribe((response: any) => {
            //then add info to audit trail
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '51');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted Student '" + this.selectedStudent.name + " " + this.selectedStudent.surname + "'");

              this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                this.dataService.GenerateAuditTrail(newTrail);
                this.getAllStudents();
              });
            }
            else {
              console.log("loggedInUser is null");
            }

          })
        })
      }
      else if ((result.isDenied) || (result.isDismissed))//if user clicked no
      {
        Swal.fire('Delete Student has been aborted', '', 'error')
      }
    })


  }

}