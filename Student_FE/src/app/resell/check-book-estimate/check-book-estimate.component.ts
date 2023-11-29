import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { ResellerVM } from 'src/app/shared/ResellerViewModel';
import { PrescribedBook } from 'src/app/shared/prescribedbookReseller';
import { createMayBeForwardRefExpression } from '@angular/compiler';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-check-book-estimate',
  templateUrl: './check-book-estimate.component.html',
  styleUrls: ['./check-book-estimate.component.scss']
})
export class CheckBookEstimateComponent implements OnInit {
  cart: number = 5;
  constructor(private dataService: DataService, private router: Router, private activated: ActivatedRoute, private renderer: Renderer2, private elementRef: ElementRef, private formBuilder: FormBuilder) {
    this.isbnForm = this.formBuilder.group({
      isbn: ['', [
        Validators.required, // ISBN field is required
        Validators.pattern(/^[0-9]{13}$/)  // Allow any number of numeric characters
      ]]
    });

  }
  ngOnInit(): void {
    this.getPercent()
  }

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  currentSlide: number = 1;
  nextSlide() {
    if (this.currentSlide < 3) {
      this.currentSlide++;
    }

    if (this.currentSlide === 3) {
      Swal.fire({
        title: 'Image',
        text: 'Upload all images required of the book',
        timer: 3000, // Display for 2 seconds
        icon: 'info',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }

    if (this.currentSlide === 2) {
      Swal.fire({
        title: 'Book condition',
        text: 'Tick where applicable',
        timer: 3000, // Display for 2 seconds
        icon: 'info',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }



  }
  nextSlideBack() {
    if (this.currentSlide < 4) {
      this.currentSlide--;
    }
  }







  videoModalOpen = false;

  // Method to open the video modal
  openVideoModal() {
    this.videoModalOpen = true;
  }

  // Method to close the video modal
  closeVideoModal() {
    this.videoModalOpen = false;
  }



  bookData: any;
  estimatedPrice: number = 0;
  isbnForm: FormGroup;
  showBookInformation: boolean = false;



  // Inside your component class
  tickedCheckboxes: number = 0;
  // Inside your component class
  imageBase64Strings: { [key: string]: string } = {
    front: '',
    back: '',
    binder: '',
    openBook: ''
  };
  isSubmitDisabled: boolean = true;
  // Update the imageUploadStatus object with an index signature
  imageUploadStatus: { [key: string]: boolean } = {
    front: false,
    back: false,
    binder: false,
    openBook: false
  };


  scrollToTellUs() {
    const tellUsElement = this.elementRef.nativeElement.querySelector('#tell-us');
    if (tellUsElement) {
      window.scrollTo({
        top: tellUsElement.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed:', event.key);
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (allowedKeys.indexOf(event.key) === -1) {
      event.preventDefault();
    }
  }



  CheckBook() {
    // Get the ISBN value from the form control
    const isbnInput = this.isbnForm.get('isbn')?.value;

    // Now you have the ISBN value in the `isbnInput` variable
    console.log('ISBN Input:', isbnInput);
    if (this.isbnForm.invalid) {
      console.log('Invalid ISBN Form:', this.isbnForm);
      Swal.fire({
        icon: 'error',
        title: 'Invalid ISBN',
        text: 'Please provide a valid 13-character ISBN.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }




    this.dataService.checkBookEstimate(isbnInput).subscribe(
      response => {
        this.bookData = response;
        console.log(response)

        this.estimatedPrice = this.bookData.basePrice
        Swal.fire({
          title: 'Confirm Book Information',
          html: `
          <div style="text-align:center;justify-content: center;">
          <h4 style="text-align:center;">Is this your book?</h4>
          <div style="padding: 20px;text-align:center;">
            <div style="margin-top: 20px;text-align:center;">
              <p><b>ISBN:</b> ${this.bookData.isbn}</p>
              <p><b>Title:</b> ${this.bookData.title}</p>
              <p><b>Author(s):</b> ${this.bookData.authorName}</p>
              <p><b>Publisher:</b> ${this.bookData.publisherName}</p>
              <p><b>Edition:</b> ${this.bookData.edition}</p>
              <p><b>Year:</b> ${this.bookData.year}</p>
              <br>
            </div>
          </div>
          </div>
          `,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Yes, Proceed', // Updated label
          cancelButtonText: 'No, Go Back',   // Updated label
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.showBookInformationFunction(); // Call the function to proceed with the action
          } else {
            this.router.navigate(['/Home']);
            window.location.reload();
          }
        });
      },
      error => {
        console.error(error);
        Swal.fire('Book with provided ISBN cannot be found. The book is not prescribed or the ISBN is incorrect.', '', 'error');
      }
    );
  }


  showBookInformationFunction() {
    this.showBookInformation = true;
  }

  uploadImage(event: any, imageType: string) {
    const file = event.target.files[0];

    if (file) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image MIME types if needed

      if (allowedImageTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result;
          this.imageBase64Strings[imageType] = base64String;

          // Set the imageUploadStatus for this image type to true
          this.imageUploadStatus[imageType] = true;

          // Update the submit button status
          this.checkSubmitStatus();
        };
        reader.readAsDataURL(file);
      } else {
        // Invalid file type, display SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select a valid image file (JPEG, PNG, GIF).',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        // Clear the file input
        event.target.value = null;
      }
    }
  }



  onImageUploadComplete(imageType: string) {
    // Use bracket notation to access properties
    this.imageUploadStatus[imageType] = true;
    this.checkSubmitStatus();
  }

  checkSubmitStatus() {
    // Enable submit button if all images are uploaded
    this.isSubmitDisabled = !(
      this.imageUploadStatus['front'] &&
      this.imageUploadStatus['back'] &&
      this.imageUploadStatus['binder'] &&
      this.imageUploadStatus['openBook']
    );
  }


  PercentValue: any;

  getPercent() {
    this.dataService.getresellerpercent().subscribe(response => {
      this.PercentValue = response["percent_Value"];
      console.log(this.PercentValue);
    })
  }

  BookEstimate() {
    if (this.isSubmitDisabled) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please upload all book images before estimating.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
      this.router.navigate(['/Home'])
    }

    // Proceed with book estimate logic
    const estimatedValue = this.estimatedPrice;

    Swal.fire({
      title: '<i class="fas fa-money-bill"></i> Book Estimate',
      html: `Estimated book value: R${estimatedValue.toFixed(2)}`,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Add book to resale',
      showCancelButton: true,
      cancelButtonText: 'I\'m Done Checking'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AddBook(); // Call the addBook function if "Add Book" is clicked
      } else {
        // Display a message indicating that the student is done checking the estimate
        Swal.fire({
          title: 'Estimate Checking Complete',
          text: 'You have finished checking the estimate.',
          icon: 'info'
        }).then(() => {
          // Reload the page
          this.router.navigate(['/Check'])
        });
      }
    });


  }

  updateTickedCheckboxes(event: any) {
    const checkboxElement = event.target as HTMLInputElement;

    if (checkboxElement.checked) {
      this.tickedCheckboxes++;
    } else {
      this.tickedCheckboxes--;
    }




    // Assuming this.tickedCheckboxes represents the number of ticked checkboxes
    const numberOfTickedCheckboxes = this.tickedCheckboxes;


    // Assuming you want a 2% discount per ticked checkbox
    const discountPercentagePerCheckbox = this.PercentValue;

    // Calculate the total discount percentage
    const totalDiscountPercentage = numberOfTickedCheckboxes * discountPercentagePerCheckbox;

    // Calculate the discount amount
    const discountAmount = (this.bookData.basePrice * totalDiscountPercentage) / 100;



    // Update the estimated price
    this.estimatedPrice = this.bookData.basePrice - discountAmount;









    // Update basePrice based on ticked checkboxes
    //const discountPercentage = this.tickedCheckboxes * ((this.PercentValue)/100); // 2% discount per checkbox
    //this.bookData.basePrice -= this.bookData.basePrice * discountPercentage;
    //this.estimatedPrice = this.bookData.basePrice;


    // Update submit button status
    this.checkSubmitStatus();
  }

  refreshPage() {
    this.router.navigate(['/Check'])
  }






  AddBook() {
    Swal.fire({
      title: 'Are you sure you want to add this book to resale?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonColor: "green",
      confirmButtonText: 'Yes',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) //if user clicked yes
      {
        const estimatedValue = this.estimatedPrice;
        const resellerData: ResellerVM = new ResellerVM();

        // Set properties of the resellerData object
        resellerData.estimated_Price = estimatedValue;
        // Convert to string
        resellerData.imageFront = this.imageBase64Strings['front'];
        resellerData.imageBack = this.imageBase64Strings['back'];
        resellerData.imageBinder = this.imageBase64Strings['binder'];
        resellerData.imageOpen = this.imageBase64Strings['openBook'];
        resellerData.isbn = this.bookData['isbn'];
        resellerData.student_ID = this.sID;

        if (this.sID === null) {
          Swal.fire('Adding book to resale was unsuccesful.Try again by logging out and logging in again.', '', 'error');
        }


        //add to system
        this.dataService.addBookToResaleCart(resellerData).subscribe(
          (response: any) => {
            if (typeof response == 'string' && response.includes('Book has been added successfully to resale')) {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Book has been successfully added to resale! You can go schedule an evaluation with the store now',
                showCancelButton: true,
                confirmButtonText: 'SCHEDULE EVALUATION',
                denyButtonText: 'VIEW RESALE', // Existing "VIEW RESALE" button
                showDenyButton: true, // Display the "VIEW RESALE" button
                customClass: {
                  confirmButton: 'schedule-evaluation-button', // Custom class for "SCHEDULE EVALUATION" button
                  denyButton: 'view-resale-button' // Custom class for "VIEW RESALE" button
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  // Redirect to the Schedule page when "SCHEDULE EVALUATION" is clicked
                  this.router.navigate(['/Schedule']);
                }
                if (result.isDenied) {
                  // Redirect to the View Resale page when "VIEW RESALE" is clicked
                  this.router.navigate(['/View-Resale']);
                }
              });



            }
            else {
              Swal.fire('Adding book to resale was unsuccesful.Try again.', '', 'error');
            }
          }
        )
      }
    })
  }

  AbortCheck() {
    Swal.fire({
      icon: 'warning',
      title: 'Cancel book estimate ',
      text: 'Are you sure you want to abort checking book estimate?',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Yes, abort',
      cancelButtonText: 'No, keep adding',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }

  hintButton() {
    Swal.fire({
      title: 'Check Book Estimate Tutorial',
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
        <p>To Check a book estiamte you must: </p><br>
        <div class="row" style="marging:10px" >
          <div class="col">
            <p>1. Enter in the isbn of the book you want an estimate for and then click the check button. <br><br>
            <a href="../assets/Chek Book Estimate/Screenshot (175).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Chek Book Estimate/Screenshot (175).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
          </div>
          <div class="col">
            <p>2. You will see a pop up with the book details. Proceed if the book details are correct.<br><br>
            <a href="../assets/Chek Book Estimate/Screenshot (176).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Chek Book Estimate/Screenshot (176).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
          </div>
        </div>

        <div class="row" style="marging:10px">
          <div class="col">
            <p>3. The information will be displayed and you can move to the next step. Click the next button.<br><br>
            <a href="../assets/Chek Book Estimate/Screenshot (177).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Chek Book Estimate/Screenshot (177).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
          <div class="col">
            <p>4. You will be asked to provide information on your book. Tick the boxes next to the questions that apply. When  you are satisfied, click next.<br><br>
            <a href="../assets/Chek Book Estimate/Screenshot (179).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Chek Book Estimate/Screenshot (179).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
        </div>

        <div class="row" style="marging:10px">
          <div class="col">
            <p>5. Upload ALL the required images of the book. The click the submit button to get your estimate.<br><br>
            <a href="https://serving.photos.photobox.com/81611055460e90bc984cdc52eb4d417cf749c3dfafa079271597624906302d572a45c3d7.jpg" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="https://serving.photos.photobox.com/81611055460e90bc984cdc52eb4d417cf749c3dfafa079271597624906302d572a45c3d7.jpg" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
          <div class="col">
            <p>6. A message returns with the estimated price of the book you want to sell. Click the add to resale button.<br><br>
              <a href="../assets/Chek Book Estimate/Screenshot (215).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Chek Book Estimate/Screenshot (215).png" class="zoomable-image" style="width: 70%; height: auto;">
             </a>
            </p>
          </div>
        </div>

        <div class="row" style="marging:10px">
          <div class="col">
            <p>7. The system will ask if you are sure, click yes to proceed with the add.<br><br>
            <a href="../assets/Chek Book Estimate/Screenshot (215).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Chek Book Estimate/Screenshot (215).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
          <div class="col">
            <p>8. Please wait for the success message to display and you will choose where you want to be redirected. Proceed Schedule an evaluation for the book(s).<br><br>
            <a href="../assets/Chek Book Estimate/Screenshot (216).png" target="_blank" data-lightbox="images" data-title="Step 1">
              <img src="../assets/Chek Book Estimate/Screenshot (216).png" class="zoomable-image" style="width: 70%; height: auto;">
            </a>
            </p>
          </div>
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

