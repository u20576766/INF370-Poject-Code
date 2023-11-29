import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AlertController } from '@ionic/angular'; // Import Ionic's AlertController
import { Equipment, Equips } from '../shared/equipment2';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ShoppingCart, ShoppingCartBook, ShoppingCartEquipment } from '../shared/shoppingcart';
import { Book, Books } from '../shared/books';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  animations: [
    trigger('slideAnimation', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
})
export class ProductsPage implements OnInit {

  //Equipment
  equipList: Equipment[] = [];
  studentId = localStorage.getItem('studentId');
  sID = parseInt(this.studentId ?? '0', 10);

  //Book
  bookList: Book[] = []
  cart: ShoppingCart[] = []
  shoppingCart: ShoppingCart | null = null;

  //Animation
  quantity: number = 9;
  isLoading: boolean = true; // Add a loading variable
  selectedSegment: string = 'default';
  removeBooksRow: boolean = false; // Flag to remove "books" row
  searchText: string = "";

  constructor(
    private animationController: AnimationController,
    private data: DataService,
    private router: Router,
    private alertController: AlertController, // Use Ionic's AlertController
    private toastController: ToastController) { }

  ngOnInit() {
    this.GetAllEquipments();
    this.GetAllBooks();
    console.log(this.bookList, this.equipList)
  }

  // Function to handle the removal and animation of "books" row
  removeBooksRowAndSlideUp() {
    this.removeBooksRow = true; // Set the flag to remove "books" row

    // Wait for a brief moment before resetting the flag to allow animation
    setTimeout(() => {
      this.removeBooksRow = false;
    }, 300); // Adjust the timing to match your animation duration
  }


  search() {
    const lowerCaseSearch = this.searchText?.trim().toLowerCase();
  
    // If search text is empty, display all items
    if (!lowerCaseSearch || lowerCaseSearch === "") {
      this.GetAllBooks();
      this.GetAllEquipments();
      return;
    }
  
    // Filter books based on search text
    this.bookList = this.bookList.filter(b =>
      b && (
        b.title?.toLowerCase().includes(lowerCaseSearch) ||
        b.authorName?.toLowerCase().includes(lowerCaseSearch) ||
        b.isbn?.toLowerCase().includes(lowerCaseSearch) ||
        b.module_Code?.toLowerCase().includes(lowerCaseSearch)
        // Add other book properties for search as needed
      )
    );
  
    // Filter equipments based on search text
    this.equipList = this.equipList.filter(e =>
      e && (
        e.name?.toLowerCase().includes(lowerCaseSearch) ||
        e.description?.toLowerCase().includes(lowerCaseSearch) ||
        e.module_Code?.toLowerCase().includes(lowerCaseSearch)
        // Add other equipment properties for search as needed
      )
    );
  
    // If no search results found, restore the original lists
    if (this.bookList.length === 0 && this.equipList.length === 0) {
      this.GetAllBooks();
      this.GetAllEquipments();
      this.presentBAlert('Item Not Found', 'Not Item With Those Details Found');
    }
  }
  
  



  //Book Stuff
  // Get All Book
  GetAllBooks() {
    this.isLoading = true; // Set loading to true before the request
    this.data.GetBooks().subscribe(
      (result: Books) => {
        this.bookList = result.$values.sort((a, b) => a.title.localeCompare(b.title));
        this.isLoading = false; // Set loading to false after the request is complete
      },
      (error: any) => {
        this.presentAlert('Error', 'There was a server error loading the books');
        this.isLoading = false; // Ensure loading is set to false in case of an error
      }
    );
  }

  async AddToBCart(book_ID: number) {
    const selectedBook = this.bookList.find(book => book.book_ID === book_ID);
    console.log(selectedBook)

    if (selectedBook) {
      let bcart = new ShoppingCartBook();
      bcart.book_ID = selectedBook.book_ID;
      console.log(bcart.book_ID)

      // Calculate the total price based on the book's price from the bookList
      const totalPrice = selectedBook.price * bcart.quantity;
      console.log(selectedBook.price);

      // Set other properties of bcart if needed

      try {
        await this.data.AddBookToCart(this.sID, bcart).toPromise();
        this.data.getShoppingCart(this.sID);
        this.presentBToast('Book Added To Cart Successfully');
      } catch (error) {
        console.error('Error adding book to cart:', error);
        this.presentBAlert('Server Error', 'Failed to add book to cart');
      }
    } else {
      console.error('Book not found in bookList');
      // Handle the case where the book is not found in the bookList
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




  //Equipment Stuff
  async AddToECart(equipment_ID: number) {
    const selectedEquip = this.equipList.find(e => e.equipment_ID === equipment_ID);
    console.log(selectedEquip)

    if (selectedEquip) {
      let ecart = new ShoppingCartEquipment();
      ecart.equipment_ID = selectedEquip.equipment_ID;
      console.log(ecart.equipment_ID)


      // Calculate the total price based on the book's price from the bookList
      const totalPrice = selectedEquip.amountWithVAT * ecart.quantity;

      this.data.AddEquipToCart(this.sID, ecart).subscribe(
        (response: any) => {
          this.data.getShoppingCart(this.sID);
          this.presentToast('Equipment Added To Cart Successfully');
        },
        (error: any) => {
          console.error('Error adding equipment to cart:', error);
          this.presentAlert('Server Error', 'Failed to add equipment to cart');
        }
      );
    } else {
      console.error('Equipment not found in equipList');
      this.presentAlert('Error', 'Equipment not found in the list');
    }
  }

  GetAllEquipments() {
    this.isLoading = true; // Set loading to true before the request
    this.data.GetEquipments().subscribe(
      (result: Equips) => {
        this.equipList = result.$values;
        this.isLoading = false; // Set loading to false after the request is complete
      },
      (error: any) => {
        console.error('Error fetching equipment:', error);
        this.presentAlert('Error', 'There was a server error loading the equipment');
        this.isLoading = false; // Ensure loading is set to false in case of an error
      }
    );
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top', // Display the toast at the top
      color: 'success' // Customize the color as needed
    });
    await toast.present();
  }

  ViewItem(eid: number) {
    this.router.navigate(['/equip-item', eid])
    const selectedEquip = this.equipList.find(e => e.equipment_ID === eid);
    console.log(selectedEquip)
    
  }

  ViewBookItem(bid: number) {
    this.router.navigate(['/book-item', bid])
    const selectedBook = this.bookList.find(b => b.book_ID === bid);
    console.log(selectedBook)
  }
}

