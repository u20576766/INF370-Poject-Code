import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; // Import SweetAlert
import { Book, Books } from '../shared/books';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from '../shared/shoppingcart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss']
})
export class BookItemComponent {

  studentId = localStorage.getItem('studentId');
  sID = parseInt(this.studentId ?? '0', 10);
  bookList: Book[] = []
  cart: ShoppingCart[] = []
  shoppingCart: ShoppingCart | null = null;
  selectedBook: Book | undefined
  passedID :any | null = null;

  constructor(private activatedRoute:ActivatedRoute,private data: DataService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.passedID = id;

      this.GetAllBooks();
    });

  }

  //Get All Book
  GetAllBooks() {
    this.data.GetBooks().subscribe(
      (result: Books) => {
        this.bookList = result.$values;
        console.log(this.passedID)
        this.selectedBook = this.bookList.find(b => b.book_ID == this.passedID);
        console.log('Book:',this.selectedBook)
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a server error loading the book',
        });
      }
    );
  }

  AddToCart(book_ID: number) {
    const selectedBook = this.bookList.find(book => book.book_ID === book_ID);
  
    if (selectedBook) {
      let bcart = new ShoppingCartBook();
      bcart.book_ID = selectedBook.book_ID;
  
      // Calculate the total price based on the book's price from the bookList
      const totalPrice = selectedBook.price * bcart.quantity;
      console.log(selectedBook.price);
  
      // Set other properties of bcart if needed
  
      this.data.AddBookToCart(this.sID, bcart).subscribe(
        (response: any) => {
          this.data.getShoppingCart(this.sID);
          Swal.fire({
            icon: 'success',
            title: 'Book Added To Cart',
            timer: 1500
          });
        },
        (error: any) => {
          console.error('Error adding book to cart:', error);
          // Show error SweetAler
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Failed to add book to cart',
            timer: 1500
          });
        }
      );
    } else {
      console.error('Book not found in bookList');
      // Handle the case where the book is not found in the bookList
    }
  }
}
