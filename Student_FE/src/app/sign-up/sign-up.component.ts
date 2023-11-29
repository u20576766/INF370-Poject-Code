import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RegisterUserViewModel } from '../shared/register';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert library

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  userData: RegisterUserViewModel = {
    firstName: '',
    lastName: '',
    cell_Number: '',
    email: '',
    password: '',
    subscribed: true
  };

  hide: boolean = true; // Added property to toggle password visibility

  passwordValidationMessage: string = ''; // Store password validation feedback

  // Define formErrors object to hold validation error messages
  formErrors: any = {
    firstName: '',
    lastName: '',
    cell_Number: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  togglePassword(): void {
    this.hide = !this.hide; // Toggle password visibility
  }

  registerUser(): void {
    // Reset form errors
    this.resetFormErrors();

    // Check if required fields are filled
    if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.password) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error'); // Show SweetAlert error message
      return;
    }

    // Validate cell number format (10 characters and starts with 0)
    if (!/^(0\d{9})$/.test(this.userData.cell_Number)) {
      this.formErrors.cell_Number = 'Cell number must be 10 characters long and start with 0';
      return;
    }

    // Perform password validation based on your requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
    if (!passwordRegex.test(this.userData.password)) {
      this.formErrors.password = 'Password must meet the specified requirements';
      return;
    }

    // Validate email format
    this.validateEmail(); // Call the email validation method

    // Display a confirmation SweetAlert for registration
    Swal.fire({
      title: 'Confirm Registration',
      text: 'Do you want to proceed with the registration?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Register',
      cancelButtonText: 'Cancel',
    }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'info',
              title: 'Sending Reset Link',
              text: 'Please wait while we send the email confirmation link with the 2FA...',
              showCancelButton: false,
              showConfirmButton: false,
              allowOutsideClick: false
            });
        // Call the register function from your AuthService
        this.authService.register(this.userData).subscribe(
          (response: any) => {
            // Registration successful
            console.log(response);

            // Display a success message using SweetAlert
            Swal.fire('Success', 'Your account has been created. Please check your email for a confirmation link.', 'success');

            // Optionally, you can clear or reset the registration form here
            this.userData = {
              firstName: '',
              lastName: '',
              cell_Number: '',
              email: '',
              password: '',
              subscribed: true
            };
          },
          (error: any) => {
            // Registration failed
            console.error('Error registering user:', error);

            if (error.error && error.error.message) {
              // Display a user-friendly error message from the server using SweetAlert
              Swal.fire('Error', error.error.message, 'error');
            } else {
              // If the server response doesn't contain a specific error message, show a generic error message
              Swal.fire('Error', 'Registration failed. Please try again later.', 'error');
            }

            // Optionally, you can clear or reset the registration form here
            this.userData = {
              firstName: '',
              lastName: '',
              cell_Number: '',
              email: '',
              password: '',
              subscribed: true
            };
          }
        );
      }
    });
  }

  onCancelClick(): void {
    // Display a confirmation SweetAlert for canceling
    Swal.fire({
      title: 'Confirm Cancel',
      text: 'Do you want to cancel the registration?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/Home']); // Navigate back to the home page
      }
    });
  }
  


  // Helper function to reset form errors
  private resetFormErrors(): void {
    this.formErrors = {
      firstName: '',
      lastName: '',
      cell_Number: '',
      email: '',
      password: ''
    };
  }

  validatePassword(): void {
    const password = this.userData.password;
    // Reset the validation message
    this.passwordValidationMessage = '';

    if (password.length < 8) {
      this.passwordValidationMessage = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one lowercase letter.';
    } else if (!/\d/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one digit.';
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one non-alphanumeric character.';
    }
  }

  // Inside your component class
validateCellNumber(): void {
  const cellNumber = this.userData.cell_Number;
  // Reset the validation message
  this.formErrors.cell_Number = '';
// Reset the validation message
this.passwordValidationMessage = '';
  if (!/^(0\d{9})$/.test(cellNumber)) {
    this.formErrors.cell_Number = 'Cell number must be 10 characters long and start with 0';
  }
}

// Inside your component class
validateEmail(): void {
  const email = this.userData.email;
  // Reset the validation message
  this.formErrors.email = '';

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    this.formErrors.email = 'Invalid email format';
  }
}



}
