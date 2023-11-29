import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Vat } from 'src/app/shared/vat';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Validator } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-vat',
  templateUrl: './update-vat.component.html',
  styleUrls: ['./update-vat.component.scss']
})
export class UpdateVatComponent implements OnInit {

  constructor(private dService: DataService, private router: Router, private activated: ActivatedRoute) { }


  formUpdate: FormGroup = new FormGroup({
    percent: new FormControl('', [Validators.required])
  })
  VAT: Vat[] = [];

  ngOnInit(): void {
    this.formUpdate.addControl('percent', new FormControl());
    this.dService.GetVAT().subscribe(Response => {
      this.VAT.push(Response);
      console.log(this.VAT[0].percent);

      // this.formUpdate.controls['name'].setValue(this.upSupplier.sup_Name);
      this.formUpdate.controls['percent'].setValue(this.VAT[0].percent);
    });


  }



  UpdateVat() {
    const percentValue = this.formUpdate.get('percent')?.value;

    let editedVAT = new Vat();
    editedVAT.percent = percentValue;
    editedVAT.vaT_Id = 1;
    console.log(percentValue);

    this.dService.EditVAT(percentValue, editedVAT).subscribe((response: any) => {
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        const fullname = userObject.name + " " + userObject.surname;

        let newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '3');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Updated vat to '" + editedVAT.percent + "%'");

        this.dService.GenerateAuditTrail(newTrail).subscribe(response => {

          this.router.navigate(['/vat']);
          Swal.fire('Success', 'VAT has been successfully updated', 'success');
        });
      }
      else {
        console.log("loggedInUser is null");
        Swal.fire('Error', 'Failed to update VAT ', 'error');
      }



    },
      (error: any) => {
        Swal.fire('Error', 'Failed to update VAT ', 'error');
      }
    );
  }


  showUpdateConfirmation() {
    const percentValue = this.formUpdate.get('percent')?.value;

    // Check if the percentValue is NOT a number or is not within the range
    if (typeof percentValue !== 'number' || percentValue < 1 || percentValue > 99) {
      Swal.fire('Error', 'VAT must be between 1 and 99 percent', 'error');
    } else {
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you want to update the VAT?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
      }).then((result) => {
        if (result.isConfirmed) {
          this.UpdateVat();
        }
      });
    }
  }


  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update VAT has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/vat']);
    });
  }
}
