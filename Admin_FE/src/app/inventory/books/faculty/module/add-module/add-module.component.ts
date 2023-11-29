import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from 'src/app/shared/module';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Department } from 'src/app/shared/department';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {

  mod: Module[] = [];
  dep: Department[] = [];

  constructor(private data: DataService, private router: Router) { }

  formAdd: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    depID: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.GetAllDepartments();
  }

  GetAllDepartments() {
    this.data.GetAllDepartments().subscribe((result: any) => {
      this.dep = result;
    });
  }

  confirmAddModule() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this module?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addModule();
      }
    });
  }

  showAbortModal() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Module has been aborted.',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/module']);
    });
  }

  addModule() {
    let mod = new Module();
    mod.module_Code = this.formAdd.value.name;
    mod.description = this.formAdd.value.description;
    mod.department_ID = this.formAdd.value.depID;

    this.data.AddModule(mod).subscribe(
      () => {
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '20');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added A New Module: " + this.formAdd.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        Swal.fire({
          title: 'Success',
          text: 'Module has been successfully added',
          icon: 'success',
          confirmButtonText: 'OKAY'
        }).then(() => {
          this.router.navigate(['/module']);
        });
      },
      (error: any) => {
        Swal.fire('Error', 'An error occurred while adding the module', 'error');
      }
    );
  }

  selectedOption: string = '';
  onOptionChange(target: any) {
    const value = target.value;
    this.selectedOption = value;
  }
}
