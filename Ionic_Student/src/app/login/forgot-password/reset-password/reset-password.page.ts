import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordViewModel } from 'src/app/shared/forget-password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  hide = true;
  hide2 = true;
  email!: string;
  token!: string;
  newPassword: string = '';
  confirmPassword: string = '';
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  passwordValidationMessage: string = '';
  formErrors: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alertController: AlertController // Inject AlertController
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
    // ... resetPassword function remains unchanged
  }

  cancelReset(): void {
    this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Cancel Password Reset?',
      message: 'Are you sure you want to cancel the password reset?',
      buttons: [
        {
          text: 'No, keep it',
          role: 'cancel',
        },
        {
          text: 'Yes, cancel it',
          handler: () => {
            // Redirect to the login page or any other appropriate action
            this.router.navigate(['/Login']);
          },
        },
      ],
    });

    await alert.present();
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



  togglePassword() {
    this.hide = !this.hide;
  }

  togglePassword2() {
    this.hide2 = !this.hide2;
  }

}
