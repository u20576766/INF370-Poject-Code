import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Update with your actual AuthService path
import { UpdatePasswordModel } from 'src/app/shared/account'; // Import your model
import Swal from 'sweetalert2'; // Import SweetAlert2
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  model: UpdatePasswordModel = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  showProfile: boolean = true;
  // Define formErrors object to hold validation error messages
  formErrors: any = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    confirmPasswordMatch: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  updatePassword(): void {
    // Reset form errors
    this.resetFormErrors();

    if (!this.validatePassword()) {
      return; // Password validation failed, prevent submission
    }

    const studentId = this.authService.getStudentID(); // Retrieve the student ID from local storage

    if (!studentId) {
      // Handle the case where student ID is not found in local storage
      this.showErrorAlert('Student ID not found.');
      return;
    }

    this.authService.updatePassword(+studentId, this.model).subscribe(
      (response) => {
        // Show a success SweetAlert
        this.showSuccessAlert('Password updated successfully. Please log in with your new password.');
        // Log the user out after changing the password
        this.authService.logout();
        this.router.navigate(['/Login']);
        this.showProfile = false;
       
      },
      (error) => {
        // Show an error SweetAlert
        this.showErrorAlert('Password update failed. Please try again.');
        console.error('Password update failed:', error);
      }
    );
  }

  confirmCancel(): void {
    // Show a confirmation SweetAlert
    this.showConfirmAlert('Are you sure you want to cancel?', () => {
      // User confirmed, navigate to Account-Info
      this.router.navigate(['/Account-Info']);
    });
  }

  toggleCurrentPasswordVisibility(): void {
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // Password validation method
  validatePassword(): boolean {
    const newPassword = this.model.newPassword;
    const confirmPassword = this.model.confirmPassword;
    let isValid = true; // Track overall validation status

    // Reset validation messages
    this.formErrors.newPassword = '';
    this.formErrors.confirmPassword = '';

    if (newPassword !== confirmPassword) {
      this.formErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    if (newPassword.length < 8) {
      this.formErrors.newPassword = 'Password must be at least 8 characters long.';
      isValid = false;
    }

    if (!/[A-Z]/.test(newPassword)) {
      this.formErrors.newPassword = 'Password must contain at least one uppercase letter.';
      isValid = false;
    }

    if (!/[a-z]/.test(newPassword)) {
      this.formErrors.newPassword = 'Password must contain at least one lowercase letter.';
      isValid = false;
    }

    if (!/\d/.test(newPassword)) {
      this.formErrors.newPassword = 'Password must contain at least one digit.';
      isValid = false;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      this.formErrors.newPassword = 'Password must contain at least one non-alphanumeric character.';
      isValid = false;
    }

    return isValid;
  }

  // Helper method to reset form errors
  private resetFormErrors(): void {
    this.formErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      confirmPasswordMatch: ''
    };
  }

  // Helper method to show a success SweetAlert
  private showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
  }

  // Helper method to show an error SweetAlert
  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  // Helper method to show a confirmation SweetAlert
  private showConfirmAlert(message: string, callback: () => void): void {
    Swal.fire({
      icon: 'question',
      title: 'Confirm',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, execute the callback
        callback();
      }
    });
  }
}
