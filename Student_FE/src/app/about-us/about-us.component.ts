import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../shared/shoppingcart';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeType } from '../shared/employee-type';
import { Employee } from '../shared/employee';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit{

  shoppingCart: ShoppingCart | null = null;
  employeeTypes: EmployeeType[] = [];
  employees: Employee[] = [];

  constructor(private data: DataService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this. getAllEmployeeTypes();
    this.getAllEmployees();
  }

  showProfile: boolean = true;
  useSharedFunction(): void {
    this.data.toggleProfile();
  }

  getAllEmployeeTypes(): void {
    this.data.getAllEmployeeTypes().subscribe(
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
    this.data.getAllEmployees().subscribe(
      (employees) => {
        this.employees = employees;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  
}
