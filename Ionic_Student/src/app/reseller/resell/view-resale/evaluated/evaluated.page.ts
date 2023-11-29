import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router ,NavigationEnd} from '@angular/router';
import { bookedevaluation } from 'src/app/shared/resellerbookBookedEvalautio';
import { resellerbook } from 'src/app/shared/resellerbook';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { __await } from 'tslib';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-evaluated',
  templateUrl: './evaluated.page.html',
  styleUrls: ['./evaluated.page.scss'],
})
export class EvaluatedPage implements OnInit {
  isLoading: boolean = true; // Add a loading variable
  completedBooks: any[] = [];

  constructor(private dataService: DataService, private router: Router,private alertController: AlertController,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event fired');
        this.refreshData();
      }
    });
  }

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

    ngOnInit(): void {
      this.refreshData()
    }


  refreshData() {
    this.getScheduleCompletedBooks(); // Call the method to fetch completed books
  }

  getScheduleCompletedBooks() {
    this.dataService.getEvaluationCompleted(this.sID).subscribe(
      (response) => {
        this.completedBooks = response.$values;
        console.log(response);
        this.applySearchFilter();

        if (response === '') {

          this.presentAlert('Info', 'No books have been evaluated.', 'info')
         // Swal.fire('Info', 'No books have been evaluated.', 'info');
        }
      },
      (error) => {
        console.error(error);
       // Swal.fire('Error', 'An error occurred while retrieving the books.', 'error');
       this.presentAlert('Error', 'An error occurred while retrieving the books.', 'error');

      }
    );
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
  filteredBooks :any[] = [];
  applySearchFilter()
  {
    if (!this.searchQuery.trim()) {
      this.filteredBooks = this.completedBooks;
      return;
    }

    const lowerCaseSearch = this.searchQuery.trim().toLowerCase();

    this.filteredBooks = this.completedBooks.filter( book  =>

      book.isbn.toLowerCase().includes(lowerCaseSearch) ||
      book.title.toLowerCase().includes(lowerCaseSearch) ||
      book.referenceNumber.toString().includes(lowerCaseSearch)


    );
  }

  formatDates() {
    for (const b of this.completedBooks) {
      b.date = this.datePipe.transform(b.date, 'MMMM d, y, h:mm:ss a');
      b.estimatedPrice = this.currencyPipe.transform(b.estimatedPrice, 'R', 'symbol', '1.2-2');
    }
  }



}
