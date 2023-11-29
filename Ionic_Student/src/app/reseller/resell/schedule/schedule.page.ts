import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { schedulebook } from 'src/app/shared/schedulebook';
import { ScheduleDates } from 'src/app/shared/scheduledates';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  constructor(
    private dataServices: DataService,
    private router: Router,
    private alertController: AlertController
  ) {}

  datesToPick: ScheduleDates[] = [];
  selectedBookIds: number[] = [];
  pendingBookings: any[] = [];
  dateOptions: string[] = [];
  booksnumber: number = 0

  ngOnInit(): void {
    this.getScheduleDate();
    this.getPendingBooks();
  }

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
    const studentId = 1; // Replace with the actual student ID
    this.dataServices.getPendingBooking(studentId).subscribe(
      response => {
        this.pendingBookings = response.$values;
      },
      error => {
        console.error(error);
      }
    );
  }

  selectedOption: number = 0;
  selectedDate: string | null = null;

  onOptionChange(target: any) {
    const value = Number(target.value);
    this.selectedOption = value;
    this.selectedDate = this.getselectDate(value) || '';
  }

  getselectDate(v: number): string | null {
    const selectedSchedule = this.datesToPick.find(schedule => schedule.scheduleId === v);
    return selectedSchedule ? selectedSchedule.date : null;
  }

  onCheckboxChange(resellerbookid: number, event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedBookIds.push(resellerbookid);
      this.booksnumber++;
    } else {
      const index = this.selectedBookIds.indexOf(resellerbookid);
      if (index !== -1) {
        this.selectedBookIds.splice(index, 1);
      }
      this.booksnumber--;
    }
    console.log(this.selectedBookIds);
  }

  async schedule() {
    if (
      this.selectedBookIds === null ||
      this.selectedBookIds.length === 0 ||
      this.selectedOption === null ||
      this.selectedOption === 0
    ) {
      await this.showIonicAlert('Please select date for evaluation and books to be evaluated', 'Error');
    } else {
      const confirmationAlert = await this.alertController.create({
        header: 'Please confirm to schedule evaluation ?',
        buttons: [
          {
            text: 'No, cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // Handle cancel action
            }
          },
          {
            text: 'Yes, schedule.',
            cssClass: 'primary',
            handler: () => {
              this.dataServices.createBooking(this.selectedOption).subscribe(
                (response) => {
                  // Handle success
                  const bookingId = response.booking_ID;
                  const referenceNumber = response.reference_Num;
                  const numOfBooks = response.num_Of_Books;

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
                        this.showIonicAlert('Error', 'An error occurred while adding book to evaluation.');
                      }
                    );
                  }
                  this.showIonicAlert('Evaluation has been scheduled successfully', 'Success');
                  this.router.navigate(['/view-resale']);
                },
                (error) => {
                  console.error('Error creating booking:', error);
                  this.showIonicAlert('Error', 'An error occurred while schedule evaluation.');
                }
              );
            }
          }
        ]
      });

      await confirmationAlert.present();
    }
  }

  async AbortSchedule() {
    const confirmAbortAlert = await this.alertController.create({
      header: 'Cancel Evaluation Booking',
      message: 'Are you sure you want to abort booking an evaluation?',
      buttons: [
        {
          text: 'CONFIRM',
          cssClass: 'danger',
          handler: () => {
            this.router.navigate(['/resell']);
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Handle cancel action
          }
        }
      ]
    });

    await confirmAbortAlert.present();
  }

  async hintButton() {
    const tutorialAlert = await this.alertController.create({
      header: 'Resell Tutorial',
      message: '<iframe width="560" height="315" src="https://www.youtube.com/embed/MtRkxYeMa_Y?si=7xBWzEjoFmwsZgaQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      buttons: [
        {
          text: 'CLOSE',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ],
      cssClass: 'iframe-alert'
    });

    await tutorialAlert.present();
  }

  async showIonicAlert(message: string, title: string) {
    const ionicAlert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await ionicAlert.present();
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
              this.dataServices.deleteBookFromResale(resellerbookid).subscribe(
                (response) => {
                  if (
                    typeof response === 'string' &&
                    response.includes('Reseller book deleted successfully')
                  ) {
                    // Book deletion was successful
                    this.presentAlert(
                      'Success',
                      'Book has been deleted from resale successfully'
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



}
