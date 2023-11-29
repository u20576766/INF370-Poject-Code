import { Component, OnInit } from '@angular/core';
import { ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from 'src/app/shared/shoppingcart';
import { Book, Books } from 'src/app/shared/books';
import { DataService } from 'src/app/services/data.service';
import { Equipment } from 'src/app/shared/equipment2';
import { Voucher } from 'src/app/shared/voucher';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent {

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


  constructor(public data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.data.getShoppingCart(this.sID);
    this.GetShoppingCartBook(); // Fetch shopping cart books with ID 1
    this.GetAllBooks();
    this.GetShoppingCartEquipment();
    this.GetShoppingCartBook();
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
        });
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
        Swal.fire({
          icon: 'success',
          title: 'Voucher Applied',
          text: 'You can proceed to payment.',
          timer: 2000
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Voucher Error',
          text: 'Your voucher is invalid.',
          timer: 1500
        });
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
          this.router.navigate(['/PayPal']);
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
          this.router.navigate(['/PayPal']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
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
            });
          }
        );
      }
    });
  }


  hintButton() {
    Swal.fire({
      title: 'CheckOut Cart Tutorial',
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
        <p>To Check Out Your Cart: </p><br>
        <div class="row" style="marging:10px" >
          <div class="col-md-6">
            <p>1. If you<span style="font-weight:bold;"> do not have a voucher,</span> do not enter anything into the field but <span style="font-weight:bold;">please click the APPLY button</span>.</p>
          </div>
          <div class="col">
            <p>2. If you<span style="font-weight:bold;"> have a voucher,</span> enter in the voucher code you have and click the APPLY button.</p>
          </div>
        </div>
        </div class="row" style="marging:20px" >
          <a href="../assets/CheckOut/Screenshot (197).png" target="_blank" data-lightbox="images" data-title="Step 1">
            <img src="../assets/CheckOut/Screenshot (197).png" class="zoomable-image" style="width: 60%; height: auto;">
          </a>
        <div>
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
