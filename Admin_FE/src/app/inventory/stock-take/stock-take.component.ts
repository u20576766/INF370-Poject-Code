import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,FormControl,Validators} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EquipmentModel } from 'src/app/shared/EquipmentModel';
import { Book } from 'src/app/shared/books';
import { StockTakeViewModel } from 'src/app/shared/stocktake';
import { Books } from 'src/app/shared/books';

@Component({
  selector: 'app-stock-take',
  templateUrl: './stock-take.component.html',
  styleUrls: ['./stock-take.component.scss']
})
export class StockTakeComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,private fb: FormBuilder, private dataService: DataService, private router: Router) {
  }


  BookID :any =0;
  StockBook:Book= new Book();
  bookList:Book[]=[];
  stockTakeForm :FormGroup = new FormGroup
  ({

    cqua: new FormControl(''),//current qu
      nqua: new FormControl(''), //new Quan
      notes: new FormControl('',[Validators.required])
  })

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      const passedIsbn = params['isbn']; // Make sure 'id' matches the parameter name in your route


        this.dataService.GetBookByISBN(passedIsbn).subscribe(res => {
          this.StockBook = res as Book;

          //Show off the current q
          this.stockTakeForm.controls['cqua'].setValue(this.StockBook.quantity);
          this.stockTakeForm.get('cqua')?.disable();

          this.dataService.GetBooks().subscribe(
            (result: Books) => {
              this.bookList = result.$values;
               const FoundBook = this.bookList.find(b => b.isbn === passedIsbn)

               if (FoundBook) {
                this.BookID = FoundBook.book_ID;
                console.log('Book with ISBN 7888 found. Book ID:', this.BookID);
              } else {
                console.log('Book with ISBN  not found.');
              }


            },
            (error) => {
              console.error('Error fetching books:', error);
            }
          );
        })})




  }//e

  //Cancel

  cancelStockTake() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Stock Take has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/books']);
    });
  }


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
            book_ID: this.BookID,
            equipment_ID: 0,
            employee_ID:userObject.employee_ID,
          }//end of newInfo



          this.dataService.updateBookStock(NewInfo).subscribe((response:any)=>
          {
            //Updatesuccesfully
            if (typeof response === 'string' && response.includes('Stock take for book updated successfully')) {

              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);
                const fullname = userObject.name + " " + userObject.surname;

                let newTrail = new FormData();
                newTrail.append('AuditEntryTypeID', '12');
                newTrail.append('Employee_ID', userObject.employee_ID);
                newTrail.append('Comment', "Stock Take. Book ISBN : "+ this.StockBook.isbn +  " ,  New Quantity :  "+ NewInfo.quantity_On_Hand);

                this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                 // Update was successful
              Swal.fire('Stock take information has been captured successfully', '', 'success');
              this.router.navigate(['/books']);
                });
              }
              else {
                console.log("loggedInUser is null");
                console.error(`Unexpected response:`, response);
                Swal.fire({
                  icon: 'error',
                  title: 'Updating books unsuccessful',
                  text: 'Capturing of stock take information for books has been unsuccessful. Try again later.',
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
                title: 'Updating book information unsuccessful',
                text: 'Updating book information has been unsuccessful. Try again.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then(() => {
                this.router.navigate(['/books']);
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

}
