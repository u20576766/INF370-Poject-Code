import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  credentials: any = {
    userName: '',
    password: ''
  };

  // Define passwordValidationMessage for password validation feedback
  passwordValidationMessage: string = '';

  // Define formErrors object to hold validation error messages
  formErrors: any = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  togglePassword(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }

  onLogin() {
    // Check if fields are empty
    if (!this.credentials.userName || !this.credentials.password) {
      this.resetFormErrors(); // Call the method to reset form errors
      this.showSnackbar('Please fill in all fields.', 'error');
      return;
    }

    // Validate email format
    this.validateEmail();

    // Validate password format
    this.validatePassword();

    // Removed SweetAlert confirmation and replaced it with direct login attempt
    this.authService.login(this.credentials).subscribe(
      () => {
        // Successful login
        this.showSnackbar('Login successful!', 'success');
        this.router.navigate(['/']); // Navigate to the desired page on successful login
      },
      (error) => {
        // Handle login error
        this.showSnackbar('Invalid login attempt.', 'error');
      }
    );
  }

  // Helper function to reset form errors
  private resetFormErrors(): void {
    this.formErrors = {
      email: '',
      password: ''
    };
  }

  // Validate email format
  validateEmail(): void {
    const email = this.credentials.userName;
    // Reset the validation message
    this.formErrors.email = '';

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.formErrors.email = 'Invalid email format';
    }
  }

  // Validate password format
  validatePassword(): void {
    const password = this.credentials.password;
    // Reset the validation message
    this.formErrors.password = '';

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

  // Function to show a Snackbar with the given message and optional action
  showSnackbar(message: string, panelClass: string = ''): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      verticalPosition: 'top', // Position of the snackbar
      panelClass: panelClass // Optional CSS class for styling
    });
  }
}
