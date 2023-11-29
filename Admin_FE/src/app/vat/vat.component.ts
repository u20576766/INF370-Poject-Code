import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import{ Vat} from '../shared/vat'
import Swal from 'sweetalert2';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.scss']
})
export class VatComponent implements OnInit {



  constructor(private dService:DataService , private router:Router)
  {}

  VAT:Vat[]=[];
  fullname: string = "";

  ngOnInit(): void {
    this.getVAT()
    console.log(this.VAT)
  }

  getVAT() {
    this.dService.GetVAT().subscribe(result => {
      this.VAT.push(result);
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        this.fullname = userObject.name + " " + userObject.surname;


        let newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '4');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Viewed VAT");

        this.dService.GenerateAuditTrail(newTrail).subscribe(response => {
        });
      }
      else {
        console.log("loggedInUser is null");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching the vat.',
          confirmButtonText: 'OK'
        });
      }


    },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching the vat.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
 



}  