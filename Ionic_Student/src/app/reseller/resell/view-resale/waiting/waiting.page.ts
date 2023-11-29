import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { bookedevaluation } from 'src/app/shared/resellerbookBookedEvalautio';
import { resellerbook } from 'src/app/shared/resellerbook';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { __await } from 'tslib';
import { DatePipe, CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.page.html',
  styleUrls: ['./waiting.page.scss'],
})
export class WaitingPage implements OnInit {
  isLoading: boolean = true; // Add a loading variable
  pendingBookings: any[] = [];


  constructor(private dataService: DataService, private router: Router, private alertController: AlertController,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event fired');
        this.refreshData();
      }
    });
  }

  ngOnInit() {
    this.refreshData()
  }

  refreshData() {
    this.getPendingBooks();
  }

  
  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);
  getPendingBooks() {
    this.dataService.getPendingBooking(this.sID).subscribe(
      (response) => {
        this.pendingBookings = response.$values;
        console.log('Response:', this.pendingBookings);
        this.applySearchFilter()

        if (response === '') {

          this.presentAlert('Info', 'No books were added to resale', 'info');

        }
      },
      (error) => {
        console.error(error);
        // Swal.fire('Error', 'An error occurred while retrieving the books.', 'error');
        this.presentAlert('Error', 'An error occurred while retrieving the books.', 'error');
      }
    );
  }



  deleteBook(resellerbookid: number) {
    console.log(resellerbookid);

    this.alertController
      .create({
        header: 'Confirm Delete',
        message: 'Are you sure you want to delete this book from resale?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // If the user clicked "No" or closed the dialog
              // No additional action needed
            },
          },
          {
            text: 'Yes',
            cssClass: 'danger',
            handler: () => {
              // If the user clicked "Yes"

              // Call the API to delete the book from resale
              this.dataService.deleteBookFromResale(resellerbookid).subscribe(
                (response) => {
                  if (
                    typeof response === 'string' &&
                    response.includes('Reseller book deleted successfully')
                  ) {
                    // Book deletion was successful
                    this.presentAlert(
                      'Book has been deleted from resale successfully',
                      'success'
                    );
                    this.getPendingBooks(); // Refresh the list of pending books
                  } else {
                    // Unexpected response from the server
                    this.presentAlert(
                      'Error',
                      'An error occurred while deleting the book from resale.',
                      'error'
                    );
                  }
                },
                (error) => {
                  console.error(error);
                  this.presentAlert(
                    'Error',
                    'An error occurred while deleting the book from resale.',
                    'error'
                  );
                }
              );
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  presentAlert(title: string, message: string, cssClass?: string) {
    this.alertController
      .create({
        header: title,
        message: message,
        cssClass: cssClass,
        buttons: ['OK'],
      })
      .then((alert) => {
        alert.present();
      });
  }


  searchQuery: string = '';
  filteredBooks: any[] = [];
  applySearchFilter() {
    if (!this.searchQuery.trim()) {
      this.filteredBooks = this.pendingBookings;
      return;
    }

    const lowerCaseSearch = this.searchQuery.trim().toLowerCase();

    this.filteredBooks = this.pendingBookings.filter(book =>

      book.isbn.toLowerCase().includes(lowerCaseSearch) ||
      book.title.toLowerCase().includes(lowerCaseSearch) ||

      book.estimatedPrice.toString().includes(lowerCaseSearch)

    );
  }

  formatDates() {
    for (const b of this.pendingBookings) {

      b.estimatedPrice = this.currencyPipe.transform(b.estimatedPrice, 'R', 'symbol', '1.2-2');
    }
  }


}


