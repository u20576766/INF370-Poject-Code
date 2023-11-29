import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Voucher } from 'src/app/shared/voucher';
import Swal from 'sweetalert2';
import { AuditTrail } from 'src/app/shared/audit-trail';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.scss']
})
export class EditVoucherComponent {

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  //Creating the form 
  originalVoucher: Voucher = new Voucher();
  currentDate = new Date(); 
  minimumDate: string ="";
  newDate: string = "";

  strDay: string = "";
  strMonth: string ="";

  formEditVoucher: FormGroup = new FormGroup({
    percent: new FormControl('', [Validators.required]),
    expiry_Date: new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {

    //get id
    this.activatedRoute.params.subscribe(params => {


      //get data by query
      this.dataService.GetSelectedVoucher(params['id']).subscribe(response => {

        //place response in page
        this.originalVoucher = response as Voucher;

        //setting up the current date to limit the date picker in the format datepicker takes (yyyy-MM-dd)
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1; // Months are zero-based, so you need to add 1
        const day = this.currentDate.getDate();
        if (day < 10){
          this.strDay = "0"+ day.toString();
        }
        else {
          this.strDay = day.toString()
        };

        if (month < 10) {
          this.strMonth = "0"+ month.toString();
        }
        else {
          this.strMonth = month.toString();
        }
        this.minimumDate = year.toString() +"-"+ this.strMonth+"-"+ this.strDay;
      })



    })

  }

  AbortEditVoucher(){
    Swal.fire({
      icon: 'error',
      text: 'Edit Voucher has been aborted.',
    }).then( (answer) =>{
      if ( (answer.isConfirmed) || (answer.isDismissed) )
      {
        this.router.navigate(['/vouchers'])
      }
    });
  }

  ConfirmEditVoucher() {
    Swal.fire({
      title: 'Do you want to save the changes made to this voucher?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) //if user clicked yes
      {
        this.editAVoucher();
      } else if ( (result.isDenied) || (result.isDismissed))//if user clicked no
      {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }



  editAVoucher()
  {
    if (this.formEditVoucher.controls['expiry_Date']?.invalid) 
    {
      Swal.fire('Please fill in the form','','warning')
    }
    else {
      this.strDay = "";
      this.strMonth = "";
      //retrieving selected date and converting it to the string format of the DB
      const dateString = this.formEditVoucher.value.expiry_Date;
      const dateObject = new Date(dateString);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      if (day < 10){
        this.strDay = "0"+ day.toString();
      }
      else {
        this.strDay = day.toString()
      };
  
      if (month < 10) {
        this.strMonth = "0"+ month.toString();
      }
      else {
        this.strMonth = month.toString();
      }
  
      this.newDate = this.strDay +"-"+ this.strMonth +"-"+ year.toString();
  
  
      let editedVoucher = new Voucher();
      editedVoucher.percent = this.originalVoucher.percent;
      editedVoucher.expiry_Date = this.newDate; 
  
     this.dataService.UpdateAVoucher(this.originalVoucher.voucher_ID, editedVoucher).subscribe((response:any) => {

      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);    
        const fullname = userObject.name + " " + userObject.surname; 
  
            let newTrail = new FormData();
            newTrail.append('AuditEntryTypeID','11');
            newTrail.append('Employee_ID', userObject.employee_ID);
            newTrail.append('Comment', "Updated Voucher '"+editedVoucher.percent+" OFF, Expires: '"+editedVoucher.expiry_Date+"' " );      
      
            this.dataService.GenerateAuditTrail(newTrail).subscribe( response => {
              Swal.fire('Voucher has been updated successfully','','success');  
              this.router.navigate(['/vouchers'])
            });        
      } 
      else {
        console.log("loggedInUser is null");
      }
  
     });
  
    }

  }

}