import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faculty } from 'src/app/shared/faculty';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Department } from 'src/app/shared/department';

@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
  styleUrls: ['./update-department.component.scss']
})
export class UpdateDepartmentComponent implements OnInit {
  fac: Faculty[] = [];

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute) {}

  upDepartment: Department = new Department();
  formUpdate: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    facID: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.getAllFaculties();

    this.activated.params.subscribe(params => {
      this.data.GetDepart(params['id']).subscribe(response => {
        this.upDepartment = response as Department;
        this.formUpdate.controls['name'].setValue(this.upDepartment.department_Name);
        this.formUpdate.controls['facID'].setValue(this.upDepartment.faculty_ID);
      });
    });
  }

  getAllFaculties() {
    this.data.GetAllFaculties().subscribe(result => {
      let facList: any[] = result;
      facList.forEach((element) => {
        this.fac.push(element);
      });
    });
  }

  updateDepartment() {
    let dep = new Department();
    dep.department_Name = this.formUpdate.value.name;
    dep.faculty_ID = this.formUpdate.value.facID;

    this.data.updateDepartment(this.upDepartment.department_ID, dep).subscribe(
      (response: any) => {
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '27');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated A Department: " + this.formUpdate.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        this.showSuccessAlert('Department has been successfully updated');
        this.router.navigate(['/department']);
      },
      (error: any) => {
        this.showErrorAlert('Error updating department');
      }
    );
  }

  showUpdateAlert() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this department?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateDepartment();
      }
    });
  }

  showCancelAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Cancelled',
      text: 'Update Department has been aborted.',
      confirmButtonText: 'OKAY'
    }).then(() => {
      this.router.navigate(['/department']);
    });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonText: 'OKAY'
    }).then(() => {
      this.router.navigate(['/department']);
    });
  }

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'OKAY'
    });
  }

  selectedOption: string = "";
  onOptionChange(target: any) {
    const value = target.value;
    this.selectedOption = value;
  }
}
