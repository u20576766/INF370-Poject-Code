import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  firstName: string = '';
  studentId: number | null = null; // Initialize with null

  constructor(private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.firstName = localStorage.getItem('firstName') || '';
    this.studentId = +localStorage.getItem('studentId')! || null; // Get student ID from local storage

    this.authService.authStatus.subscribe((authenticated) => {
      if (!authenticated) {
        window.location.href = '/Login';
      }
    });
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout();
    window.location.href = '/Login';
  }

  deleteAccount() {
    if (this.studentId === null) {
      // Handle the case where studentId is not available
      Swal.fire('Error!', 'Student ID not found.', 'error');
      return;
    }

    // Use SweetAlert for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const studentId = this.authService.getStudentID(); // Retrieve the student ID from local storage

        if (!studentId) {
          // Handle the case where student ID is not found in local storage
          this.showErrorAlert('Student ID not found.');
          return;
        }
        // Call the deleteAccount method from your dataService with the studentId
        this.authService.deleteAccount().subscribe(
          (response) => {
            // Handle success (account deleted)
            Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
            this.authService.logout();
            window.location.href = '/Login';// Automatically log out after deleting the account
          },
          (error) => {
            // Handle error
            Swal.fire('Error!', 'Account deletion failed. Please try again later.', 'error');
          }
        );
      }
    });
  }

  // Helper method to show an error SweetAlert
  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

}
