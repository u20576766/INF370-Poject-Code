import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { schedulebook } from 'src/app/shared/schedulebook';
import { ScheduleDates } from 'src/app/shared/scheduledates';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-book-eval',
  templateUrl: './schedule-book-eval.component.html',
  styleUrls: ['./schedule-book-eval.component.scss']
})
export class ScheduleBookEvalComponent implements OnInit {
  cart: number = 5;


  //Changes
  constructor(private dataServices: DataService, private router: Router) { }
  datesToPick: ScheduleDates[] = [];
  selectedBookIds: number[] = [];
  pendingBookings: any[] = [];
  dateOptions: string[] = [];
  booksnumber: number = 0


  ngOnInit(): void {
    this.getScheduleDate();
    this.getPendingBooks();

  }
studentID = localStorage.getItem('studentId') || '';
sID = parseInt(this.studentID ?? '0', 10);


  getScheduleDate() {
    this.dataServices.getScheduleSlotsToBooked().subscribe(
      (response: any) => {
        if (response && response.$values) {
          this.datesToPick = response.$values;
          console.log(this.datesToPick);
        }
      },
      (error) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }
  getPendingBooks() {
   
    this.dataServices.getPendingBooking(this.sID).subscribe(
      response => {
        this.pendingBookings = response.$values;
      },
      error => {
        console.error(error);
      }
    );
  }


  //Getting the options of the dropdown

  selectedOption: number = 0;
  selectedDate: string | null = null; // Initialize to null

  onOptionChange(target: any) {
    const value = Number(target.value);
    this.selectedOption = value;
    this.selectedDate = this.getselectDate(value) || '';
  }

  //getting date to be displayed
  getselectDate(v: number): string | null {
    const selectedSchedule = this.datesToPick.find(schedule => schedule.scheduleId === v);
    return selectedSchedule ? selectedSchedule.date : null;
  }

  //checkboxes
  onCheckboxChange(resellerbookid: number, event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedBookIds.push(resellerbookid);
      this.booksnumber++
    } else {
      const index = this.selectedBookIds.indexOf(resellerbookid);
      if (index !== -1) {
        this.selectedBookIds.splice(index, 1);
      }
      this.booksnumber--;
    }
    console.log(this.selectedBookIds);
  }






  schedule() {
    if (this.selectedBookIds === null || this.selectedBookIds.length === 0 || this.selectedOption === null || this.selectedOption === 0) {
      Swal.fire('Please select date for evaluation and books to be evaluated', '', 'error');
    }
    else {
      Swal.fire({
        title: 'Please confirm to schedule evaluation ?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: "green",
        confirmButtonText: 'Yes, schedule.',
        denyButtonText: 'No, cancel.'
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          this.dataServices.createBooking(this.selectedOption).subscribe(
            (response) => {
              // Access and use specific properties from the response
              const bookingId = response.booking_ID;
              const referenceNumber = response.reference_Num;
              const numOfBooks = response.num_Of_Books;

              // Now you can use these properties as needed

              for (var i = 0; i < this.selectedBookIds.length; i++) {
                const bookdata: schedulebook = new schedulebook();
                bookdata.booking_Id = bookingId;
                bookdata.resellerBook_ID = this.selectedBookIds[i];

                this.dataServices.AddBooking(bookdata).subscribe(
                  (response) => {
                    // Handle the response or any necessary logic
                  },
                  (error) => {
                    console.error('Error adding booking:', error);
                    Swal.fire('Error', 'An error occurred while adding book to evaluation.', 'error');
                  }
                );
              }
              Swal.fire('Evaluation has been scheduled successfully', '', 'success');
              this.router.navigate(['/View-Resale'])


            },
            (error) => {
              console.error('Error creating booking:', error);
              Swal.fire('Error', 'An error occurred while schedule evaluation.', 'error');

            }
          );


        }
      })


    }



  }

  AbortSchedule() {
    Swal.fire({
      icon: 'warning',
      title: 'Cancel Evaluation Booking',
      text: 'Are you sure you want to abort booking an evaluation?',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/Check'])
      }
    });
  }


  

  deleteBook(resellerbookid: number) {
    console.log(resellerbookid);

    // Show a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure you want to delete this book from resale?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Yes',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicked "Yes"

        // Call the API to delete the book from resale
        this.dataServices.deleteBookFromResale(resellerbookid).subscribe(
          response => {
            if (typeof response === 'string' && response.includes('Reseller book deleted successfully')) {
              // Book deletion was successful
              Swal.fire('Book has been deleted from resale successfully', '', 'success');
              this.getPendingBooks(); // Refresh the list of pending books
            } else {
              // Unexpected response from the server
              Swal.fire('Error', 'An error occurred while deleting the book from resale.', 'error');
            }
          },
          error => {
            console.error(error);
            Swal.fire('Error', 'An error occurred while deleting the book from resale.', 'error');
          }
        );

      } else {
        // If the user clicked "No" or closed the dialog
        // No additional action needed
      }
    });
  }

  hintButton() {
    Swal.fire({
      title: 'Schedule Book Evaluation Tutorial',
      html: `
      <style>
                /* CSS for zooming images */
                .zoomable-image {
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .zoomable-image:hover {
                    transform: scale(1.2);
                }
            </style>
      <div class="container" style="text-align:center;">
        <p>To Scheduel A Book Evaluation you must: </p><br>
        <div class="row" style="marging:10px" >
          <div class="col">
            <p>1. Select a date you want to do an evaluation on and the books you want to evaluate on that day. <br><br>
            <a href="../assets/Schedule Evaluation/Screenshot (181).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Schedule Evaluation/Screenshot (181).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
          </div>
          <div class="col">
            <p>2. Confirm that you want to create the booking.<br><br>
            <a href="../assets/Schedule Evaluation/Screenshot (182).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Schedule Evaluation/Screenshot (182).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
          </div>
        </div>

        <div class="row" style="marging:10px">
          <div class="col">
            <p>3. A success messge will appear and the system will navigate to the view resale details page where you can view the schedules made.<br><br>
              <a href="../assets/Schedule Evaluation/Screenshot (183).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Schedule Evaluation/Screenshot (183).png" class="zoomable-image" style="width: 50%; height: auto;">
              </a>
            </p>
          </div>
        </div>
      </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 'auto',
      customClass: {
        container: 'zoomable-container'
      }
    });
  }


}










