import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { RegisterUserViewModel } from '../shared/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userData: RegisterUserViewModel = {
    firstName: '',
    lastName: '',
    cell_Number: '',
    email: '',
    password: '',
    subscribed: true
  };

  ngOnInit(): void {
    
  }

  hide: boolean = true; // Added property to toggle password visibility

  // Define formErrors object to hold validation error messages
  formErrors: any = {
    firstName: '',
    lastName: '',
    cell_Number: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private alertController: AlertController // Inject AlertController
  ) {}

  async togglePassword(): Promise<void> {
    this.hide = !this.hide; // Toggle password visibility
  }

  async registerUser(): Promise<void> {
    // Reset form errors
    console.log(this.userData)
    this.resetFormErrors();

    // Check if required fields are filled
    if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.password) {
      this.presentAlert('Error', 'Please fill in all required fields.');
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
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.userData.email)) {
      this.formErrors.email = 'Invalid email format';
      return;
    }

    // Call the register function from your AuthService
    try {
      const response = await this.authService.register(this.userData).toPromise();

      // Registration successful
      console.log(response);

      // Display a success message using Ionic Alert
      this.presentAlert('Success', 'Your account has been created. Please check your email for a confirmation link.');

      // Optionally, you can clear or reset the registration form here
      this.userData = {
        firstName: '',
        lastName: '',
        cell_Number: '',
        email: '',
        password: '',
        subscribed: true
      };
    } catch (error: any) {
      // Registration failed
      console.error('Error registering user:', error);

      if (error.error && error.error.message) {
        // Display a user-friendly error message from the server using Ionic Alert
        this.presentAlert('Error', error.error.message);
      } else {
        // If the server response doesn't contain a specific error message, show a generic error message
        this.presentAlert('Error', 'Registration failed. Please try again later.');
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

  // Helper function to present Ionic Alert
  private async presentAlert(title: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  isPasswordValid(requirement: string): boolean {
    // Define password requirements with an index signature
    const passwordRequirements: { [key: string]: boolean } = {
      length: this.userData.password.length >= 8,
      uppercase: /[A-Z]/.test(this.userData.password),
      lowercase: /[a-z]/.test(this.userData.password),
      special: /[@#$%^&+=!]/.test(this.userData.password),
      digit: /[0-9]/.test(this.userData.password)
    };

    // Check the specified requirement
    return passwordRequirements[requirement];
  }
}
