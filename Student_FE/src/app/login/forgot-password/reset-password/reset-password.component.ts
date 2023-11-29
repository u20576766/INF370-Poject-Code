import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  email!: string;
  token!: string;
  newPassword: string = '';
  confirmPassword: string = '';
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  passwordValidationMessage: string = '';
  formErrors: any = {};
  newPasswordVisible: boolean = false; // New property for password visibility
  confirmPasswordVisible: boolean = false; // New property for password visibility

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
      console.log('Email:', this.email);
      console.log('Token:', this.token);
    });
  }

  resetPassword(): void {
    if (this.resetPasswordForm) {
      const newPasswordControl = this.resetPasswordForm.get('newPassword');
      const confirmPasswordControl = this.resetPasswordForm.get('confirmPassword');

      if (newPasswordControl && confirmPasswordControl) {
        const newPassword = newPasswordControl.value;
        const confirmPassword = confirmPasswordControl.value;

        if (newPassword !== confirmPassword) {
          this.showAlert('error', 'Password Mismatch', 'Passwords do not match.');
          return;
        }

        if (!this.email || !this.token) {
          this.showAlert('error', 'Missing Information', 'Email and Token are required.');
          return;
        }

        // Validate the password
        if (!this.validatePassword(newPassword)) {
          this.showAlert('error', 'Invalid Password', this.passwordValidationMessage);
          return;
        }

        const resetPasswordModel = {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        };

        this.authService.resetPassword(this.email, this.token, resetPasswordModel).subscribe(
          (response) => {
            this.showAlert('success', 'Password Reset Successful', response.Message).then(() => {
              this.router.navigate(['/Login']);
            });
          },
          (error) => {
            this.showAlert('error', 'Password Reset Failed', 'An error occurred while resetting the password.');
          }
        );
      }
    }
  }

  cancelReset(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Cancel Password Reset?',
      text: 'Are you sure you want to cancel the password reset?',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the login page or any other appropriate action
        this.router.navigate(['/Login']);
      }
    });
  }

  togglePasswordVisibility(controlName: string): void {
    if (controlName === 'newPassword') {
      this.newPasswordVisible = !this.newPasswordVisible; // Toggle visibility
    } else if (controlName === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible; // Toggle visibility
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const newPasswordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (newPasswordControl && confirmPasswordControl) {
      const newPassword = newPasswordControl.value;
      const confirmPassword = confirmPasswordControl.value;
      if (newPassword === confirmPassword) {
        return null;
      } else {
        return { passwordMismatch: true };
      }
    }

    return null;
  }

  validatePassword(password: string): boolean {
    // Reset the validation message
    this.passwordValidationMessage = '';

    if (password.length < 8) {
      this.passwordValidationMessage = 'Password must be at least 8 characters long.';
      return false;
    } else if (!/[A-Z]/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one uppercase letter.';
      return false;
    } else if (!/[a-z]/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one lowercase letter.';
      return false;
    } else if (!/\d/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one digit.';
      return false;
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      this.passwordValidationMessage = 'Password must contain at least one non-alphanumeric character.';
      return false;
    }

    return true;
  }

  showAlert(icon: string, title: string, text: string) {
    return Swal.fire({
      icon: icon as any,
      title: title,
      text: text,
    });
  }
}
