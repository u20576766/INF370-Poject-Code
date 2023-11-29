import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; // Import DomSanitizer
import { DataService } from 'src/app/services/data.service';
import { EmployeeType } from 'src/app/shared/employee-type';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {
  updateEmployeeForm!: FormGroup;
  employeeTypes: EmployeeType[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  savedBirthDate: string | null = null;
  savedImageBase64: string | null = null;
  imageSrc: any = null; // Store the image source
  // Add this variable to your component
   selectedImageFileName: string | null = null;


  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.initForm(id);
    this.getEmployeeData(id);
  }

  initForm(id: number): void {
    this.updateEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.maxLength(100)]],
      cell_Number: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      physical_Address: ['', [Validators.required, Validators.maxLength(100)]],
      birthDate: ['', [Validators.required, this.birthdateValidator()]],
      emergency_Contact_Name: ['', [Validators.required, Validators.maxLength(100)]],
      emergency_Contact_Cell: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      employee_Type_ID: [0, Validators.required],
      imageBase64: ['']
    });

    this.getAllEmployeeTypes();
    this.errorMessage = null;
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

  getEmployeeData(id: number): void {
    this.dataService.getEmployeeById(id).subscribe(
      (employee) => {
        // Store the saved birthdate and image
        this.savedBirthDate = employee.birthDate;

        // Decode the base64 image and store it
        if (employee.image) {
          this.savedImageBase64 = employee.image;
          const imageUrl = 'data:image/jpeg;base64,' + employee.image; // Change 'jpeg' to 'png' if necessary
          // Sanitize the URL to prevent security risks
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        }

        // Set the birthDate as-is (in the server format) in the form
        this.updateEmployeeForm.patchValue({
          ...employee,
          birthDate: employee.birthDate
        });
      },
      (error) => {
        console.error('Error fetching employee data:', error);
        this.errorMessage = 'An error occurred while fetching employee data.';
      }
    );
  }

  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.updateEmployeeForm.patchValue({
          imageBase64: reader.result
        });

        // Display the selected image
        const imageUrl = reader.result as string;
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  birthdateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      return selectedDate <= eighteenYearsAgo ? null : { 'birthdateInvalid': true };
    };
  }

  updateEmployee(): void {
    if (this.updateEmployeeForm && this.updateEmployeeForm.valid) {
      const employeeData = { ...this.updateEmployeeForm.value };
      const id = +this.route.snapshot.paramMap.get('id')!;
  
      // Format the birthDate in "yyyy-MM-dd" format
      const formattedBirthDate = this.formatDateForServer(employeeData.birthDate);
      employeeData.birthDate = formattedBirthDate;
  
      // Check if a new image has been selected
      if (!employeeData.imageBase64) {
        // No new image selected, use the existing image
        employeeData.imageBase64 = this.savedImageBase64;
      } else {
        // A new image is selected, extract the base64 data
        const imageBase64 = employeeData.imageBase64.split(',')[1];
        employeeData.imageBase64 = imageBase64;
      }
  
      // Proceed with updating the employee
      this.dataService.updateEmployee(id, employeeData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Employee updated successfully.'
          }).then(() => {
            this.successMessage = 'Employee updated successfully.';
            this.errorMessage = null;
            timer(3000).subscribe(() => {
              this.router.navigate(['/manage-employee']);
            });
          });
  
          const userObject = JSON.parse(localStorage.getItem("loggedInUser") || '{}');
          const fullname = userObject.name + " " + userObject.surname;
  
          const newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '37');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated an employee " + employeeData.name);
  
          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while updating the employee.'
          });
          console.error('Error updating employee:', error);
          this.errorMessage = 'Something went wrong; please try again later.';
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: 'Please fill out all required fields correctly.'
      });
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }
  

  cancelUpdateEmployee(): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to cancel the update?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/manage-employee']);
      }
    });
  }

  // Function to format the date for the server in "dd-MM-yyyy" format
  private formatDateForServer(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[2]; // Day
      const month = parts[1]; // Month
      const year = parts[0]; // Year
      return `${day}-${month}-${year}`;
    }
    return dateStr; // Return the original string if it can't be formatted
  }
}
