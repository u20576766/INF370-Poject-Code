import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Book } from 'src/app/shared/books';
import { Module } from 'src/app/shared/module';
import { PrescribedBook } from 'src/app/shared/prescribedbook';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  bookForm: FormGroup;
  isConfirmationModalOpen: boolean = false;
  isHidden: boolean = true;
  book: Book = new Book();
  isbn: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  modules: Module[] = [];
  pres: PrescribedBook[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) {
    this.bookForm = this.fb.group({
      isbn: [''],
      title: ['', Validators.required],
      publisherName: [''],
      authorName: [''],
      price: ['', Validators.min(0)],
      edition: Number,
      year: Number,
      module_Code: [''],
      quantity: [''],
      imageBase64: ''
    });
  }

  ngOnInit() {
    this.GetAllModules();
    console.log(this.modules);
  }
  

  toggleHiddenDiv() {
    const isbnValue = this.bookForm.get('isbn')!.value;
    
    // Validation
    if (!isbnValue) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter an ISBN.',
      });
      return;
    }
    if (isbnValue.length !== 13) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ISBN must be exactly 13 digits long.',
      });
      return;
    }
    
    if (isbnValue) {
      console.log('Fetching prescribed book for ISBN:', isbnValue);
      this.dataService.GetPrescribedBookByISBN(isbnValue).subscribe((result) => {
        console.log('searchPrescribedBooks result:', result);
        if (result && result.length > 0) {
          console.log('Prescribed book found. Initializing book details...');
          const prescribedBook = result[0];

          // Fetch module information using module ID
          this.dataService.getModuleById(prescribedBook.module_ID).subscribe(
            (moduleInfo) => {
              if (moduleInfo) {
                // Use getModuleCode method to get the module code
                const module_Code = this.getModuleCode(prescribedBook.module_ID);

                this.book = {
                  isbn: prescribedBook.isbn,
                  title: prescribedBook.title,
                  publisherName: prescribedBook.publisherName,
                  authorName: prescribedBook.authorName,
                  edition: prescribedBook.edition,
                  year: prescribedBook.year,
                  price: 0,
                  module_Code: module_Code,
                  quantity: 0,
                  imageBase64: '' // Initialize image as an empty string
                };
                this.isHidden = false;
                this.errorMessage = '';
                this.successMessage = '';
              } else {
                // Handle error fetching module information
              }
            });
        } else {
          console.log('No prescribed book found for ISBN:', isbnValue);
          this.errorMessage = 'No book found with the entered ISBN.';
          this.successMessage = '';
        }
      });
    }
  }

  // Method to get module code based on module ID
  getModuleCode(module_ID: number): string {
    const module = this.modules.find((m: Module) => m.module_ID === module_ID);
    return module ? module.module_Code.toString() : 'N/A';
  }

  GetAllModules(): void {
    this.dataService.GetAllModules().subscribe(
      (modules) => {
        console.log('Modules fetched:', modules); // Check if data is being retrieved
        this.modules = modules;
      },
      (error) => {
        console.log('Error fetching modules:', error);
      }
    );
  }

  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.bookForm.patchValue({
          imageBase64: reader.result // Store the base64 representation of the image in the form
        });
      };
      reader.readAsDataURL(file);
    }
  }
  
  




  AddBook() {
    console.log('AddBook function called');

    // Check if the form is valid
    if (!this.bookForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the required fields',
      });
      return;
    }
    
    // Get data from the form
    const formData = this.bookForm.value;
    formData.isbn = this.book.isbn; // Set the ISBN from the previously fetched data
    
    // Set default values for price and quantity
    if (formData.price.toString().length > 4) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Price must be at least 4 digits.',
      });
      return;
    }
    console.log('Form Data:', formData);


    // Make the API call to add the book
    this.dataService.AddBook(formData).subscribe(
      (response) => {
        console.log('API Response:', response);
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '17');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added new book, ISBN: " + formData.isbn);

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          });
        }

        if (response) {
          // Book added successfully
          Swal.fire({
            icon: 'success',
            title: 'Successful',
            text: 'Book added successfully!',
          });
          this.resetForm();
          this.route.navigate(['/books']);
          return;
        } else {
          
          // Handling if the response indicates failure
          this.errorMessage = 'Failed to add book. Please try again.';
        }
      },
    );
  }

  resetForm() {
    this.book = new Book();
    this.isbn = '';
    this.isHidden = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelAddBook() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Book has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.route.navigate(['/books']);
    });
  }

  confirmAddBook() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.AddBook();
      }
    });
  }
}
