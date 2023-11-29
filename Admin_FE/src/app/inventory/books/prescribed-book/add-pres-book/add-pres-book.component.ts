import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PrescribedBook } from 'src/app/shared/prescribedbook';
import { Module } from 'src/app/shared/module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pres-book',
  templateUrl: './add-pres-book.component.html',
  styleUrls: ['./add-pres-book.component.scss']
})
export class AddPresBookComponent implements OnInit {
  modules: Module[] = [];
  prescribedBook: PrescribedBook = {
    isbn: '',
    title: '',
    publisherName: '',
    authorName: '',
    edition: 0,
    year: 0,
    basePrice: 0,
    module_ID: 0
  };
  selectedModuleCode: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getAllModules();
  }

  getAllModules(): void {
    this.dataService.GetAllModules().subscribe(
      (modules) => {
        this.modules = modules;
      },
      (error) => {
        this.handleError('Error fetching modules: ' + error);
      }
    );
  }

  moduleChanged(): void {
    this.selectedModuleCode = this.getModuleCode(this.prescribedBook.module_ID);
  }

  getModuleCode(module_ID: number): string {
    const module = this.modules.find((m) => m.module_ID === module_ID);
    return module ? module.module_Code.toString() : 'N/A';
  }

  handleSuccess(message: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    }).then(() => {
      this.router.navigate(['/prescribed-book']);
    });
  }

  handleError(error: string) {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
    });
  }

  addPrescribedBook() {
    this.dataService.addPrescribedBook(this.prescribedBook).subscribe(
      (responseText) => {
        
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '16');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added New Prescribed Book: '" + this.prescribedBook.isbn + "'");

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
            // Update was successful
            Swal.fire('Prescribed has been added  successfully', '', 'success');
            this.router.navigate(['/prescribed-book']);
          });
        } else {
          console.log("loggedInUser is null");
        }
      },
      (error) => {
        // Handle error
        Swal.fire('Error', 'An error occurred while adding the prescribed book', 'error');
      }
    );
  }

  showConfirmationModal() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this prescribed book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addPrescribedBook();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      icon: 'error',
      title: 'Cancelled',
      text: 'Add Prescribed Book has been aborted.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/prescribed-book']);
    });
  }
}
