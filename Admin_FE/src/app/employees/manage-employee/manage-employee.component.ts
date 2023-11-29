import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Employee } from 'src/app/shared/employee';
import { EmployeeType } from 'src/app/shared/employee-type';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent implements OnInit {
  employees: Employee[] = [];
  employeeTypes: EmployeeType[] = [];
  searchQuery: string = ''; // Add a property to hold the search query

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getAllEmployees();
    this.getAllEmployeeTypes();
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

  getEmployeeTypeName(employeeTypeID: number): string {
    const employeeType = this.employeeTypes.find(type => type.employee_Type_ID === employeeTypeID);
    return employeeType ? employeeType.name : 'Unknown Type';
  }

  getAllEmployees(): void {
    this.dataService.getAllEmployees().subscribe(
      (employees) => {
        this.employees = employees;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this employee?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteEmployee(id).subscribe(
          (response) => {
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '38');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted employee ");

              this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
              });
            }
            console.log('Delete employee response:', response);
            if (response === 'Employee deleted successfully.') {
              Swal.fire('Deleted!', response, 'success');
              this.getAllEmployees(); // Refresh the employee list
            } else {
              Swal.fire('Error', response, 'error');
            }
          },
          (error) => {
            console.error('Error deleting employee:', error);
            Swal.fire('Error', 'An error occurred while deleting the employee.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Delete employee has been cancelled', '', 'error');
      }
    });
  }

  // Function to navigate to the update-employee page with employee ID as a parameter
  updateEmployee(id: number): void {
    this.router.navigate(['/update-employee', id]);
  }

  // Function to filter employees based on the search query
  filterEmployees(): Employee[] {
    return this.employees.filter(employee =>
      employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      employee.surname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
