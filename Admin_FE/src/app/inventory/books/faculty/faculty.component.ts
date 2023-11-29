import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Faculty } from 'src/app/shared/faculty';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {
  fac: Faculty[] = [];

  constructor(private dService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.GetAllFaculties();
  }

  GetAllFaculties() {
    this.dService.GetAllFaculties().subscribe(
      (result: any) => {
        this.fac = result;
      },
      (error) => {
        this.showErrorAlert('Error fetching faculties');
      }
    );
  }

  deleteFaculty(faculty_ID: number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this faculty?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dService.DeleteFaculty(faculty_ID).subscribe(
          () => {
            let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '25');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Deleted A Faculty");

          this.dService.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
            Swal.fire('Deleted!', 'The faculty has been deleted.', 'success');
        },
        (error: any) => {
          Swal.fire('Error', 'An error occurred while deleting the faculty', 'error');
        }
      );
    } else if (result.isDenied || result.isDismissed) {
      Swal.fire('Delete faculty has been cancelled', '', 'error');
    }
  });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
  }

  updateFaculty(faculty_ID: number) {
    this.router.navigate(['/updateFac', faculty_ID]);
  }

  searchInput: string = '';

  searchFaculty() {
    if (this.searchInput.trim() === '') {
      this.GetAllFaculties();
    } else {
      this.dService.SearchFaculty(this.searchInput).subscribe(
        (result: any) => {
          this.fac = result;
        },
        (error) => {
          this.showErrorAlert('Error searching faculties');
        }
      );
    }
  }

 

  // Show error alert using SweetAlert
  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error'
    });
  }
}
