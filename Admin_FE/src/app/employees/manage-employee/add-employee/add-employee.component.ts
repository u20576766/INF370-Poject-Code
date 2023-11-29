import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EmployeeType } from 'src/app/shared/employee-type';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { timer } from 'rxjs'; // Import timer
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;
  employeeTypes: EmployeeType[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null; // Define errorMessage property

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    this.addEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.maxLength(100)]],
      cell_Number: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      physical_Address: ['', [Validators.required, Validators.maxLength(100)]],
      birthDate: ['', [Validators.required, this.birthdateValidator(eighteenYearsAgo)]],
      emergency_Contact_Name: ['', [Validators.required, Validators.maxLength(100)]],
      emergency_Contact_Cell: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      employee_Type_ID: [0, Validators.required], // Assuming the default value is 0
      imageBase64: [''] // Add the imageBase64 field to the form
    });

    this.getAllEmployeeTypes();
    this.errorMessage = null; // Initialize errorMessage as null
  }

  // Helper function to pad a number with leading zeros
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  getAllEmployeeTypes(): void {
    this.dataService.getAllEmployeeTypes().subscribe(
      (types) => {
        this.employeeTypes = types;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  // Function to handle image file input change
  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.addEmployeeForm.patchValue({
          imageBase64: reader.result // Store the base64 representation of the image in the form
        });
      };
      reader.readAsDataURL(file);
    }
  }

  addEmployee(): void {
    if (this.addEmployeeForm && this.addEmployeeForm.valid) {
      const employeeData = this.addEmployeeForm.value;

      // Convert birthDate to dd-mm-yyyy format
      const birthDate = new Date(employeeData.birthDate);
      const formattedBirthDate = `${this.padNumber(birthDate.getDate())}-${this.padNumber(birthDate.getMonth() + 1)}-${birthDate.getFullYear()}`;
      employeeData.birthDate = formattedBirthDate;

      // Convert imageBase64 to a string
      const imageBase64 = employeeData.imageBase64.split(',')[1]; // Remove the data URL prefix

      // Send the imageBase64 data along with other employee data
      const requestData = {
        ...employeeData,
        imageBase64
      };

      // Show a confirmation dialog before adding the employee
      Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to add this employee?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with adding the employee
          this.dataService.addEmployee(requestData).subscribe(
            (response) => {
              const userObject = JSON.parse(localStorage.getItem("loggedInUser") || '{}');
              const fullname = userObject.name + " " + userObject.surname;

              const newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '36');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Added new employee " + employeeData.name);

              this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
              });

              // Show success message with SweetAlert
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Employee added successfully.',
              }).then(() => {
                //this.successMessage = response;
                this.addEmployeeForm.reset();
                this.errorMessage = null; // Reset errorMessage on success
                // Display username and password message
                Swal.fire({
                title: 'Username and Password',
                text: this.successMessage = response,
                icon: 'info',
               timer: 15000 
                });
                // Redirect to the Manage Employee page after a delay
                timer(5000).subscribe(() => {
                  this.router.navigate(['/manage-employee']);
                });
              });
            },
            (error) => {
              // Show error message with SweetAlert
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while adding the employee.',
              });
              console.error('Error adding employee:', error);
              this.errorMessage = 'An error occurred while adding the employee.'; // Set errorMessage on error
            }
          );
        }
      });
    } else {
      // Show validation error message with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: 'Please fill out all required fields correctly.',
      });
      this.errorMessage = 'Please fill out all required fields correctly.'; // Set errorMessage for validation error
    }
  }

  birthdateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);

      // Calculate the minimum allowed birthdate (18 years ago)
      const minAllowedDate = new Date();
      minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 18);

      return selectedDate <= minAllowedDate ? null : { 'birthdateInvalid': true };
    };
  }

  cancelAddingEmployee(): void {
    // Show a confirmation dialog when the "Cancel" button is clicked
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to cancel adding this employee?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the Manage Employee page after a delay
        timer(5000).subscribe(() => {
          this.router.navigate(['/manage-employee']);
        });

       
      }
    });
  }
}
