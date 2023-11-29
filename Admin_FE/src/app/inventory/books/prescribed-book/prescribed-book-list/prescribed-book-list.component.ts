import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescribed-book-list',
  templateUrl: './prescribed-book-list.component.html',
  styleUrls: ['./prescribed-book-list.component.scss']
})
export class PrescribedBookListComponent {
  constructor(private dataService: DataService, private router: Router) { }

  private uploadPrescribedBookList(file: File): void {
    const formData = new FormData();
    formData.append('excelFile', file, file.name);

    this.dataService.uploadPrescribedBookList(formData).subscribe(
      () => {
        console.log('success');
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while uploading the file: ' + error.error, 'error');
      }
    );
  }

  uploadList(): void {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('File to upload from button click:', file);

      this.uploadPrescribedBookList(file); // Upload the file

      // Success message and function after uploadList() is complete
    
      const newObject = window.localStorage.getItem("loggedInUser");

      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        const fullname = userObject.name + " " + userObject.surname;

        const newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '15');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Uploaded Prescribed Book List: '" + file.name + "'");

        this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          // Update was successful
          Swal.fire('Prescribed Book List has been uploaded successfully', '', 'success');
          this.router.navigate(['/prescribed-book']);
        });
      } else {
        console.log("loggedInUser is null");
      }
    } else {
      Swal.fire('No File Selected', 'Please select a file to upload.', 'warning');
    }
  }
}
