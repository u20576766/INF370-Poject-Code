import { Component, OnInit } from '@angular/core';
import { Book, Books } from '../shared/books';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  firstName: string = ''; // Initialize with an empty string
  greeting: string = '';
  bookList: Book[] = [];

  constructor(
    private data: DataService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.firstName = localStorage.getItem('firstName') || '';
    this.setGreeting();
    this.GetBooksPublishedLast5Years();
  }

  setGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greeting = 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      this.greeting = 'Good Evening';
    } else {
      this.greeting = 'Good Night';
    }
  }

  // Get Books Published in the Last 5 Years (Including Current Year)
  async GetBooksPublishedLast5Years() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    this.data.GetBooks().subscribe(
      (result: Books) => {
        // Filter books published in the last 5 years
        this.bookList = result.$values
          .filter(book => book.year >= startYear && book.year <= currentYear)
          .sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
      },
      (error: any) => {
        this.presentAlert('Error', 'There was a server error loading the books');
      }
    );
  }

  async ViewBookItem(bid: number) {
    const selectedBook = this.bookList.find(b => b.book_ID === bid);

    console.log(selectedBook);
    this.router.navigate(['/book-item', bid]);
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
