import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Student } from 'src/app/shared/student';
import { StudentBookEvaluation } from 'src/app/shared/bookevaluation2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-no-booking-write-evaluation',
  templateUrl: './no-booking-write-evaluation.component.html',
  styleUrls: ['./no-booking-write-evaluation.component.scss']
})
export class NoBookingWriteEvaluationComponent {

  constructor(private data: DataService, private router: Router) { }
  retrievedstudent: Student[] = []
  showAddErrorRetrievingStudentsModal: boolean = false;
  showTextArea: boolean = false;
  showRetrievingStudentsModal: boolean = false;
  showErrorModal: boolean = false;
  showSuccessCapture: boolean = false;
  storedlog: any | null = null;
  showAddErrorAddingModal: boolean = false;
  studentsection:boolean = false;


  SearchStudent() {
    const students = (document.querySelector('[name="student"]') as HTMLInputElement).value;

    if (students == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Student surname error',
        text: 'Please provide student surname.',
        confirmButtonText: 'OK'
      });
    } else {
      this.data.SearchStudent(students).subscribe(
        result => {
          if (result && result.length > 0) {
            this.retrievedstudent = result;
            console.log(this.retrievedstudent);

            // Display students using SweetAlert
            const studentList = this.retrievedstudent.map(student => `${student.name} ${student.surname}`);
            Swal.fire({
              title: 'Select a student',
              input: 'select',
              inputOptions: Object.fromEntries(this.retrievedstudent.map((student, index) => [index, `${student.name} ${student.surname}`])),
              inputPlaceholder: 'Select a student',
              showCancelButton: true,
              confirmButtonText: 'Select',
              showLoaderOnConfirm: true,
              allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
                const selectedIndex = result.value;
                const selectedStudent = this.retrievedstudent[selectedIndex];
                this.selectStudent(selectedStudent);
               this.studentsection = true
               this.showTextArea = true
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No students found',
              text: 'No students were found with the provided surname.',
              confirmButtonText: 'OK'
            });
            console.log('Received null data from the API.');
          }
        },
        error => {
          console.error('An error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching students. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }







  selectedStudent: Student | null = null;
  selectedStudentID: number = 0;

  selectStudent(student: Student) {
    this.selectedStudent = student;
    this.selectedStudentID = student.student_ID;
  }



  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  LogResaleExchange() {
    const evaluationBookLogId = this.storedlog.evaluation_Book_Log_ID;
    console.log()
    this.router.navigate(['/logResale', evaluationBookLogId])
    // this.router.navigate(['/WriteEvaluation', this.books[0].bookingID])
  }


  Capture() {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    const textarea = (document.querySelector('[name="myTextarea"]') as HTMLInputElement).value;
    if (textarea == '') {
      Swal.fire('Please provide the evaluation  description of the books evaluated', '', 'warning');
    }
    else {
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you have evaluated the book sufficiently?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          const elog: StudentBookEvaluation = {
            bookingId: 0,
            date: formattedDate,
            description: textarea,
            student_ID: this.selectedStudentID // Use the selected student's ID
          };
          console.log(elog);
          this.data.StudentwriteEvaluationBookLog(elog).subscribe(
            (response) => {
              this.storedlog = response;

              if (response.length !== 0){
                let newObject = window.localStorage.getItem("loggedInUser");
                if (newObject !== null) {
                  const userObject = JSON.parse(newObject);
                  const fullname = userObject.name + " " + userObject.surname;

                      let newTrail = new FormData();
                      newTrail.append('AuditEntryTypeID','68');
                      newTrail.append('Employee_ID', userObject.employee_ID);
                      newTrail.append('Comment', "Evaluated walk-in books");

                      this.data.GenerateAuditTrail(newTrail).subscribe( response => {
                        Swal.fire({
                          title: 'Success',
                          html: `<p>Evaluation description has been added  successfully to the system.</p>
                          <p> Proceed to log resale exhange</p>`,
                          icon: 'success',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'Log resale exchange',
                          showCancelButton: true,
                          cancelButtonText: 'Cancel'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            this.LogResaleExchange(); // Call the addBook function if "Add Book" is clicked
                          }
                          else{
                            this.router.navigate(['/resale'])
                          }
                        });
                      });


            }

          }},
            (error) => {
              // Handle error here
              Swal.fire('Error', 'Capturing evaluation description was unsuccessful. Please try again', 'error');
            }
          );
        }
      })
    }
  }

  cancelEvaluation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Walk-In Book Evaluation has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/resale']);
    });
  }

}
