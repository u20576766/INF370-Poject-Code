import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Equi, Equipment } from 'src/app/shared/equipment2';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { EquipmentViewModel } from 'src/app/shared/EquipmentViewModel';
import { GetEquipments } from 'src/app/shared/GetEquipmentViewmodel';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';




@Component({
  selector: 'app-lab-equipment',
  templateUrl: './lab-equipment.component.html',
  styleUrls: ['./lab-equipment.component.scss']
})
export class LabEquipmentComponent implements OnInit {


    searchText: string = '';

    getEqui: GetEquipments[]=[];

  constructor(private dataservices: DataService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getEquipments();



  }

  getEquipments() {
    this.dataservices.GetEquipments()
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while retrieving equipment data!',
          });
          return throwError('Error occurred');
        })
      )
      .subscribe((response: any) => {
        // Check if the response contains a '$values' property and use it if available
        const equipmentData = response.$values || response;
        console.log("equipments", equipmentData);
        // Assuming 'equipmentData' is an array of equipment objects
        this.getEqui = equipmentData;
      });

    if(this.getEqui === null)
    {
      Swal.fire({
         icon:'info',
        title:'Equipment',
        text:'No equipment was found !',
      });
    }
  }



  searchEquipments() {
    if (!this.searchText) {
      // If the search text is empty, reset the displayed equipment list
      this.getEquipments();
      return;
    }

    // Convert the search text to lowercase for case-insensitive search
    const searchTerm = this.searchText.toLowerCase();

    // Filter the equipment list based on the search term
    const filteredEquipment = this.getEqui.filter((equipment: GetEquipments) => {
      return (
        equipment.name.toLowerCase().includes(searchTerm) ||
        equipment.description.toLowerCase().includes(searchTerm)
      );
    });

    // Update the displayed equipment list
    this.getEqui = filteredEquipment;

    // Check if no results were found and display a SweetAlert if that's the case
    if (filteredEquipment.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Results Found',
        text: 'No equipment matching your search was found.',
      });
    }
  }




  updateEquipment(equipment_ID: number) {
    this.router.navigate(['/update_equipment', equipment_ID]);
  }

  //Delete was successful
  DeleteEquipment(equipment_ID: number, equipmentName:string) {
    console.log('DeleteEquipment called with equipment_ID:', equipment_ID);
    Swal.fire({
      title: 'Are you sure you want to delete this equipment?',
      showConfirmButton: true,
      showCancelButton: true, // Use Cancel button instead of Deny button
      confirmButtonColor: 'green',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No' // Use Cancel button text
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataservices.DeleteEquipment(equipment_ID).subscribe(
          (response: any) => {
            if (typeof response === 'string' && response.includes('Delete was successful')) {
              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);
                const fullname = userObject.name + " " + userObject.surname;

                let newTrail = new FormData();
                newTrail.append('AuditEntryTypeID', '44');
                newTrail.append('Employee_ID', userObject.employee_ID);
                newTrail.append('Comment', "Deleted equipment '" + equipmentName+"'");

                this.dataservices.GenerateAuditTrail(newTrail).subscribe(response => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Equipment has been deleted successfully.',
                    showCancelButton: false, // Hide Cancel button
                    confirmButtonColor: 'green',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    location.reload();
                  });
                });
              }
              else {
                console.log("loggedInUser is null");
              }
            } else {
              Swal.fire('Deletion of equipment has been unsuccessful. Try again.', '', 'error');
            }
          },
          error => {
            console.error('Error deleting equipment:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'An error occurred while deleting equipment.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }


  //Update Stock Mmapula
  StockTake(equipment_ID: number) {
    this.router.navigate(['/StockTakeEquipment', equipment_ID]);
  }

  WriteOff(equipment_ID: number) {
    this.router.navigate(['/write-off/', equipment_ID]);
  }

}

