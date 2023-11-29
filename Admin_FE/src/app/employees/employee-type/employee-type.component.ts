import { Component, OnInit } from '@angular/core';
import { EmployeeType } from 'src/app/shared/employee-type';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employee-type',
  templateUrl: './employee-type.component.html',
  styleUrls: ['./employee-type.component.scss']
})
export class EmployeeTypeComponent implements OnInit {
  employeeTypes: EmployeeType[] = [];
  searchInput: string = '';

  constructor(
    private router: Router,
    private dataService: DataService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadEmployeeTypes();
    console.log(this.employeeTypes)

  }

  loadEmployeeTypes(): void {
    this.dataService.getAllEmployeeTypes().subscribe(result => {
      let etList: any[] = result
      etList.forEach((element) => {
        this.employeeTypes.push(element)
      });
    })
  }

  updateEmployeeType(employee_Type_ID: number): void {
    this.router.navigate(['/UpdateE_Type', employee_Type_ID])
  }

  deleteEmployeeTypeConfirmation(etId: number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this employment type?',
      icon: 'question',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Confirm',
      denyButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteEmployeeType(etId).subscribe(
          () => {
            const index = this.employeeTypes.findIndex(type => type.employee_Type_ID === etId );
            if (index !== -1) {
              this.employeeTypes.splice(index, 1);
            }

            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;
  
              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '41');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted Employee Type");
  
              this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
              });
            }
            
            Swal.fire('Deleted!', 'The employee type has been deleted.', 'success');
          },
          (error: any) => {
            Swal.fire('Error', 'An error occurred while deleting the employee type', 'error');
          }
        );
      } else if (result.isDenied || result.isDismissed) {
        Swal.fire('Delete employee type has been cancelled', '', 'error');
      }
    });
  }



  searchEmployeeType() {
    if (this.searchInput.trim() === "") {
      window.location.reload();
      this.loadEmployeeTypes();
    } else {
      this.dataService.getEmployeeTypes(this.searchInput).subscribe(result => {
        let etList: any[] = result;
        this.employeeTypes = [];
        etList.forEach((element) => {
          this.employeeTypes.push(element);
        });
      });
    }
  }



}
