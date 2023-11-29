import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup ,FormControl,Validators} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { RouterModule } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { EquipmentModel } from 'src/app/shared/EquipmentModel';
import { Book } from 'src/app/shared/books';
import { StockTakeViewModel } from 'src/app/shared/stocktake';
import { Books } from 'src/app/shared/books';
import { Equi } from 'src/app/shared/equipment2';


import { WriteOffViewModel } from 'src/app/shared/WriteOff';

@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.scss']
})
export class WriteOffComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private fb: FormBuilder, private dataService: DataService, private router: Router) {
  }


  BookID :any =0;
  StockBook:Book= new Book();
  bookList:Book[]=[];
  StockEquipment:Equi= new Equi();
  showEquipment : boolean = false;
  showBook:boolean = false;
  EquipmentID :number =0;



  WriteOffForm:FormGroup = new FormGroup({
    reason :new FormControl('',[Validators.required]),
    quantity :new FormControl('')
  })

  ngOnInit(): void {
     this.activatedRoute.params.subscribe(params =>{
       const passedId = params['id'];


       //Checking the length
       if(passedId.length === 1 ) //this an equipment
       {
               this.dataService.GetEquipmentByid(passedId).subscribe( res =>{
                      this.StockEquipment = res as Equi;
                     this.showEquipment = true;
                     this.EquipmentID = passedId;
               })
       }
       else // this is a book
       {
            this.dataService.GetBookByISBN(passedId).subscribe(
              res =>{

                //get the book
                this.StockBook = res as Book;

                //get the book id
                this.dataService.GetBooks().subscribe((result:Books)=>{
                  this.bookList = result.$values;
                  const FoundBook = this.bookList.find(b => b.isbn === passedId)
                  if(FoundBook)
                  {
                    this.BookID = FoundBook.book_ID;
                    this.showBook = true;
                  }else{
                      Swal.fire('Error','Error displaying the write off screen','error')
                  }
                })

              }
            )
       }

     })
  }

  WriteOffBook()
  {
      if(this.WriteOffForm.valid)
      {
         const quantity = Number(this.WriteOffForm.get('quantity')?.value);

         if(quantity <=0 || isNaN(quantity))
         {
          Swal.fire('Provide valid quantity  value.', '', 'error');
         }
         else{

          Swal.fire({
            title: 'Confirmation ',
            text:'Confirm that write off information can be captured',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: "green",
            confirmButtonText: 'Yes',
            denyButtonText: 'No'
          }).then((result)=>{

            if(result.isConfirmed)
            {
              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);


                const newInfo : WriteOffViewModel={

                  quantity:this.WriteOffForm.value.quantity,
                  book_ID :this.BookID,
                  equipment_ID :0,
                  employee_ID:userObject.employee_ID,
                  reason :this.WriteOffForm.value.reason
                }

                this.dataService.writeOff(newInfo).subscribe((response:any)=>
                {
                  if (typeof response === 'string' && response.includes('Write-off successful!')) {

                    let newObject = window.localStorage.getItem("loggedInUser");
                    if (newObject !== null) {
                      const userObject = JSON.parse(newObject);
                      const fullname = userObject.name + " " + userObject.surname;

                      let newTrail = new FormData();
                      newTrail.append('AuditEntryTypeID', '13');
                      newTrail.append('Employee_ID', userObject.employee_ID);
                      newTrail.append('Comment', "Write off of  boook , ISBN : " + this.StockBook.isbn +  " , Quantity :  "+ newInfo.quantity);

                      this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                       // Update was successful
                    Swal.fire('success','Write off  was  successfully', 'success');
                    this.router.navigate(['/books']);
                      });
                    }
                    else {
                      console.log("loggedInUser is null");
                      console.error(`Unexpected response:`, response);
                      Swal.fire({
                        icon: 'error',
                        title: 'WRITE OFF UNSUCCESSFUL',
                        text: 'Write off  was   unsuccessful. Try again later.',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                      }).then(() => {
                        this.router.navigate(['/books']);
                      });
                    }


                  }
                  else{


                    console.error(`Unexpected response:`, response);
                    Swal.fire({
                      icon: 'error',
                      title: 'WRITE OFF UNSUCCESSFUL',
                      text: 'Write off unsuccessful. Try again.',
                      confirmButtonColor: '#d33',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.router.navigate(['/books']);
                    });

                  }//end of else
                })

              }

            }
          })

         }

      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Incomplete information',
          text: 'Please provide the required information for stock take.'})
      }


  }



  WriteOffEquipment()
  {
      if(this.WriteOffForm.valid)
      {
         const quantity = Number(this.WriteOffForm.get('quantity')?.value);

         if(quantity <=0 || isNaN(quantity))
         {
          Swal.fire('Provide valid quantity  value.', '', 'error');
         }
         else{

          Swal.fire({
            title: 'Confirmation ',
            text:'Confirm that write off information can be captured',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: "green",
            confirmButtonText: 'Yes',
            denyButtonText: 'No'
          }).then((result)=>{

            if(result.isConfirmed)
            {
              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);


                const newInfo : WriteOffViewModel={

                  quantity:this.WriteOffForm.value.quantity,
                  book_ID :0,
                  equipment_ID :this.EquipmentID,
                  employee_ID:userObject.employee_ID,
                  reason :this.WriteOffForm.value.reason
                }

                this.dataService.writeOff(newInfo).subscribe((response:any)=>
                {
                  if (typeof response === 'string' && response.includes('Write-off successful!')) {

                    let newObject = window.localStorage.getItem("loggedInUser");
                    if (newObject !== null) {
                      const userObject = JSON.parse(newObject);
                      const fullname = userObject.name + " " + userObject.surname;

                      let newTrail = new FormData();
                      newTrail.append('AuditEntryTypeID', '13');
                      newTrail.append('Employee_ID', userObject.employee_ID);
                      newTrail.append('Comment', "Write off of equipment  , " +this.StockEquipment.name + " , Quantity: "+ newInfo.quantity);

                      this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                       // Update was successful
                    Swal.fire('success','Write off  was  successfully', 'success');
                    this.router.navigate(['/lab_equipment']);
                      });
                    }
                    else {
                      console.log("loggedInUser is null");
                      console.error(`Unexpected response:`, response);
                      Swal.fire({
                        icon: 'error',
                        title: 'WRITE OFF UNSUCCESSFUL',
                        text: 'Write off  was   unsuccessful. Try again later.',
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
                      title: 'WRITE OFF UNSUCCESSFUL',
                      text: 'Write off unsuccessful. Try again.',
                      confirmButtonColor: '#d33',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.router.navigate(['/lab_equipment']);
                    });

                  }//end of else
                })

              }

            }
          })

         }

      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Incomplete information',
          text: 'Please provide the required information for stock take.'})
      }


  }




  cancelWriteOff() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Write Off has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/books']);
    });
  }



  CancelWriteOffEquipment()
  {
    Swal.fire({
      title: 'Cancelled',
      text: 'Write Off has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/lab_equipment']);
    });
  }




}