import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCart } from '../shared/shoppingcart';
import { Book, Books } from '../shared/books';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  shoppingCart: ShoppingCart | null = null;
  bookList: Book[] = []

  constructor(private data: DataService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.GetBooksPublishedLast5Years();
  }

  showProfile: boolean = true;
  useSharedFunction(): void {
    this.data.toggleProfile();
  }

  // Get Books Published in the Last 5 Years (Including Current Year)
  GetBooksPublishedLast5Years() {
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a server error loading the books',
        });
      }
    );
  }



  ViewBookItem(bid: number) {
    const selectedBook = this.bookList.find(b => b.book_ID === bid);

    console.log(selectedBook)
    this.router.navigate(['/BookItem', bid])

  }

}

