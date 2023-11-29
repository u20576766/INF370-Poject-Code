import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router ,NavigationEnd} from '@angular/router';
import { bookedevaluation } from 'src/app/shared/resellerbookBookedEvalautio';
import { resellerbook } from 'src/app/shared/resellerbook';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-resale-details',
  templateUrl: './view-resale-details.component.html',
  styleUrls: ['./view-resale-details.component.scss']
})
export class ViewResaleDetailsComponent implements OnInit {
  constructor(private dataService: DataService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event fired');
        this.refreshData();
      }
    });
  }


  pendingBookings: any[] = []; // Initialize an array to store pending bookings
  bookid!: number;
  booksScheduled: any[] = [];
  completedBooks: any[] = [];

  refreshData() {
    this.getPendingBooks();
    this.getBooksScheduled();
    this.getScheduleCompletedBooks(); // Call the method to fetch completed books
  }

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

    ngOnInit(): void {
      this.refreshData()
    }

    getPendingBooks() {
      this.dataService.getPendingBooking(this.sID).subscribe(
        (response) => {
          this.pendingBookings = response.$values;
          console.log('Response:', this.pendingBookings);

          if (response === '') {
            Swal.fire('Info', 'No books added to resale', 'info');
          }
        },
        (error) => {
          console.error(error);
          Swal.fire('Error', 'An error occurred while retrieving the books.', 'error');
        }
      );
    }
    getBooksScheduled() {
      this.dataService.getEvaluationBooked(this.sID).subscribe(
        (response) => {
          this.booksScheduled = response.$values;

          if (response === '') {
            Swal.fire('Info', 'No books scheduled for evaluation', 'info');
          }
        },
        (error) => {
          console.error(error);
          Swal.fire('Error', 'An error occurred while retrieving the books.', 'error');
        }
      );
    }

    getScheduleCompletedBooks() {
      this.dataService.getEvaluationCompleted(this.sID).subscribe(
        (response) => {
          this.completedBooks = response.$values;
          console.log(response);

          if (response === '') {
            Swal.fire('Info', 'No books have been evaluated.', 'info');
          }
        },
        (error) => {
          console.error(error);
          Swal.fire('Error', 'An error occurred while retrieving the books.', 'error');
        }
      );
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
        this.dataService.deleteBookFromResale(resellerbookid).subscribe(
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





}
