import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { Book, Books } from 'src/app/shared/books';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderLine } from '../shared/order';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { PaymentResponse, PaymentInfo } from '../shared/payfast';

@Component({
  selector: 'app-payfast',
  templateUrl: './payfast.component.html',
  styleUrls: ['./payfast.component.scss']
})
export class PayfastComponent implements OnInit, OnDestroy {

  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  bookList: Book[] = [];
  order: Order[] = [];
  line: OrderLine[] = [];


  payfastInfo: PaymentInfo[] = [];
  response: PaymentResponse[] = [];

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  private paypalButtonInstance: any;

  constructor(public data: DataService, private router: Router) { }

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

  initializePayPalButton(): void {
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
          width: '100%',
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
              this.router.navigate(['/Home']);
              Swal.fire({
                title: 'Your Order Has Been Placed',
                text: 'Payment Approved. Transaction completed by ' + details.payer.name.given_name,
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/Home']);
                }
              });
            }
          });
        },
        onError: (error: any) => {
          this.router.navigate(['/Checkout']);
          Swal.fire({
            title: 'Payment Error',
            text: 'An error occurred during payment processing. Please try again later.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          });
          console.log(error);
        },
      }).render(this.paymentRef.nativeElement);
    });
  }

  payFastGate() {
    this.data.shoppingCart$.subscribe((items) => {
      const totalAmount = items.totalAmount;

      const firstName = localStorage.getItem('firstName') || '';
      const lastName = localStorage.getItem('lastName') || '';
      const studentId = localStorage.getItem('studentId') || '';

      const student = firstName + ' ' + lastName + ' #' + studentId;
      const studentEmail = localStorage.getItem('email') || '';
      const studentCell = localStorage.getItem('cell_Number') || '';

      const paymentInfo: PaymentInfo = {
        merchant_id: 0, // You can set the merchant_id as needed
        merchant_key: '', // You can set the merchant_key as needed
        amount: totalAmount,
        item_name: `Order for ${student}`,
        email_address: studentEmail,
        cell_number: studentCell,
        signature: '' // Leave this empty for now, it will be calculated on the server
      };

      console.log(paymentInfo);

      this.data.CreatePayment(paymentInfo).subscribe(
        (result: any) => {
          if (result && result.paymentInfo && result.redirectUrl) {
            localStorage.setItem('paymentInfo', JSON.stringify(result.paymentInfo));
            window.open(result.redirectUrl, '_blank');

            setTimeout(() => {
              this.CreateOrderLine(); // Call the CreateOrderLine() function after 90 seconds
              this.data.getShoppingCart(this.sID);
              this.router.navigate(['/Home']);
              Swal.fire({
                title: 'Your Order Is Being Placed...',
                text: 'Payfast Is Processing Your Payment.',
                icon: 'info',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/Home']);
                }
              });
            }, 90000); 

          } else {
            // Handle unexpected or incomplete response
            console.error('Unexpected or incomplete response from server:', result);
            Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: 'Unexpected or incomplete response from the server. Please try again later.',
              timer: 1500
            });
          }
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Please be patient as we try to resolve this. Try again later.',
            timer: 1500
          });
        }
      );

      
    });
  }



  cancelOrder() {
    Swal.fire({
      title: 'Confirm Cancel',
      text: 'Are you sure you want to cancel cart checkout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.data.CancelOrder(this.sID).subscribe(
          (result) => {
            Swal.fire({
              icon: 'success',
              title: 'Cancelled Checkout',
              text: 'Your checkout cart has been canceled.',
              timer: 1700,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/Cart']);
              this.router.navigate(['/Cart']);
            });
          },
          (error) => {
            console.log(error)
            Swal.fire({
              icon: 'success',
              title: 'Cancelled Checkout',
              text: 'Your checkout cart has been canceled.',
              timer: 1700,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/Cart']);
              this.router.navigate(['/Cart']);
            });
          }
        );
      }
    });
  }




  CreateOrderLine() {
    let lines = new OrderLine();
    Swal.fire({
      icon: 'info',
      title: 'Just a second',
      text: 'Please wait for the functionn to fully execute...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.data.CreateOrderLines(this.sID, lines).subscribe(
      (result) => {
        this.data.getShoppingCart(this.sID);
        location.reload();
        Swal.close(); // Close the loading dialog
        Swal.fire({
          icon: 'success',
          title: 'Checkout Successful',
          text: 'Your cart has been checked out.',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      },
      (error) => {
        console.log('There was a problem though...');
        this.router.navigate(['/Home']);
        Swal.close(); // Close the loading dialog
        Swal.fire({
          icon: 'success',
          title: 'Checkout Successful',
          text: 'Your cart has been checked out.',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    );


  }


  hintButton() {
    Swal.fire({
      title: 'Payment & Order Tutorial',
      html: `
      <style>
                /* CSS for zooming images */
                .zoomable-image {
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .zoomable-image:hover {
                    transform: scale(1.2);
                }
            </style>
      <div class="container" style="text-align:center;">
        <p>To Make A Payment & Place An Order: </p><br>
        <div class="row" style="marging:10px" >
          <div class="col">
            <p>1. Click the PayPal button and you will be redirected to the payment gateway to make a payment. Enter in your valid details and submit. <br><br>
            <a href="../assets/Payment and Order/Screenshot (199).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Payment and Order/Screenshot (199).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
          </div>
          <div class="col">
            <p>2. You will see a pop up saying the payment was success, please wait for the successful checkout message.<br><br>
            <a href="../assets/Payment and Order/Screenshot (204).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Payment and Order/Screenshot (204).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
          </div>
        </div>

        <div class="row" style="marging:10px">
          <div class="col">
            <p>3. The system will redirect you to the home page, where the Successful Checkout will be displayed.<br><br>
            <a href="../assets/Payment and Order/Screenshot (201).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Payment and Order/Screenshot (201).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
          <div class="col">
            <p>4. Go to your profile and then click the Orders buttons to view your order.<br><br>
            <a href="../assets/Payment and Order/Screenshot (202).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Payment and Order/Screenshot (202).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
        </div>

        <div class="row" style="marging:10px">
          <div class="col">
            <p>5. There you will see the newly placed order you just made.<br><br>
            <a href="../assets/Payment and Order/Screenshot (203).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Payment and Order/Screenshot (203).png" class="zoomable-image" style="width: 60%; height: auto;">
            </a>
            </p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 'auto',
      customClass: {
        container: 'zoomable-container'
      }
    });
  }




}

