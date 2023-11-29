import { Component, OnInit } from '@angular/core';
import { ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from 'src/app/shared/shoppingcart';
import { Book, Books } from 'src/app/shared/books';
import { DataService } from 'src/app/services/data.service';
import { Equipment } from 'src/app/shared/equipment2';
import { Voucher } from 'src/app/shared/voucher';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.page.html',
  styleUrls: ['./checkout-cart.page.scss'],
})
export class CheckoutCartPage implements OnInit {

  bookList: Book[] = [];
  vou: Voucher[] = [];
  voucherCode: string = "";
  equipList: Equipment[] = []
  shoppingCart1: ShoppingCart[] = [];
  shoppingCart: ShoppingCart | null = null;
  cartItemsBook: ShoppingCartBook[] = [];
  cartItemsEquipment: ShoppingCartEquipment[] = [];
  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  constructor(public data: DataService, private router: Router, private alertController: AlertController) { }

  ngOnInit(): void {
    this.data.getShoppingCart(this.sID);
    this.GetShoppingCartBook(); // Fetch shopping cart books with ID 1
    this.GetAllBooks();
    this.GetShoppingCartEquipment();
    this.GetShoppingCartBook();
  }

  GetShoppingCartBook() {
    this.data.GetShoppingCartBook(this.sID).subscribe(
      (result: any) => {
        if (result && result.$values) {
          this.cartItemsBook = result.$values;
        } else {
          // Handle unexpected response
          console.error('Invalid response format:', result);

          // Display an error message
          this.presentErrorAlert('Invalid response format when loading the books');
        }
      },
      (error: any) => {
        // Handle error
        console.error('Error loading the books:', error);

        // Display an error message
        this.presentErrorAlert('There was a server error loading the books');
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
        this.presentErrorAlert('Invalid response format when loading the equipment');
      }
    },
      (error: any) => {
        // Handle error
        console.error('Error loading the equipment:', error);

        // Display an error message
        this.presentErrorAlert('There was a server error loading the equipment');
      }
    );
  }

  //Get All Book
  GetAllBooks() {
    this.data.GetBooks().subscribe(
      (result: Books) => {
        this.bookList = result.$values;
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  calculateDiscount() {
    console.log(this.voucherCode)
    this.data.GetDiscountAmount(this.voucherCode, this.sID).subscribe(
      (result) => {
        // Reload the shopping cart to get updated values
        this.data.getShoppingCart(this.sID); // Remove this line
        console.log(this.data.getShoppingCart(this.sID));
        this.presentSuccessAlert('Voucher Applied. You can proceed to payment.');
      },
      (error) => {
        console.error(error);
        this.presentErrorAlert('Your voucher is invalid.');
      }
    );
  }

  calculateDiscount2() {
    if (this.voucherCode == '') {
      this.data.GetDiscountAmount(this.voucherCode, this.sID).subscribe(
        (result) => {
          // Reload the shopping cart to get updated values
          this.data.getShoppingCart(this.sID); // Remove this line
          console.log(this.data.getShoppingCart(this.sID));
          this.router.navigate(['/pay-pal']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    else {
      this.data.GetDiscountAmount(this.voucherCode, this.sID).subscribe(
        (result) => {
          // Reload the shopping cart to get updated values
          this.data.getShoppingCart(this.sID); // Remove this line
          console.log(this.data.getShoppingCart(this.sID));
          this.router.navigate(['/pay-pal']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  cancelOrder() {
    this.presentConfirmationAlert('Confirm Cancel', 'Are you sure you want to cancel cart checkout?')
      .then((result) => {
        if (result && result.role === 'cancel') {
          // The cancel button was clicked
          this.presentSuccessAlert('Cancelled Checkout. Your checkout cart has been canceled.');
          this.router.navigate(['/cart']);
        } else if (result) {
          // The confirm button was clicked (role is undefined for the confirm button)
          this.data.CancelOrder(this.sID).subscribe(
            (result) => {
              this.presentSuccessAlert('Cancelled Checkout. Your checkout cart has been canceled.');
              this.router.navigate(['/cart']);
            },
            (error) => {
              console.log(error);
              this.presentSuccessAlert('Cancelled Checkout. Your checkout cart has been canceled.');
              this.router.navigate(['/cart']);
            }
          );
        }
      });
  }
  

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentConfirmationAlert(title: string, message: string): Promise<any> {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return { role: 'cancel' }; // Resolves the promise with the role 'cancel' when 'No' is clicked
          },
        },
        {
          text: 'Yes',
          handler: () => {
            return { role: 'confirm' }; // Resolves the promise with the role 'confirm' when 'Yes' is clicked
          },
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    return result;
  }
  
  
}