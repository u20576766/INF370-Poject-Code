import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeType } from 'src/app/shared/employee-type';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-employee-type',
  templateUrl: './update-employee-type.component.html',
  styleUrls: ['./update-employee-type.component.scss']
})
export class UpdateEmployeeTypeComponent implements OnInit {

  upEmployeeType: EmployeeType = {
    employee_Type_ID: 0,
    name: '',
    description: ''
  };
  formUpdate: FormGroup;

  constructor(
    private data: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formUpdate = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {

      this.data.getEmployeeType(params['id']).subscribe(response => {
        
        this.upEmployeeType = response as EmployeeType;
        this.formUpdate.patchValue({
          name: this.upEmployeeType.name,
          description: this.upEmployeeType.description
        });
      });
    });
  }

  showUpdateConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this employee type?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateEmployeeType();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update Employee Type has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/employee_type']);
    });
  }

  updateEmployeeType() {

    if (this.formUpdate.valid) {
      const employeeType: EmployeeType = {
        employee_Type_ID: this.upEmployeeType.employee_Type_ID,
        name: this.formUpdate.value.name,
        description: this.formUpdate.value.description
      };

      this.data.updateEmployeeType(employeeType.employee_Type_ID, employeeType).subscribe(
        (response: any) => {
        this.router.navigate(['/employee_type']);

        
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '40');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated employee type "+employeeType.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => {
          });
        }


        Swal.fire('Success', 'Employee Type has been successfully updated', 'success');
      },
        (error: any) => {
          Swal.fire('Error', 'Failed to update employee type', 'error');
        }
      );
    }
  }
}

