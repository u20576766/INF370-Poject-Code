import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from 'src/app/shared/module';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/shared/department';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-module',
  templateUrl: './update-module.component.html',
  styleUrls: ['./update-module.component.scss']
})
export class UpdateModuleComponent implements OnInit {

  dep: Department[] = []

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute, private snackbar: MatSnackBar) { }

  //Creating the form 
  upModule: Module = new Module();
  formUpdate: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    depID: new FormControl('', [Validators.required]),

  })

  ngOnInit(): void {
    console.log(this.UpdateModule)
    this.GetAllDepartments()
    console.log(this.dep)

    //get id
    this.activated.params.subscribe(params => {


      //get data by query
      this.data.GetModule(params['id']).subscribe(response => {

        //place response in page
        this.upModule = response as Module;

        //place retrieved data in cells
        this.formUpdate.controls['name'].setValue(this.upModule.module_Code);
        this.formUpdate.controls['description'].setValue(this.upModule.description);
        this.formUpdate.controls['depID'].setValue(this.upModule.department_ID);
      })

    })

  }

  //Get Dep
  GetAllDepartments() {
    this.data.GetAllDepartments().subscribe(result => {
      let depList: any[] = result
      depList.forEach((element) => {
        this.dep.push(element)
      });
    })
  }


  UpdateModule() {
    let mod = new Module();
    mod.module_Code = this.formUpdate.value.name;
    mod.description = this.formUpdate.value.description;
    mod.department_ID = this.formUpdate.value.depID; Number(this.selectedOption);

    this.data.updateModule(this.upModule.module_ID, mod).subscribe((response: any) => {
      let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '21');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated A Module: " + this.formUpdate.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
      this.router.navigate(['/module']);
      Swal.fire('Success', 'Module has been successfully updated', 'success');
    },
      (error: any) => {
        Swal.fire('Error', 'Failed to update module', 'error');
      }
    );
  }

  showUpdateConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this module?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UpdateModule();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update Module has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/module']);
    });
  }

  selectedOption: string = "";
  onOptionChange(target: any) {
    const value = target.value;
    this.selectedOption = value;
  }

}