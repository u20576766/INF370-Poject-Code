import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from 'src/app/shared/shoppingcart';
import { Book, Books } from 'src/app/shared/books';
import { DataService } from 'src/app/services/data.service';
import { Equipment } from 'src/app/shared/equipment2';
import { Voucher } from 'src/app/shared/voucher';
import { Order, OrderLine } from '../shared/order';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-pay-pal',
  templateUrl: './pay-pal.page.html',
  styleUrls: ['./pay-pal.page.scss'],
})
export class PayPalPage implements OnInit, OnDestroy {

  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  bookList: Book[] = [];
  order: Order[] = [];
  line: OrderLine[] = [];

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  private paypalButtonInstance: any;

  constructor(public data: DataService, private router: Router, private alertController: AlertController, private loadingController: LoadingController) { }

  ngOnInit(): void {
    this.data.getShoppingCart(this.sID);
    console.log(this.sID);
    this.initializePayPalButton();
  }

  ngOnDestroy(): void {
    if (this.paypalButtonInstance) {
      this.paypalButtonInstance.close();
    }
  }

  async initializePayPalButton() {
    this.data.shoppingCart$.subscribe((items) => {
      const totalAmount = items.totalAmount;
  
      if (this.paypalButtonInstance) {
        this.paypalButtonInstance.close();
      }
  
      this.paypalButtonInstance = window.paypal.Buttons({
        style: {
          layout: 'horizontal',
          color: 'blue',
          label: 'paypal',
          tagline: false,
        },
        createOrder: (data: any, actions: any) => {
          const exchangeRate = 0.053; // Exchange rate from ZAR to USD
          const amountInUSD = (totalAmount * exchangeRate).toFixed(2); // Convert and round to 2 decimal places
  
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amountInUSD, // Use the converted amount in USD
                currency_code: "USD"
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            if (details.status === 'COMPLETED') {
              this.CreateOrderLine();
              this.data.getShoppingCart(this.sID);
              this.router.navigate(['/home']);
              this.presentSuccessAlert('Your Order Has Been Placed', `Payment Approved. Transaction completed by ${details.payer.name.given_name}`);
            }
          });
        },
        onError: (error: any) => {
          this.router.navigate(['/checkout-cart']);
          this.presentErrorAlert('Payment Error', 'An error occurred during payment processing. Please try again later.');
          console.error(error);
        },
      }).render(this.paymentRef.nativeElement);
    });
  }
  
  async presentErrorAlert(title: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async cancelOrder(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Cancel',
      message: 'Are you sure you want to cancel cart checkout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.data.CancelOrder(this.sID).subscribe(
              (result) => {
                this.presentSuccessAlert('Cancelled Checkout', 'Your checkout cart has been canceled.');
                this.router.navigate(['/cart']);
              },
              (error) => {
                console.log(error);
                this.presentSuccessAlert('Cancelled Checkout', 'Your checkout cart has been canceled.');
                this.router.navigate(['/cart']);
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  async CreateOrderLine(): Promise<void> {
    let lines = new OrderLine();
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.data.CreateOrderLines(this.sID, lines).subscribe(
      (result) => {
        this.data.getShoppingCart(this.sID);
        location.reload();
        loading.dismiss();
        this.presentSuccessAlert('Checkout Successful', 'Your cart has been checked out.');
        window.location.reload();
      },
      (error) => {
        console.log('There was a problem though...');
        this.router.navigate(['/home']);
        loading.dismiss();
        this.presentSuccessAlert('Checkout Successful', 'Your cart has been checked out.');
        window.location.reload();
      }
    );
  }

  async presentSuccessAlert(title: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}