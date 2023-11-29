import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EquipmentModel } from 'src/app/shared/EquipmentModel';
import { Equi } from 'src/app/shared/equipment2';
import { StockTakeViewModel } from 'src/app/shared/stocktake';

@Component({
  selector: 'app-stock-take-equipment',
  templateUrl: './stock-take-equipment.component.html',
  styleUrls: ['./stock-take-equipment.component.scss']
})
export class StockTakeEquipmentComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private fb: FormBuilder, private dataService: DataService, private router: Router) {
  }


  EquipmentId :number =0;
  StockEquipment:Equi= new Equi();

  stockTakeForm :FormGroup = new FormGroup
  ({

    cqua: new FormControl(''),//current qu
      nqua: new FormControl(''), //new Quan
      notes: new FormControl('',[Validators.required])
  })

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      const passedId = params['id']; // Make sure 'id' matches the parameter name in your route
      console.log('Passed ID:', passedId);
      this.EquipmentId= passedId;

        this.dataService.GetEquipmentByid(params['id']).subscribe(res => {
          this.StockEquipment = res as Equi;

          //Show off the current q
          this.stockTakeForm.controls['cqua'].setValue(this.StockEquipment.quantity_On_Hand);
          this.stockTakeForm.get('cqua')?.disable();
        })})

  }//end of ngOn



  updateStock() {
    if (this.stockTakeForm.valid) {

        const newq = Number(this.stockTakeForm.get('nqua')?.value)
      if ( newq <= 0 || isNaN(newq)) {
        Swal.fire('Provide valid quantity  value.', '', 'error');}
        else{

      Swal.fire({
        title: 'Confirmation ',
        text:'Confirm that stock take information can be captured',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: "green",
        confirmButtonText: 'Yes',
        denyButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          let newObject = window.localStorage.getItem("loggedInUser");
          if (newObject !== null) {
            const userObject = JSON.parse(newObject);

          const NewInfo :StockTakeViewModel={

            quantity_On_Hand: this.stockTakeForm.value.nqua,
            quantity: this.stockTakeForm.value.cqua  ,
            notes: this.stockTakeForm.value.notes,
            book_ID: 0,
            equipment_ID: this.EquipmentId,
            employee_ID:userObject.employee_ID,
          }//end of newInfo



          this.dataService.updateEquipmentStock(NewInfo).subscribe((response:any)=>
          {
            //Updatesuccesfully
            if (typeof response === 'string' && response.includes('Stock take for equipment updated successfully')) {

              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);
                const fullname = userObject.name + " " + userObject.surname;

                let newTrail = new FormData();
                newTrail.append('AuditEntryTypeID', '12');
                newTrail.append('Employee_ID', userObject.employee_ID);
                newTrail.append('Comment', "Stock Take of equipment , " + this.StockEquipment.name +  " ,  New Quantity :  "+ NewInfo.quantity_On_Hand);

                this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                 // Update was successful
              Swal.fire('Stock take information has been captured successfully', '', 'success');
              this.router.navigate(['/lab_equipment']);
                });
              }
              else {
                console.log("loggedInUser is null");
                console.error(`Unexpected response:`, response);
                Swal.fire({
                  icon: 'error',
                  title: 'Updating equipment unsuccessful',
                  text: 'Capturing of stock take information for equipment has been unsuccessful. Try again later.',
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/lab_equipment']);
                });
              }


            }
            else{


              console.error(`Unexpected response:`, response);
              Swal.fire({
                icon: 'error',
                title: 'Updating equipment unsuccessful',
                text: 'Updating equipment has been unsuccessful. Try again.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then(() => {
                this.router.navigate(['/lab_equipment']);
              });

            }//end of else

          })


          } //end of newObject



        }
      })

    }
  }

  //invalid
    else{

      Swal.fire({
        icon: 'error',
        title: 'Incomplete information',
        text: 'Please provide the required information for stock take.'})
    }

  }//end of update


  cancelStockTake() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Stock Take has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/lab_equipment']);
    });
  }

}