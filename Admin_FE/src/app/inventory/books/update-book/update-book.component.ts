import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Book } from 'src/app/shared/books';
import { Module } from 'src/app/shared/module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.scss']
})
export class UpdateBookComponent {
  constructor(private service: DataService, private route: Router, private activatedroute: ActivatedRoute) { }

  editedBook: Book = new Book();
  modules: Module[] = [];
  books: Book[] = [];
  isHidden: boolean = true;
  updateform: FormGroup = new FormGroup({
    ISBN: new FormControl('', [Validators.required]),
    Title: new FormControl('', [Validators.required]),
    Publisher_Name: new FormControl('', [Validators.required]),
    Author_Name: new FormControl('', [Validators.required]),
    Based_Price: new FormControl('', [Validators.required]),
    Edition: new FormControl('', [Validators.required]),
    Year: new FormControl('', [Validators.required]),
    Module_Code: new FormControl('', [Validators.required]),
    imageBase64: new FormControl('', [Validators.required]),
    Quantity: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.GetAllBooks();

    this.service.GetModules().subscribe((codes) => {
      this.modules = codes;
      console.log(this.modules);
    });

    this.activatedroute.params.subscribe((params) => {

      this.service.GetBookByISBN(params['id']).subscribe(response => {
        this.editedBook = response as Book;

        this.updateform.setValue({

          ISBN: this.editedBook.isbn,
          Title: this.editedBook.title,
          Publisher_Name: this.editedBook.publisherName,
          Author_Name: this.editedBook.authorName,
          Based_Price: this.editedBook.price,
          Edition: this.editedBook.edition,
          Year: this.editedBook.year,
          Module_Code: this.editedBook.module_Code,
          imageBase64: this.editedBook.imageBase64,
          Quantity: this.editedBook.quantity,
        });
      });
    });
  }

  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.updateform.patchValue({
          imageBase64: reader.result // Store the base64 representation of the image in the form
        });
      };
      reader.readAsDataURL(file);
    }
  }
  
  UpdateBook() {
    if (!this.updateform.value.ISBN || !this.updateform.value.Quantity || !this.updateform.value.imageBase64 || !this.updateform.value.Edition ||
      !this.updateform.value.Year || !this.updateform.value.Module_Code
    ) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }
    Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to update this book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the UpdateBook service method to update the book
        this.service.UpdateBook(this.editedBook.isbn, updatebook).subscribe(
          (res: any) => {
            let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '18');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated A Book, ISBN: " + this.updateform.value.ISBN);

          this.service.GenerateAuditTrail(newTrail).subscribe(response => {
          });
          Swal.fire('Success', 'Book updated successfully', 'success');
        }
          },
          (error) => {
            // Handle the success response
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed To Update Book',
            });
            this.route.navigate(['/books'])
          }
        );
      }
    });
    // Create an updated Book object from the form values
    let updatebook = new Book();
    updatebook.$id = this.updateform.value.$id;
    updatebook.isbn = this.updateform.value.ISBN;
    updatebook.quantity = parseInt(this.updateform.value.Quantity);
    updatebook.imageBase64 = this.updateform.value.imageBase64;
    updatebook.price = parseFloat(this.updateform.value.Based_Price);
    updatebook.title = this.updateform.value.Title;
    updatebook.publisherName = this.updateform.value.Publisher_Name;
    updatebook.module_Code = this.updateform.value.Module_Code;
    updatebook.edition = parseInt(this.updateform.value.Edition);
    updatebook.year = parseInt(this.updateform.value.Year);
    updatebook.authorName = this.updateform.value.Author_Name;



    const updateModel = { Book: updatebook };
    console.log(updatebook);

    // Call the UpdateBook service method to update the book
    this.service.UpdateBook(this.editedBook.isbn, updatebook).subscribe((res: any) => {
      if (res) {
        // Book added successfully
        Swal.fire({
          icon: 'success',
          title: 'Successful',
          text: 'Book added successfully!',
        });
        this.route.navigate(['/books']);
        return;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed To Update Book',
        });
      }
    });
  }



  GetAllBooks(): void {
    this.service.GetBooks().subscribe(
      (books) => {
        console.log('Books fetched:', books);
        this.books = books;
      },
      (error) => {
        console.error('Error fetching books:', error);
        // Optionally, you can display an error message to the user.
      }
    );
  }

  cancelUpBook() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update Book has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.route.navigate(['/books']);
    });
  }
}
