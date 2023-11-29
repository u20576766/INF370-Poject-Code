import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular'; // Import AlertController

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
})
export class AccountInfoPage implements OnInit {

  updateAccountForm!: FormGroup;
  formErrors: { [key: string]: string } = {
    firstName: '',
    lastName: '',
    cell_Number: '',
    email: ''
  };

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController // Inject AlertController
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.populateFormWithUserData(); // Prepopulate form with user data
  }

  async initForm(): Promise<void> {
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
      email: ['', [Validators.required, Validators.email]]
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

  async onSubmit(): Promise<void> {
    if (!this.updateAccountForm) {
      return;
    }

    if (this.updateAccountForm.invalid) {
      // Display an Ionic Alert with validation errors
      const alert = await this.alertController.create({
        header: 'Validation Error',
        message: 'Please check the form for errors.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Get the studentId from local storage
    const studentId = localStorage.getItem('studentId');

    if (studentId === null) {
      // Handle the case where studentId is null (not found in local storage)
      console.error('Student ID not found in local storage.');
      // You can display an error message or take a different action here.
      return;
    }

    // Submit the form to update the account
    const formData = this.updateAccountForm.value;

    // Log form data before sending the request
    console.log('Form Data before sending:', formData);

    this.authService.updateAccount(Number(studentId), formData).subscribe(
      async () => {
        // Display an Ionic Alert for success
        const successAlert = await this.alertController.create({
          header: 'Success',
          message: 'Account details updated successfully.',
          buttons: ['OK']
        });
        await successAlert.present();
        console.log('Account updated successfully.');
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        localStorage.setItem('cell_Number', formData.cell_Number);
      },
      async (error) => {
        console.error('Error:', error); // Log the error
        // Display an Ionic Alert for error
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred while updating account details. Please check the console for details.',
          buttons: ['OK']
        });
        await errorAlert.present();
        console.log('Error occurred while updating account details.');
      }
    );
  }

  // Prepopulate form fields with user data from local storage
  populateFormWithUserData(): void {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const cell_Number = localStorage.getItem('cell_Number');
    const email = localStorage.getItem('email');

    this.updateAccountForm.patchValue({
      firstName,
      lastName,
      cell_Number,
      email
    });

    // Log prepopulated data
    console.log('Prepopulated Data:', {
      firstName,
      lastName,
      cell_Number,
      email
    });
  }
}
