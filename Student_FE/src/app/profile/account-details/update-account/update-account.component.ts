import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit {
  updateAccountForm!: FormGroup;
  formErrors: { [key: string]: string } = {
    firstName: '',
    lastName: '',
    cell_Number: '',
    email: ''
  };

  // Add a variable to track whether the form has been submitted
  private formSubmitted = false;

  // Add a property to track the subscribed status
  subscribed: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.populateFormWithUserData(); // Prepopulate form with user data
  }

  initForm(): void {
    this.updateAccountForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      cell_Number: [
        '',
        [
          Validators.required,
          Validators.pattern(/^0\d{9}$/),
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      subscribed: [this.subscribed] // Add the subscribed control
    });

    this.updateAccountForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any): void {
    if (!this.updateAccountForm) {
      return;
    }
    const form = this.updateAccountForm;

    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = '';

        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages: { [key: string]: string } = {
            required: 'This field is required.',
            maxlength: 'Exceeded maximum length.',
            pattern: 'Invalid format.'
          };

          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(): void {
    if (!this.updateAccountForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: 'Please check the form for errors.',
        timer: 3000
      });
      return;
    }

    this.formSubmitted = true;
    const studentId = localStorage.getItem('studentId');

    if (!studentId) {
      console.error('Student ID not found in local storage.');
      return;
    }

    const formData = this.updateAccountForm.value;
    const previousEmail = localStorage.getItem('email');
    const newEmail = formData.email;

    // Include 'subscribed' status in the request body
    const requestBody = {
      ...formData,
      subscribed: this.subscribed // Update the subscribed status
    };

    this.authService.updateAccount(Number(studentId), requestBody).subscribe(
      (response) => {
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        localStorage.setItem('cell_Number', formData.cell_Number);
        localStorage.setItem('subscribed', this.subscribed ? 'true' : 'false'); 

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Account details updated successfully.',
          timer: 3000
        });

        // Now, check if the email has been updated
        if (previousEmail !== newEmail) {
          Swal.fire({
            icon: 'info',
            title: 'Email Updated',
            text: 'Your email address has been updated. Please log in again with your new email address.',
            showCancelButton: true,
            confirmButtonText: 'Log Out and Login',
            cancelButtonText: 'Cancel'
          }).then((loginResult) => {
            if (loginResult.isConfirmed) {
               this.authService.logout();

              // Update local storage with the new email
              localStorage.setItem('email', newEmail);

              // Navigate to the login page
              this.router.navigate(['/Login']);
            } else {
              this.formSubmitted = false;
            }
          });
        } else {
          // Email has not been updated, no need for a second Swal alert
          this.formSubmitted = false;
          this.router.navigate(['/Account-Info']); // Navigate to account info page
        }

        // Log the response from the API
        console.log('API Response:', response);
      },
      (error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating account details (except email). Please check the console for details.',
          timer: 3000
        });

        this.formSubmitted = false;
      }
    );
  }

  onCellNumberInput(event: any): void {
    const inputValue = event.target.value;
    const cleanedValue = inputValue.replace(/[^0-9]/g, '');

    if (cleanedValue.length !== 10) {
      // Display a specific error message for cell number length
      this.formErrors['cell_Number'] = 'Cell Number must be exactly 10 digits long';
    } else if (cleanedValue.length > 0 && cleanedValue[0] !== '0') {
      this.formErrors['cell_Number'] = 'Cell Number must start with "0"';
    } else {
      // Reset the error message when the input is valid
      this.formErrors['cell_Number'] = '';
    }

    // Update the form control with the cleaned value
    this.updateAccountForm.get('cell_Number')?.setValue(cleanedValue);
  }

  // Prepopulate form fields with user data from local storage
  populateFormWithUserData(): void {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const cell_Number = localStorage.getItem('cell_Number');
    const email = localStorage.getItem('email');
    const subscribed = localStorage.getItem('subscribed');

    this.subscribed = subscribed === 'true'; // Convert to boolean

    this.updateAccountForm.patchValue({
      firstName,
      lastName,
      cell_Number,
      email,
      subscribed: this.subscribed
    });

    // Log prepopulated data
    console.log('Prepopulated Data:', {
      firstName,
      lastName,
      cell_Number,
      email,
      subscribed
    });
  }

  onCancel(): void {
    // Display a confirmation SweetAlert before canceling the update
    Swal.fire({
      icon: 'question',
      title: 'Confirm Cancel',
      text: 'Are you sure you want to cancel updating your account information?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed the cancel, navigate to the account info page
        this.router.navigate(['/Account-Info']);
      }
    });
  }
}
