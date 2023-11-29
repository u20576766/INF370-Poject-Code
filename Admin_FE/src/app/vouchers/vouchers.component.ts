import { Component, OnInit } from '@angular/core';
import { Voucher } from '../shared/voucher';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { FormsModule, NgControl, NgControlStatus, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuditTrail } from '../shared/audit-trail';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent  implements OnInit {

  arrVouchers: Voucher[] = []
  selectedVoucher!: Voucher;
  searchQuery: string = "";
  intSearchPercent: number = 0;

  constructor( private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.getAllVouchers();
  }

    // RETRIEVE ALL VOUCHERS
    getAllVouchers() {
      this.arrVouchers = [];
      this.dataService.GetAllTheVouchers().subscribe(result => {
        let listVouchers: any[] = result
        listVouchers.forEach((element) => {
          this.arrVouchers.push(element)
        });
      })
    }

    
    
    searchVoucher() {
      if (this.searchQuery == "") {
        window.location.reload();
        this.getAllVouchers();
      }
      else {

        this.intSearchPercent = parseInt(this.searchQuery);
        const isConversionSuccessful: boolean = !isNaN(this.intSearchPercent);

        if (isConversionSuccessful == true) {

          if (this.intSearchPercent > 100 || this.intSearchPercent < 1) {
            Swal.fire('Please input a numeric value between 1 and 100','','warning');    

          }
          else{
            this.intSearchPercent = parseInt(this.searchQuery)
            this.dataService.SearchVoucherPercent(this.intSearchPercent).subscribe(
              result => {
                let listVouchers: any[] = result;
                this.arrVouchers = [];
                listVouchers.forEach( (element) => {
                  this.arrVouchers.push(element);
                });
              }
            );
  
          }
        }
        else {
          Swal.fire('Please input a numeric value between 1 and 100','','warning');    
        }

      }
    }
    

    goToEditVoucher(voucher_ID: Number) {
      this.router.navigate(['/edit-voucher', voucher_ID]);
    }  

    deleteVoucher(voucher_ID: number){

      Swal.fire({
        title: 'Are you sure you want to delete this voucher?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: "green",
        confirmButtonText: 'Yes',
        denyButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          
          this.dataService.GetSelectedVoucher(voucher_ID).subscribe(response => {
            //capture the retrieved voucher details
            this.selectedVoucher = response as Voucher;

            //delete voucher
            this.dataService.DeleteVoucher(voucher_ID).subscribe( (response:any) => {
              //then add info to audit trail
              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);    
                const fullname = userObject.name + " " + userObject.surname; 
          
                    let newTrail = new FormData();
                    newTrail.append('AuditEntryTypeID','10');
                    newTrail.append('Employee_ID', userObject.employee_ID);
                    newTrail.append('Comment', "Deleted '"+this.selectedVoucher.percent+"% OFF voucher, Expiry Date: "+this.selectedVoucher.expiry_Date+"'");      
              
                    this.dataService.GenerateAuditTrail(newTrail).subscribe( response => {
                      Swal.fire('Voucher has been updated successfully','','success');  
                      this.router.navigate(['/vouchers'])
                    });        
              } 
              else {
                console.log("loggedInUser is null");
              } });
        });
      }
      else if ( (result.isDenied) || (result.isDismissed))//if user clicked no
      {
        Swal.fire('Delete Voucher has been aborted', '', 'error')
      }
      })


    }  


}