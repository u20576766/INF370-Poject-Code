import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Book, Books } from 'src/app/shared/books';
import { ShoppingCart, ShoppingCartBook } from 'src/app/shared/shoppingcart';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.page.html',
  styleUrls: ['./book-item.page.scss'],
})
export class BookItemPage implements OnInit {
  studentId = localStorage.getItem('studentId');
  sID = parseInt(this.studentId ?? '0', 10);
  bookList: Book[] = []
  cart: ShoppingCart[] = []
  shoppingCart: ShoppingCart | null = null;
  selectedBook: Book | undefined
  passedID: any | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private router: Router,
    private alertController: AlertController, // Use Ionic's AlertController
    private toastController: ToastController) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      const id = +params['id'];
      this.passedID = id;

      this.GetAllBooks();
    });

  }

  //Book Stuff
  // Get All Book
  GetAllBooks() {
    this.data.GetBooks().subscribe(
      (result: Books) => {
        this.bookList = result.$values;
        this.selectedBook = this.bookList.find(b => b.book_ID == this.passedID);
        console.log('Book:',this.selectedBook)
      },
      (error: any) => {
        this.presentBAlert('Error', 'There was a server error loading the books');
      }
    );
  }

  async AddToBCart(book_ID: number) {
    const selectedBook = this.bookList.find(book => book.book_ID === book_ID);

    if (selectedBook) {
      let bcart = new ShoppingCartBook();
      bcart.book_ID = selectedBook.book_ID;

      try {
        await this.data.AddBookToCart(this.sID, bcart).toPromise();
        this.data.getShoppingCart(this.sID);
        this.presentBToast('Book Added To Cart Successfully');
      } catch (error) {
        console.error('Error adding book to cart:', error);
        this.presentBAlert('Error', 'Failed to add book to cart. Please try again later.');
      }
    } else {
      console.error('Book not found in bookList');
      this.presentBAlert('Error', 'Selected book not found. Please try again.');
    }
  }


  async presentBAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentBToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top', // Set the position to 'top' to display at the top
      color: 'success'
    });
    await toast.present();
  }



}
