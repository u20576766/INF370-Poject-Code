import { Component, OnInit } from '@angular/core';
import { Supplier } from '../shared/supplier';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  supp: Supplier[] = []

  constructor(private dService: DataService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.GetSuppliers()
  }

  // Get All Suppliers
  GetSuppliers() {
    this.dService.GetAllSuppliers().subscribe(result => {
      let suppList: any[] = result;
      this.supp = suppList;
    },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching suppliers.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  // Delete a supplier with SweetAlert confirmation
  DeleteSupplier(supplier_ID: number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this supplier?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dService.DeleteSupplier(supplier_ID).subscribe(
          (response: any) => {
            const index = this.supp.findIndex(supplier => supplier.supplier_ID === supplier_ID);
            if (index !== -1) {
              this.supp.splice(index, 1);
            }
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '60');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted A Supplier");

              this.dService.GenerateAuditTrail(newTrail).subscribe(response => { });
            }
            else {
              console.log("loggedInUser is null");
            }
            Swal.fire('Deleted!', 'The supplier has been deleted.', 'success');
          },
          (error: any) => {
            Swal.fire('Error', 'An error occurred while deleting the supplier', 'error');
          }
        );
      } else if (result.isDenied || result.isDismissed) {
        Swal.fire('Delete supplier has been cancelled', '', 'error');
      }
    });
  }


  // UpdateSupplier page link
  updateSupplier(supplier_ID: number) {
    this.router.navigate(['/update', supplier_ID]);
  }

  // Search for suppliers
  searchInput: string = "";
  searchSupplier() {
    if (this.searchInput.trim() === "") {
      this.GetSuppliers();
    } else {
      this.dService.SearchSupplier(this.searchInput).subscribe(result => {
        let suppList: any[] = result;
        if (suppList.length === 0) {
          Swal.fire({
            title: 'No Results Found',
            text: 'No suppliers match your search.',
            icon: 'error'
          });
        } else {
          this.supp = suppList;
        }
      });
    }
  }
}

