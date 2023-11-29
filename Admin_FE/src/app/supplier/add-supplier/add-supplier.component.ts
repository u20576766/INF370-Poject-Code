import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/shared/supplier';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent {

  constructor(private data: DataService, private router: Router) { }

  formAdd: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    cell: new FormControl('', [Validators.required])
  });

  addSupplier() {
    let supp = new Supplier();
    supp.supplier_Name = this.formAdd.value.name;
    supp.supplier_Address = this.formAdd.value.address;
    supp.supplier_Email = this.formAdd.value.email;
    supp.supplier_CellNumber = this.formAdd.value.cell;

    this.data.AddSupplier(supp).subscribe(
      () => {
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '58');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Added A New Supplier: " + this.formAdd.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        this.router.navigate(['/supplier']);
        Swal.fire('Success', 'Supplier has been successfully added to the system.', 'success');
      },
      (error) => {
        Swal.fire('Error', 'Supplier name, email or cell number already exist. Cannot add a supplier.', 'error');
      }
    );
  }

  confirmAddSupplier() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this supplier?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addSupplier();
      }
    });
  }

  cancelAddSupplier() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Supplier has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/supplier']);
    });
  }
}
