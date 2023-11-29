import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BookItems, ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from '../shared/shoppingcart';
import { Book, Books } from '../shared/books';
import { DataService } from '../services/data.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {

  firstName: string = '';
  bookList: Book[] = [];
  shoppingCart1: ShoppingCart[] = [];
  shoppingCart: ShoppingCart | null = null;
  cartItemsBook: ShoppingCartBook[] = [];
  cartItemsEquipment: ShoppingCartEquipment[] = [];
  showProfile: boolean = true;

  constructor(
    public data: DataService,
    private toastController: ToastController,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('quantityInput', { static: false }) quantityInput!: ElementRef;
  @ViewChild('quantityInput2', { static: false }) quantityInput2!: ElementRef;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  cartCount: number = 0;
  name: string = "";

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
          this.presentToast('Cart Item Successfully Removed');
        },
        (error: any) => {
          console.error('Error adding book to cart:', error);
          this.presentAlert('Error', 'Failed to remove book from cart. Please try again later.');
          this.data.getShoppingCart(this.sID);
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
          this.presentToast('Cart Item Successfully Removed');
        },
        (error: any) => {
          console.error('Error adding book to cart:', error);
          this.presentAlert('Error', 'Failed to remove equipment from cart. Please try again later.');
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
        this.presentToast('Cart Item Quantity Increased Successfully');
      },
      (error) => {
        console.error('Error updating the book quantity:', error);
        this.presentAlert('Error', 'Failed to increase item quantity. Please try again later.');
      }
    )
  }

  AddUpEquip(equipid: number) {
    let ecart = new ShoppingCartEquipment()
    this.data.IncrementEquip(equipid, this.sID,  ecart).subscribe(
      result => {
        this.GetShoppingCartEquipment();
        this.data.getShoppingCart(this.sID);
        this.presentToast('Cart Item Quantity Increased Successfully');
      },
      (error) => {
        console.error('Error updating the equipment quantity:', error);
        this.presentAlert('Error', 'Failed to increase item quantity. Please try again later.');
      }
    )
  }


  // Decrease Items
  SubDownEquip(equipid: number) {
    let ecart = new ShoppingCartEquipment();
    this.data.DecrementEquip( equipid, this.sID,  ecart).subscribe(
      result => {
        this.GetShoppingCartEquipment();
        this.data.getShoppingCart(this.sID);
        this.presentToast('Cart Item Quantity Decreased Successfully.');
      },
      (error) => {
        console.error('Error updating the equipment quantity:', error);
        this.presentAlert('Error', 'Failed to decrease item quantity. Please try again later.');

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
        this.presentToast('Cart Item Quantity Decreased Successfully.');
      },
      (error) => {
        console.error('Error updating the book quantity:', error);
        this.presentAlert('Error', 'Failed to decrease item quantity. Please try again later.');
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
          this.presentAlert('Error', 'There was a format error while loading the books. Please try again later.');
        }
      },
      (error: any) => {
        // Handle error
        console.error('Error loading the books:', error);

        // Display an error message
        this.presentAlert('Error', 'There was an error while loading the books. Please try again later.');
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
        this.presentAlert('Error', 'There was a format error while loading the equipment. Please try again later.');
      }
    },
      (error: any) => {
        // Handle error
        console.error('Error loading the equipment:', error);

        // Display an error message
        this.presentAlert('Error', 'There was an error while loading the equipemt. Please try again later.');
      }
    );
  }

  ClearCart() {
    this.data.ClearCart(this.sID).subscribe(
      (response: any) => {
        this.presentAlert('Success', 'Cart has been cleared!');
      },
      (error: any) => {
        console.error('Error fetching shopping cart:', error);
        this.presentAlert('Error', 'Cart has not been cleared! Please try again later');
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
