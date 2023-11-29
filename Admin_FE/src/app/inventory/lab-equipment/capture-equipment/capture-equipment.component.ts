import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { EquipmentViewModel } from 'src/app/shared/EquipmentViewModel';
import { Supplier } from 'src/app/shared/supplier';
import { CaptureEquipmentViewModel } from 'src/app/shared/captureEquipment';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-capture-equipment',
  templateUrl: './capture-equipment.component.html',
  styleUrls: ['./capture-equipment.component.scss']
})
export class CaptureEquipmentComponent  implements OnInit {
  constructor(private data:DataService ,private fb: FormBuilder, private router:Router){
    this.equipmentForm = this.fb.group({
      date: ['',Validators.required],
      description: ['', Validators.required],
      receipt: [null , Validators.required],
      selectedSupplier: ['', Validators.required],
      selectedEquipment: ['', Validators.required],
      quantity: [null, Validators.required]
    });
  }
  equipment: EquipmentViewModel[] = [];
  equipmentForm: FormGroup;
  supp: Supplier[] = []

  ngOnInit(): void {
  this.GetSuppliers();
  this.getEquipment();

  }



getEquipment() {
  this.data.GetEquipments().subscribe(
    (response) => {
      if (response && response.$values) {
        this.equipment = response.$values.map((item: any) => {
          const price = item.prices && item.prices.$values && item.prices.$values[0] ? item.prices.$values[0].amount : 0;
          return {
            equipment_ID: item.equipment_ID,
            name: item.name,
            quantity_On_Hand: item.quantity_On_Hand,
            image: item.image,
            module_Code: item.modules ? item.modules.module_Code : 'N/A',
            description: item.description,
            //price: price
          };
        });
        console.log('Retrieved Equipment:', this.equipment);
      } else {
        console.log('Received null or invalid equipment data from the API.');
      }
    },
    (error) => {
      console.error('An error occurred while fetching equipment:', error);
    }
  );
}


GetSuppliers() {
  this.data.GetAllSuppliers().subscribe(result => {
    let suppList: any[] = result
    suppList.forEach((element) => {
      this.supp.push(element)
    });
  })
}
ConvertedFile: string = ''; // Initialize with an empty string

onFileChange(event: any) {
  const selectedFile = event.target.files[0]; // Get the selected file

  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      this.ConvertedFile = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }
}





//New update -01 October 2023
 Employee_ID :number =0;
Capture(){
  // Accessing the selected equipment ID from the form
  const selectedEquipmentID = Number(this.equipmentForm.get('selectedEquipment')?.value);
  const selectedSupplierID = Number(this.equipmentForm.get('selectedSupplier')?.value);



  const selectedDate = this.equipmentForm.get('date')?.value;
  const dateObject = new Date(selectedDate); // Convert the string to a Date object
  const formattedDate = this.formatDate(dateObject);

  const selectedDescription = this.equipmentForm.get('description')?.value;
  const selectedQuantity = Number(this.equipmentForm.get('quantity')?.value);
  const selectedFile = this.ConvertedFile;



  if(selectedEquipmentID === 0){
    Swal.fire('Select equipment you ordered.','','error');
  }
  else if(
    selectedSupplierID === 0
  ){
    Swal.fire('Select supplier you ordered from.','','error');
  }
  else if(
    selectedDate == ''
  ){
    Swal.fire('Select date of order.','','error');
  }
  else if (selectedQuantity <= 0 || isNaN(selectedQuantity)) {
    Swal.fire('Provide valid quantity ordered.', '', 'error');
  }else if (!selectedDescription) {
    Swal.fire('Provide description of order.', '', 'error');
  } else if (selectedDescription.length > 255) {
    Swal.fire('Provide valid description, 255 characters allowed.', '', 'error');
  }
  else if (selectedFile === '') { // Check for empty string instead of null
    Swal.fire('Please attach receipt.', '', 'error');
  }
  else
  {


    let newObject = window.localStorage.getItem("loggedInUser");

    if(newObject !== null)
    {
      const userObject = JSON.parse(newObject);
      this.Employee_ID = userObject.employee_ID
    }

      //loggin use employee

  const newCapture : CaptureEquipmentViewModel={
    date: selectedDate,
  description: selectedDescription,
  receipt: selectedFile,
  supplier_ID:  selectedSupplierID,
  employee_ID: this.Employee_ID,
  quantity_Bought: selectedQuantity,
  equipment_ID: selectedEquipmentID
  }
  console.log(newCapture);



  Swal.fire({
    title: 'Confirm',
    text: 'Are you sure you want to capture this equipment order?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: 'green',
    confirmButtonText: 'CONFIRM',
    cancelButtonText: 'CANCEL',
  }).then((result) => {
    if (result.isConfirmed) {
      this.data.CaptureEquipment(newCapture).subscribe(
        (response: any) => {
          if (typeof response === 'string' && response.includes('Captured Equipment successfully')) {
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '48');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Captured equipment" );

              this.data.GenerateAuditTrail(newTrail).subscribe(response => {
                Swal.fire('Success', 'Equipment Order has been successfully captured', 'success');
            this.router.navigate(['/lab_equipment']);
              });
            }
            else {
              console.log("loggedInUser is null");
              Swal.fire('Error', 'Failed to capture equipment order. Please try again later', 'error').then(() => {
                this.router.navigate(['/lab_equipment']);
            })

          }

          } else {
            console.error(`Unexpected response:`, response);
            Swal.fire('Error', 'Failed to capture equipment order. Please try again later', 'error').then(() => {
              this.router.navigate(['/lab_equipment']);
            });
          }
        },
        (error) => {
          console.error(`Error adding equipment:`, error);
          Swal.fire('Error', 'Failed to capture equipment order. Please try again later', 'error').then(() => {
            this.router.navigate(['/lab_equipment']);
          });
        }
      );


    }
  });


  }







}
//Captured Equipment successfully
private formatDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

cancelCapEquip() {
  Swal.fire({
    title: 'Cancelled',
    text: 'Capture Order has been aborted.',
    icon: 'error',
    showConfirmButton: false,
    timer: 1500
  }).then(() => {
    this.router.navigate(['/lab_equipment']);
  });
}

}
