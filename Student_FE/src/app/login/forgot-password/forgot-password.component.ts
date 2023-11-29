import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  sendPasswordResetLink(): void {
    if (this.email) {
      const model = { email: this.email };

      Swal.fire({
        icon: 'question',
        title: 'Send Password Reset Link',
        text: 'Are you sure you want to send the password reset link to your email?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'info',
            title: 'Sending Reset Link',
            text: 'Please wait while we send the password reset link...',
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false
          });

          this.authService.forgotPassword(model).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password reset request sent. Please check your email for further instructions.',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: 'OK',
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password reset request failed. Please try again later.',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: 'OK',
              });
            }
          );
        }
      });
    }
  }

  onCancel(): void {
    Swal.fire({
      icon: 'question',
      title: 'Cancel Password Reset',
      text: 'Are you sure you want to cancel the password reset request?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the login page or perform any other necessary action
      }
    });
  }
}
