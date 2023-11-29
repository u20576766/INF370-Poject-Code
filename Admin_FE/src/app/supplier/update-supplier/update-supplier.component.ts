import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/shared/supplier';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.scss']
})
export class UpdateSupplierComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute) { }

  //Creating the form 
  upSupplier: Supplier = new Supplier();
  formUpdate: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    cell: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {

    //get id
    this.activated.params.subscribe(params => {


      //get data by query
      this.data.GetSupplier(params['id']).subscribe(response => {

        //place response in page
        this.upSupplier = response as Supplier;

        //place retrieved data in cells
        this.formUpdate.controls['name'].setValue(this.upSupplier.supplier_Name);
        this.formUpdate.controls['address'].setValue(this.upSupplier.supplier_Address);
        this.formUpdate.controls['email'].setValue(this.upSupplier.supplier_Email);
        this.formUpdate.controls['cell'].setValue(this.upSupplier.supplier_CellNumber);
      })

    })

  }


  UpdateSupplier() {
    let supplier = new Supplier();
    supplier.supplier_Name = this.formUpdate.value.name;
    supplier.supplier_Address = this.formUpdate.value.address;
    supplier.supplier_Email = this.formUpdate.value.email;
    supplier.supplier_CellNumber = this.formUpdate.value.cell;

    this.data.UpdateSupplier(this.upSupplier.supplier_ID, supplier).subscribe(
      (response: any) => {

        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          const fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '59');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Updated A Supplier: " + this.formUpdate.value.name);

          this.data.GenerateAuditTrail(newTrail).subscribe(response => { });
        }
        else {
          console.log("loggedInUser is null");
        }
        this.router.navigate(['/supplier']);
        Swal.fire('Success', 'Supplier has been successfully updated', 'success');
      },
      (error: any) => {
        Swal.fire('Error', 'Supplier email or cell number already exist. Cannot add a supplier.', 'error');
      }
    );
  }

  showUpdateConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this supplier?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UpdateSupplier();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update Supplier has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/supplier']);
    });
  }
}