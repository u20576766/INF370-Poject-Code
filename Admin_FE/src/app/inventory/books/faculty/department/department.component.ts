import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Department } from 'src/app/shared/department';
import { Faculty } from 'src/app/shared/faculty';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
  dep: Department[] = [];
  fac: Faculty[] = [];

  constructor(
    private dService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.GetAllDepartments();
    this.GetAllFaculties();
    console.log(this.dep);
  }

  // Get All Departments
  GetAllDepartments() {
    this.dService.GetAllDepartments().subscribe((result) => {
      let depList: any[] = result;
      this.dep = depList;
    });
  }

  // Get All Faculties
  GetAllFaculties() {
    this.dService.GetAllFaculties().subscribe((result) => {
      let facList: any[] = result;
      this.fac = facList;
    });
  }


  //Get Search
  searchInput: string = "";
  searchDepartment() {
    if (this.searchInput.trim() === "") {
      location.reload();
      this.GetAllDepartments();
    } else {
      this.dService.SearchDepartment(this.searchInput).subscribe(
        (result) => {
          let depList: any[] = result;
          if (depList.length > 0) {
            this.dep = depList;
          } else {
            this.showErrorAlert('No departments found matching your search.');
          }
        },
        (error) => {
          this.showErrorAlert('Error searching for departments');
        }
      );
    }
  }



  deleteDepartment(department_ID: Number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this department?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dService.DeleteDepartment(department_ID).subscribe(
          () => {
            let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '28');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Deleted A Department");

          this.dService.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
            Swal.fire('Deleted!', 'The department has been deleted.', 'success');
        },
        (error: any) => {
          Swal.fire('Error', 'An error occurred while deleting the department', 'error');
        }
      );
    } else if (result.isDenied || result.isDismissed) {
      Swal.fire('Delete department has been cancelled', '', 'error');
    }
  });
  }

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      timer: 3000,
    });
  }

  // Update Department page link
  updateDepartment(department_ID: Number) {
    this.router.navigate(['/updateDep', department_ID]);
  }
}
