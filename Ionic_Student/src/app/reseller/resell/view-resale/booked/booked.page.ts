import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router ,NavigationEnd} from '@angular/router';
import { bookedevaluation } from 'src/app/shared/resellerbookBookedEvalautio';
import { resellerbook } from 'src/app/shared/resellerbook';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-booked',
  templateUrl: './booked.page.html',
  styleUrls: ['./booked.page.scss'],
})
export class BookedPage implements OnInit {

  isLoading: boolean = true; // Add a loading variable

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

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

    ngOnInit(): void {
      this.refreshData()
    }

    refreshData() {

      this.getBooksScheduled();

    }
    booksScheduled: any[] = [];




    getBooksScheduled() {
      this.dataService.getEvaluationBooked(this.sID).subscribe(
        (response) => {
          this.booksScheduled = response.$values;

          this.applySearchFilter();
          if (response === '') {
            this.presentAlert('Info', 'No books scheduled for evaluation', 'info');
          }
        },
        (error) => {
          console.error(error);
          this.presentAlert('Error', 'An error occurred while retrieving the books.', 'error');
        }
      );
    }

    async presentAlert(title: string, message: string, cssClass: string) {
      const alert = await this.alertController.create({
        header: title,
        message: message,
        cssClass: cssClass,
        buttons: ['OK']
      });

      await alert.present();
    }
    searchQuery: string = '';
    filteredBooks :any[] = [];
    applySearchFilter()
    {
      if (!this.searchQuery.trim()) {
        this.filteredBooks = this.booksScheduled;
        return;
      }

      const lowerCaseSearch = this.searchQuery.trim().toLowerCase();

      this.filteredBooks = this.booksScheduled.filter( book  =>

        book.isbn.toLowerCase().includes(lowerCaseSearch) ||
        book.title.toLowerCase().includes(lowerCaseSearch) ||
        book.date.toLowerCase().includes(lowerCaseSearch) ||
        book.estimatedPrice.toString().includes(lowerCaseSearch) ||
        book.referenceNumber.toString().includes(lowerCaseSearch)

      );
    }

    formatDates() {
      for (const b of this.booksScheduled) {
        b.date = this.datePipe.transform(b.date, 'MMMM d, y, h:mm:ss a');
        b.estimatedPrice = this.currencyPipe.transform(b.estimatedPrice, 'R', 'symbol', '1.2-2');
      }
    }

    }

