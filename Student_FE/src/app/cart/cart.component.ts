import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BookItems, ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from '../shared/shoppingcart';
import { Book, Books } from '../shared/books';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  bookList: Book[] = [];
  shoppingCart1: ShoppingCart[] = [];
  shoppingCart: ShoppingCart | null = null;
  cartItemsBook: ShoppingCartBook[] = [];
  cartItemsEquipment: ShoppingCartEquipment[] = [];
  showProfile: boolean = true;

  name: string = "";

  constructor(public data: DataService, private snackbar: MatSnackBar, private cdr: ChangeDetectorRef) { }

  // Reference to the input field element
  @ViewChild('quantityInput', { static: false }) quantityInput!: ElementRef;
  @ViewChild('quantityInput2', { static: false }) quantityInput2!: ElementRef;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);



  
  cartCount: number = 0;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {

    this.name = localStorage.getItem('firstName') + " " + localStorage.getItem('lastName');
    this.GetShoppingCartBook();
    this.GetShoppingCartEquipment();

    const cartSubscription = this.data.shoppingCart$.subscribe((cart: { count: number }) => {
      this.cartCount = cart.count;
    });

    this.subscriptions.push(cartSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  DeleteBookItem(bookid: number) {
    const index = this.cartItemsBook.findIndex(book => book.book_ID === bookid);
    if (index !== -1) {
      this.cartItemsBook.splice(index, 1);

      this.data.DeleteBookItem(this.sID, bookid).subscribe(
        (response: any) => {
          this.GetShoppingCartBook();
          this.data.getShoppingCart(this.sID);
          this.snackbar.open('Cart Item Successfully Removed', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
        },
        (error: any) => {
          console.error('Error adding book to cart:', error);

          // Error notification using SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove book from cart. Please try again later.',
            timer: 1500
          });
        }
      );
    } 
  }

  DeleteEquipItem(equipid: number) {
    const index = this.cartItemsEquipment.findIndex(equip => equip.equipment_ID === equipid);
    if (index !== -1) {
      this.cartItemsEquipment.splice(index, 1);

      this.data.DeleteEuipItem(this.sID, equipid).subscribe(
        (response: any) => {
          this.GetShoppingCartEquipment(); // Recalculate item total
          this.data.getShoppingCart(this.sID);
          this.snackbar.open('Cart Item Successfully Removed', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
        },
        (error: any) => {
          console.error('Error adding book to cart:', error);

          // Error notification using SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove equipment from cart. Please try again later.',
            timer: 1500
          });

          this.data.getShoppingCart(this.sID);
        }
      );
    }
  }


  //Increase Items
  AddUpBook(bookid: number) {
    let bcart = new ShoppingCartBook()
    this.data.IncrementBook(bookid, this.sID, bcart).subscribe(
      result => {
        this.GetShoppingCartBook();
        this.data.getShoppingCart(this.sID);
        this.snackbar.open('Cart Item Quantity Increased Successfully', 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      (error) => {
        console.error('Error updating the book quantity:', error);

        // Error notification using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update item quantity. Please try again later.',
          timer: 1500
        });
      }
    )
  }

  AddUpEquip(equipid: number) {
    let ecart = new ShoppingCartEquipment()
    this.data.IncrementEquip(equipid, this.sID,  ecart).subscribe(
      (result) => {
        this.GetShoppingCartEquipment();
        this.data.getShoppingCart(this.sID);
        this.snackbar.open('Cart Item Quantity Increased Successfully.', 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      (error) => {
        console.error('Error updating the equipment quantity:', error);

        // Error notification using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update item quantity. Please try again later.',
          timer: 1500
        });
      }
    )
  }


  // Decrease Items
  SubDownEquip(equipid: number) {
    let ecart = new ShoppingCartEquipment();
    this.data.DecrementEquip( equipid, this.sID,  ecart).subscribe(
      (result) => {
        this.GetShoppingCartEquipment();
        this.data.getShoppingCart(this.sID);
        this.snackbar.open('Cart Item Quantity Decreased Successfully.', 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      (error) => {
        console.error('Error updating the equipment quantity:', error);

        // Error notification using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update item quantity. Please try again later.',
          timer: 1500
        });

        // You may want to add additional error handling here.
      }
    );
  }


  SubDownBook(bookid: number) {
    let bcart = new ShoppingCartBook()
    this.data.DecrementBook(bookid, this.sID, bcart).subscribe(
      result => {
        this.GetShoppingCartBook();
        this.data.getShoppingCart(this.sID);
        this.snackbar.open('Cart Item Quantity Decreased Successfully', 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      (error) => {
        console.error('Error updating the book quantity:', error);

        // Error notification using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update item quantity. Please try again later.',
          timer: 1500
        });
      }
    )
  }




  GetShoppingCartBook() {
    this.data.GetShoppingCartBook(this.sID).subscribe(
      (result: any) => { // Use 'any' type for now
        if (result && result.$values) {
          this.cartItemsBook = result.$values;
        } else {
          // Handle unexpected response
          console.error('Invalid response format:', result);

          // Display an error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid response format when loading the books',
            timer: 1500
          });
        }
      },
      (error: any) => {
        // Handle error
        console.error('Error loading the books:', error);

        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a server error loading the books',
          timer: 1500
        });
      }
    );
  }



  GetShoppingCartEquipment() {
    this.data.GetShoppingCartEquipment(this.sID).subscribe((result: any) => {
      if (result && result.$values) {
        this.cartItemsEquipment = result.$values;
      } else {
        // Handle unexpected response
        console.error('Invalid response format:', result);

        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid response format when loading the equipment',
          timer: 1500
        });
      }
    },
      (error: any) => {
        // Handle error
        console.error('Error loading the equipment:', error);

        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a server error loading the equipment',
          timer: 1500
        });
      }
    );
  }

  ClearCart() {
    this.data.ClearCart(this.sID).subscribe(
      (response: any) => {
        this.data.getShoppingCart(this.sID);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Cart has been cleared!',
          timer: 1500
        });
      },
      (error: any) => {
        console.error('Error fetching shopping cart:', error);

        this.data.getShoppingCart(this.sID);
        Swal.fire({
          icon: 'error',
          title: 'Clear Cart Error',
          text: 'Cart has not been cleared! Please try again later.',
          timer: 1500
        });
      }
    );
  }

  calculateItemTotal(shoppingCartItem: any, book: any): number {
    const quantity = shoppingCartItem.quantity;
    const pricePerItem = shoppingCartItem.price;
    return quantity * pricePerItem;
  }

  useSharedFunction(): void {
    this.data.toggleProfile();
  }

  generateInvoicePDF() {
    window.print();
  }


  private handleApiError(error: any, errorMessage: string): void {
    console.error(errorMessage, error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      timer: 1500
    });
  }
}
