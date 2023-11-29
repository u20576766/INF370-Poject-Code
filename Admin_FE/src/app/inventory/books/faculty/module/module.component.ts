import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Module } from 'src/app/shared/module';
import { Department } from 'src/app/shared/department';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

  mod: Module[] = [];
  dep: Department[] = [];

  constructor(private dService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.GetAllDepartments();
    this.GetAllModules();
  }

  // Get All Departments
  GetAllDepartments() {
    this.dService.GetAllDepartments().subscribe(
      result => {
        this.dep = result;
      },
      error => {
        this.showErrorAlert('Error', 'Failed to fetch departments. Please try again.');
      }
    );
  }

  // Get All Modules
  GetAllModules() {
    this.dService.GetAllModules().subscribe(
      result => {
        this.mod = result;
      },
      error => {
        this.showErrorAlert('Error', 'Failed to fetch modules. Please try again.');
      }
    );
  }

  // Delete a module
  deleteModule(module_ID: Number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this module?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dService.DeleteModule(module_ID).subscribe(
          () => {
           let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;
    
              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '22');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted A Module");
    
              this.dService.GenerateAuditTrail(newTrail).subscribe(response => {});
            }
            else {
              console.log("loggedInUser is null");
            }
            Swal.fire('Deleted!', 'The module has been deleted.', 'success');
          },
          (error: any) => {
            Swal.fire('Error', 'An error occurred while deleting the module', 'error');
          }
        );
      } else if (result.isDenied || result.isDismissed) {
        Swal.fire('Delete module has been cancelled', '', 'error');
      }
    });
  }
  // Update Module page link
  updateModule(module_ID: Number) {
    this.router.navigate(['/updateMod', module_ID]);
  }

  // Search Modules
  searchInput: string = '';
  searchModule() {
    if (this.searchInput.trim() === '') {
      this.GetAllModules();
    } else {
      this.dService.SearchModule(this.searchInput).subscribe(
        result => {
          this.mod = result;
        },
        error => {
          this.showErrorAlert('Error', 'Failed to search modules. Please try again.');
        }
      );
    }
  }

  // Show error alert
  showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message
    });
  }
}
