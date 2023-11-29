import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faculty } from 'src/app/shared/faculty';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Department } from 'src/app/shared/department';
import Swal from 'sweetalert2'; // Import SweetAlert library

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit {
  fac: Faculty[] = [];
  dept: Department[] = [];

  constructor(
    private data: DataService,
    private router: Router
  ) {}

  formAdd: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    facID: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.GetAllFaculties();
  }

  //Get All Suppliers
  GetAllFaculties() {
    this.data.GetAllFaculties().subscribe((result) => {
      let facList: any[] = result;
      facList.forEach((element) => {
        this.fac.push(element);
      });
    });
  }

  addDepartment() {
    let dep = new Department();
    dep.department_Name = this.formAdd.value.name;
    dep.faculty_ID = this.formAdd.value.facID;

    this.data.AddDepartment(dep).subscribe(
      (response: any) => {
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '26');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added A New Department: " + this.formAdd.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        this.showSuccessAlert();
        this.router.navigate(['/department']);
      },
      (error) => {
        this.showErrorAlert();
      }
    );
  }

  showConfirmAlert() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this department?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addDepartment();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.showCancelAlert();
      }
    });
  }

  showSuccessAlert() {
    Swal.fire({
      title: 'Success',
      text: 'Department has been successfully added.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  showErrorAlert() {
    Swal.fire({
      title: 'Error',
      text: 'An error occurred while adding the department.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  showCancelAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Cancelled',
      text: 'Add Department has been aborted.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/department']);
    });
  }

  onOptionChange(target: any) {
    const value = target.value;
  }
}
