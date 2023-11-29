import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeType } from 'src/app/shared/employee-type';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee-type',
  templateUrl: './add-employee-type.component.html',
  styleUrls: ['./add-employee-type.component.scss']
})
export class AddEmployeeTypeComponent implements OnInit {
  employeeTypes: EmployeeType[] = [];
  showConfirmationModal: boolean = false;
  showSuccessModal: boolean = false; // Add a flag for success modal

  formAdd: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  constructor(private dataService: DataService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getAllEmployeeTypes();
  }

  getAllEmployeeTypes(): void {
    this.dataService.getAllEmployeeTypes().subscribe(result => {
      this.employeeTypes = result;
    });
  }


  AddEmployeeType() {
    const employeeType: EmployeeType = {
      employee_Type_ID: 0,
      name: this.formAdd.value.name,
      description: this.formAdd.value.description
    };

    this.dataService.addEmployeeType(employeeType).subscribe(
      () => {
        this.router.navigate(['/employee_type']);

        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '39');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added new employee type "+employeeType.name);

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          });

        }
        Swal.fire('Success', 'Employee Type has been successfully added to the system.', 'success');
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while adding the employee type.', 'error');
      }
    );
  }

  showAddConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this employee type?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      preConfirm: () => {
        this.AddEmployeeType();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Employee Type has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/employee_type']);
    });
  }

}
