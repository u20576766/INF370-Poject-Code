import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Book } from 'src/app/shared/books';
import { Books } from 'src/app/shared/books';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Module } from 'src/app/shared/module';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {

  //cart: number = 0;
  searchQuery: string = "";
  searchisbn: string = "";
  bookList: Book[] = []
  mod: Module[] = [];
  selectedStudent!: Book;
  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.GetAllBooks();
    this.GetAllModules();

    console.log(this.bookList)
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

  goToEditBook(isbn: string) {
    this.router.navigate(['/update-book', isbn]);
    console.log(isbn)
  }





  searchBook() {
    if (this.searchQuery == "") {
      this.GetAllBooks();

    } else {
      this.searchisbn = this.searchQuery;
      this.data.GetBookByISBN(this.searchisbn).subscribe((res: any) => {
        // Convert res to an array if it's not already
        const booklist = Array.isArray(res) ? res : [res];
        this.bookList = booklist;
      });
    }
  }

  deleteBook(isbn: string) {
    // Show a confirmation dialog using SweetAlert
    Swal.fire({
      icon: 'warning',
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this book?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed the deletion, proceed to delete the book
        this.data.DeleteBook(isbn).subscribe({
          next: () => {
            console.log('Book deleted', isbn);
            // After successful deletion, remove the book from the local list
            this.bookList = this.bookList.filter((book) => book.isbn !== isbn);
  
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;
  
              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '19');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted book");
  
              this.data.GenerateAuditTrail(newTrail).subscribe(response => {
                // Show a success message using SweetAlert
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Book deleted successfully!'
                });
  
                window.location.reload();
              });
            }
          },
          error: (error) => {
            // Handle errors here
            console.error('Error deleting book', error);
  
            // Show an error message using SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the book.'
            });
          }
        });
      }
    });
  }
  
  // Get All Modules
  GetAllModules() {
    this.data.GetAllModules().subscribe(
      result => {
        this.mod = result;
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch modules. Please try again.'
        });
      }
    );
  }




  //New add
  StockTakeBook(isbn:string)
  {
         this.router.navigate(['stock-take/',isbn])
  }

  WriteOffBook(isbn :string)
  {
    this.router.navigate(['write-off/',isbn])
  }

}

