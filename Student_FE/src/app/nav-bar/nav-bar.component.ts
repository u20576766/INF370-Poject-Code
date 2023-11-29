import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service'; // Import your DataService if needed
import Swal from 'sweetalert2'; // Import SweetAlert
import { Equipment, Equips } from '../shared/equipment2';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCart, ShoppingCartEquipment } from '../shared/shoppingcart';
import { Book, Books } from '../shared/books';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit {
  showProfile: boolean = false; // Set it to false initially
  equipList: Equipment[] = [];
  bookList: Book[] = [];
  showBooks: boolean = false;
  ShowEquipment: boolean = false;
  showResults: boolean = false;

  constructor(private authService: AuthService, public data: DataService, public router: Router) { } // Add DataService if needed

  ngOnInit() {
    this.GetAllBooks();
    this.GetAllEquipments();


    // Subscribe to the isAuthenticatedSubject in AuthService
    this.authService.isAuthenticatedSubject.subscribe((isAuthenticated) => {
      this.showProfile = isAuthenticated; // Update showProfile based on the user's authentication status
    });

    // Check the authentication status when the component initializes
    this.showProfile = this.authService.isAuthenticated(); // Use your AuthService's method to check if the user is authenticated
  }

  logout() {
    this.authService.logout();
  }

  GetAllEquipments() {
    this.data.GetEquipments().subscribe(
      (result: Equips) => {
        this.equipList = result.$values;
        this.Search()
      },
      (error: any) => {
        console.error('Error fetching equipment:', error);
        // Show error SweetAlert
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
        this.Search()
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

  searchText: string = '';
  filteredEquipments: any[] = [];
  filteredBooks: any[] = [];



  Search() {
    const lowerCaseSearch = this.searchText?.trim().toLocaleLowerCase();
    if (!this.searchText) {
      // Handle the case when the search text is empty
      this.showBooks = false;
      this.ShowEquipment = false;
      this.showResults = false;
      return;
    }

    this.filteredEquipments = this.equipList.filter(eq =>
      eq && (
        eq.name?.toLowerCase().includes(lowerCaseSearch) ||
        eq.description?.toLowerCase().includes(lowerCaseSearch) ||
        // eq.equipment_Types?.name?.toLowerCase().includes(lowerCaseSearch) ||
        eq.module_Code?.toLowerCase().includes(lowerCaseSearch)
      )
    );

    this.filteredBooks = this.bookList.filter(b =>
      b && (
        b.authorName?.toLowerCase().includes(lowerCaseSearch) ||
        b.isbn?.includes(lowerCaseSearch) ||
        b.title?.toLowerCase().includes(lowerCaseSearch) ||
        b.edition?.toString()?.toLowerCase().includes(lowerCaseSearch) ||
        b.year?.toString()?.toLowerCase().includes(lowerCaseSearch) ||
        b.module_Code?.toString()?.toLowerCase().includes(lowerCaseSearch)
      )
    );

    this.showResults = true;
    if (this.filteredBooks != null) {
      this.showBooks = true;
    }

    if (this.filteredEquipments != null) {
      this.ShowEquipment = true;
    }


  }

  ViewItem(eid: number) {
    const selectedEquip = this.equipList.find(e => e.equipment_ID === eid);

    console.log(selectedEquip)
    this.router.navigate(['/EquipmentItem', eid])
    this.showBooks = false;
    this.ShowEquipment = false;
    this.showResults = false;

  }

  ViewBookItem(bid: number) {
    const selectedBook = this.bookList.find(b => b.book_ID === bid);

    console.log(selectedBook)
    this.router.navigate(['/BookItem', bid])
    this.showBooks = false;
    this.ShowEquipment = false;
    this.showResults = false;

  }
}
