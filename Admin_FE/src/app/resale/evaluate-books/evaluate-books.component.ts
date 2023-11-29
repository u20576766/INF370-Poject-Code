import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Book } from 'src/app/shared/evaluatebook';
// Assuming this is the correct path to your Book interface
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluate-books',
  templateUrl: './evaluate-books.component.html',
  styleUrls: ['./evaluate-books.component.scss']
})
export class EvaluateBooksComponent {
  books: Book[] = []; // Using the Book interface here
  showBookInformation: boolean = false;
  showImages: boolean = false;
  selectedBook: Book | undefined;
  showAddErrorModal:boolean = false;
  bookingid:number =0;

  constructor(private data: DataService,private router:Router) {}

  CheckEvaluationBooking() {
    const refInput = (document.querySelector('[name="ref"]') as HTMLInputElement).value;

    this.data.evaluateBook(refInput).subscribe(
      response => {
        this.books = response.$values;
        console.log(this.books);
        this.showBookInformation = true;

      },
      error => {
        Swal.fire('No booking allocated with the provided booking reference number.','','success');
      }
    );

    this.bookingid = this.books[0].bookingID;
    console.log(this.bookingid)
  }

 


 Confirm(){
  Swal.fire({
    html:'<p> Please confirm that you have evaluated the books.<p>',
    title: 'Evaluation of Books',
    showConfirmButton: true,
    showDenyButton: true,
    confirmButtonColor: "green",
    confirmButtonText: 'Confirm',
    denyButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) //if user clicked yes
    {

      for (var i = 0; i < this.books.length; i++) {
        if (this.books[i].resellerBookId) { // Check if resellerBookID is defined

          this.data.bookEvaluated(this.books[i].resellerBookId).subscribe(
            (response:any)=>
            {
                 if(typeof response=='string' && response.includes('Successfully evaluated'))
                 {
                      console.log('Book evaluated')
                 }
                 else{
                  Swal.fire('Capture books evaluation was unsuccessful.Try again','','error');
                 }
            }
          )

        }
      }

       this.router.navigate(['/WriteEvaluation', this.books[0].bookingID])


    }})
 }



 onFormSubmit() {
  const refInput = (document.querySelector('[name="ref"]') as HTMLInputElement).value;

  // Check if the booking reference is empty or invalid
  if (!refInput) {
    Swal.fire('Please enter a valid booking reference number.', '', 'warning');
  } else {
    this.data.evaluateBook(refInput).subscribe(
      response => {
        this.books = response.$values;
        console.log(this.books);
        this.showBookInformation = true;
      },
      error => {
        Swal.fire('No booking allocated with the provided booking reference number.', '', 'success');
      }
    );

    this.bookingid = this.books[0].bookingID;
    console.log(this.bookingid);
  }
}
openImageModal(bookID: number) {
  this.selectedBook = this.books.find(book => book.resellerBookId === bookID);

  if (this.selectedBook) {
    // Display a custom SweetAlert modal with book images
    Swal.fire({
      title: `Images for Book: ${this.selectedBook.title}`,
      html: `
        <h5>Open Image:</h5>
        <img src="${this.selectedBook.imageOpen}" alt="Open Image" style="width: 5cm; height: 5cm;" />

        <h5>Front Image:</h5>
        <img src="${this.selectedBook.imageFront}" alt="Front Image" style="width: 5cm; height: 5cm;" />

        <h5>Binder Image:</h5>
        <img src="${this.selectedBook.imageBinder}" alt="Binder Image" style="width: 5cm; height: 5cm;" />

        <h5>Back Image:</h5>
        <img src="${this.selectedBook.imageBack}" alt="Back Image" style="width: 5cm; height: 5cm;" />
      `,
      customClass: {
        confirmButton: 'btn btn-success',
      },
      confirmButtonText: 'Close',
      showCancelButton: false,
    });
  }
}


}
