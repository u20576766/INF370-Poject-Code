import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from './services/data.service';
import { User } from './shared/user';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { Router } from '@angular/router';
import { EmployeeType } from './shared/employee-type';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'UniBooks';
  employeeID: number = 0;
  isSecondDivHidden = true;
  isLoggedIn = false;
  hide = true;
  employeeTypes: EmployeeType[] = [];
  employeeTypeName: string = ''; // Property to store the employee type name
  image: string = "";

  constructor(
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService // Inject MatSnackBar
  ) { }

  ngOnInit() {
    this.loadEmployeeTypes();
    const loginStatus = localStorage.getItem('login');
    if (loginStatus === 'true') {
      this.isLoggedIn = true;
    }

    // User Information
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.employeeID = userObject.employee_ID;
      this.LoggedInName = userObject.name + " " + userObject.surname;
      this.empType = userObject.employee_Type_ID;
      this.image = userObject.image;

      // Fetch the employee type name based on the employee type ID
      const employeeType = this.employeeTypes.find(
        (type) => type.employee_Type_ID === this.empType
      );
      if (employeeType) {
        this.employeeTypeName = employeeType.name;
      } else {
        this.employeeTypeName = 'Unknown'; // Set a default name if not found
      }
    }
  }

  formLogIn: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  togglePassword(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }

  loadEmployeeTypes(): void {
    this.dataService.getAllEmployeeTypes().subscribe(result => {
      let etList: any[] = result
      etList.forEach((element) => {
        this.employeeTypes.push(element)
      });
    })
  }

  toggleSecondDiv() {
    if (this.isLoggedIn) {
      // If logged in, log out and update login status in localStorage
      this.isLoggedIn = false;
      localStorage.setItem('login', 'false'); // Set login to 'false' when logging out
    } else {
      // If not logged in, log in and update login status in localStorage
      this.isLoggedIn = true;
      localStorage.setItem('login', 'true'); // Set login to 'true' when logging in
    }
  }

  logout() {
    // Logout function
    this.isLoggedIn = false;
    localStorage.setItem('login', 'false');
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.LoggedInName = userObject.name + " " + userObject.surname;
      this.image = userObject.image;

      let newTrail = new FormData();
      newTrail.append('AuditEntryTypeID', '63');
      newTrail.append('Employee_ID', userObject.employee_ID);
      newTrail.append('Comment', "Employee Logged Out: " + this.LoggedInName);

      this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
      });
    }
    else {
      console.log("loggedInUser is null");
    }

    // Show a pink snackbar for logout success
    location.reload();
    this.snackBar.open('Logout successful', 'Close', {
      duration: 3000, // Duration in milliseconds
      panelClass: ['pink-snackbar'], // Custom CSS class for pink color
    });
  }

  // Login Function
  LoggedInName: string = "";
  empType: number = 0;

  LogIn() {
    console.log("Hi");
    let logInUser = new User();
    logInUser.userName = this.formLogIn.value.userName;
    logInUser.password = this.formLogIn.value.password;

    console.log(logInUser);

    this.authService.LogIn(logInUser).subscribe(
      (response) => {
        console.log("Login Response:", response);
        localStorage.setItem("loggedInUser", JSON.stringify(response));
        this.toggleSecondDiv();
        this.router.navigate(['/dashboard']);

        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          this.LoggedInName = userObject.name + " " + userObject.surname;
          this.empType = userObject.employee_Type_ID;

          // Fetch the employee type name based on the employee type ID
          const employeeType = this.employeeTypes.find(
            (type) => type.employee_Type_ID === this.empType
          );
          if (employeeType) {
            this.employeeTypeName = employeeType.name;
          } else {
            this.employeeTypeName = 'Unknown'; // Set a default name if not found
          }

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '62');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Employee Logged In: " + this.LoggedInName);

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          });
        }
        else {
          console.log("loggedInUser is null");
        }
        
        // Show a purple snackbar for login success
        location.reload();
        this.snackBar.open('Login successful', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['purple-snackbar'], // Custom CSS class for purple color
        });
      },
      (error) => {
        console.error("Login Error:", error);

        // Show a pink snackbar for login error
        this.snackBar.open('Invalid Login Attempt! Please try again later.', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['pink-snackbar'], // Custom CSS class for pink color
        });
      }
    );
  }
}
