import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ResellerVM } from 'src/app/shared/ResellerViewModel';

@Component({
  selector: 'app-check-book',
  templateUrl: './check-book.page.html',
  styleUrls: ['./check-book.page.scss'],
})
export class CheckBookPage implements OnInit {
  cart: number = 5;

  constructor(
    private dataService: DataService,
    private router: Router,
    private activated: ActivatedRoute,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private alertController: AlertController // Inject AlertController
  ) {
    this.isbnForm = this.formBuilder.group({
      isbn: [
        '',
        [
          Validators.required, // ISBN field is required
          Validators.pattern(/^[0-9]{13}$/) // Allow any number of numeric characters
        ]
      ]
    });
  }


  ///Mmapula
  showBookAcceptOrReject: boolean = false;

  ngOnInit(): void { }

  videoModalOpen = false;

  // Method to open the video modal
  openVideoModal() {
    this.videoModalOpen = true;
  }

  // Method to close the video modal
  closeVideoModal() {
    this.videoModalOpen = false;
  }

  hintButton() {
    this.presentAlert(
      'Resell Tutorial',
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/MtRkxYeMa_Y?si=7xBWzEjoFmwsZgaQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
    );
  }

  bookData: any;
  estimatedPrice: number = 0;
  isbnForm: FormGroup;
  showBookInformation = false;

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
        behavior: 'smooth'
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

      // Use Ionic's AlertController to show an alert
      this.presentAlert(
        'Invalid ISBN',
        'Please provide a valid 13-character ISBN.'
      );
      return;
    }

    this.dataService.checkBookEstimate(isbnInput).subscribe(
      response => {
        this.bookData = response;

        // Use Ionic's AlertController for confirmation with a callback function
        this.showBookAcceptOrReject = true;
      },
      error => {
        console.error(error);

        // Use Ionic's AlertController to show an error alert
        this.presentAlert(
          'Book with provided ISBN cannot be found.',
          'The book is not prescribed or the ISBN is incorrect.'
        );
      }
    );
  }

  showBookInformationFunction() {
    this.showBookInformation = true;
  }

  uploadImage(event: any, imageType: string) {
    const file = event.target.files[0];
    if (file) {
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

  BookEstimate() {
    if (this.isSubmitDisabled) {
      this.presentAlert(
        'Error',
        'Please upload all book images before estimating.'
      );
      return;
      this.router.navigate(['/Home']);
    }

    // Proceed with book estimate logic
    const estimatedValue = this.bookData.basePrice;

    this.presentConfirmAlert(
      'Book Estimate',
      `Estimated book value: R${estimatedValue.toFixed(2)}`,
      'Add book to resale',
      'I\'m Done Checking'
    ).then(result => {
      if (result.isConfirmed) {
        this.AddBook(); // Call the addBook function if "Add Book" is clicked
      } else {
        // Display a message indicating that the student is done checking the estimate
        this.presentAlert(
          'Estimate Checking Complete',
          'You have finished checking the estimate.'
        ).then(() => {
          // Reload the page
          window.location.reload();
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

    // Update basePrice based on ticked checkboxes
    const discountPercentage = this.tickedCheckboxes * 0.02; // 2% discount per checkbox
    this.bookData.basePrice -= this.bookData.basePrice * discountPercentage;
    this.estimatedPrice = this.bookData.basePrice;

    // Update submit button status
    this.checkSubmitStatus();
  }

  refreshPage() {
    window.location.reload();
  }

  AddBook() {
    this.presentConfirmAlert(
      'Confirmation',
      'Are you sure you want to add this book to resale?',
      'Yes',
      'No'
    ).then(result => {
      if (result.isConfirmed) {
        const resellerData: ResellerVM = new ResellerVM();

        // Set properties of the resellerData object
        resellerData.estimated_Price = this.estimatedPrice; // Convert to string
        resellerData.imageFront = this.imageBase64Strings['front'];
        resellerData.imageBack = this.imageBase64Strings['back'];
        resellerData.imageBinder = this.imageBase64Strings['binder'];
        resellerData.imageOpen = this.imageBase64Strings['openBook'];
        resellerData.isbn = this.bookData['isbn'];
        resellerData.student_ID = 1;

        //add to system
        this.dataService.addBookToResaleCart(resellerData).subscribe(
          (response: any) => {
            if (
              typeof response == 'string' &&
              response.includes(
                'Book has been added successfully to resale'
              )
            ) {
              this.presentConfirmAlert(
                'Success',
                'Book has been successfully added to resale! You can go schedule an evaluation with the store now',
                'SCHEDULE EVALUATION',
                'VIEW RESALE'
              ).then(result => {
                if (result.isConfirmed) {
                  this.router.navigate(['/schedule']);
                }
                if (result.isDenied) {
                  this.router.navigate(['/view-resale']);
                }
              });

              this.isbnForm.reset();
              this.bookData = null;
              this.showBookAcceptOrReject = false;
              this.showBookInformation = false;

            } else {
              this.presentAlert(
                'Adding book to resale was unsuccessful. Try again.',
                ''
              );
            }
          }
        );
      }
    });
  }

  AbortCheck() {
    this.presentConfirmAlert(
      'Cancel book estimate',
      'Are you sure you want to abort checking book estimate?',
      'Yes, abort',
      'No, keep adding'
    ).then(result => {
      if (result.isConfirmed) {
        this.isbnForm.reset();
        this.bookData = null;
        this.showBookAcceptOrReject = false;
        this.showBookInformation = false;
        this.router.navigate(['/resell']);
      }
    });
  }

  // Define a method to present Ionic alerts
  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Define a method to present Ionic confirmation alerts
  async presentConfirmAlert(
    title: string,
    message: string,
    confirmButtonText: string,
    cancelButtonText: string
  ) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: cancelButtonText,
          role: 'cancel',
          handler: () => {
            return { isConfirmed: false, isDenied: false };
          }
        },
        {
          text: confirmButtonText,
          handler: () => {
            return { isConfirmed: true, isDenied: false };
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role === 'cancel') {
      return { isConfirmed: false, isDenied: true };
    } else {
      return { isConfirmed: true, isDenied: false };
    }
  }
  //Show books details
  acceptBook() {
    this.showBookAcceptOrReject = false;
    this.showBookInformation = true;

  }

  rejectBook() {
    this.showBookAcceptOrReject = false;
  }


}
