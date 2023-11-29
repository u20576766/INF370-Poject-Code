import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookEvaluation } from 'src/app/shared/bookevaluation';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-write-evaluation',
  templateUrl: './write-evaluation.component.html',
  styleUrls: ['./write-evaluation.component.scss']
})
export class WriteEvaluationComponent implements OnInit {


  constructor(private activatedRoute: ActivatedRoute,private router:Router, private datservices:DataService) { }
    bookingID :number =0;
    storedlog: any | null = null;

  ngOnInit(): void {
      // Retrieve the passed ID from the route parameters
  this.activatedRoute.params.subscribe(params => {
    const passedId = params['id']; // Make sure 'id' matches the parameter name in your route
    console.log('Passed ID:', passedId);
    this.bookingID =passedId

    // You can now use the passedId in your component as needed
  });
  }


  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  LogResaleExchange()
  {
    const evaluationBookLogId = this.storedlog.evaluation_Book_Log_ID;
    console.log()
       this.router.navigate(['/logResale',evaluationBookLogId])
       // this.router.navigate(['/WriteEvaluation', this.books[0].bookingID])
  }



 Capture(){

  const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    const textarea = (document.querySelector('[name="myTextarea"]') as HTMLInputElement).value;


    if(textarea ==''){

      Swal.fire('Please provide evaluation  description of the books evaluated','','error');
    }
    else{
      Swal.fire({
        html:'<p> Please confirm that you have evaluated the books.<p>',
        title: 'Evaluation of Books',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: "green",
        confirmButtonText: 'Confirm',
        denyButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {

          const elog: BookEvaluation = {
            bookingId: this.bookingID,
            date: formattedDate,
            description: textarea
          };
          console.log(elog)

          this.datservices.writeEvaluationBookLog(elog).subscribe(
            (response) => {

              this.storedlog = response;
              //this.showSuccessCapture = true;
              console.log(this.storedlog);

              if (response.length !== 0){
                let newObject = window.localStorage.getItem("loggedInUser");
                if (newObject !== null) {
                  const userObject = JSON.parse(newObject);
                  const fullname = userObject.name + " " + userObject.surname;

                      let newTrail = new FormData();
                      newTrail.append('AuditEntryTypeID','68');
                      newTrail.append('Employee_ID', userObject.employee_ID);
                      newTrail.append('Comment', "Evaluated books.");

                      this.datservices.GenerateAuditTrail(newTrail).subscribe( response => {
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
                else {
                  console.log("loggedInUser is null");
                  
                } ;
              }

            },
            (error) => {
              // Handle error here
              Swal.fire('Error ocuured , capturing evaluation description.Try again','','error');
            }
          );


        }})


    }
  }
}


