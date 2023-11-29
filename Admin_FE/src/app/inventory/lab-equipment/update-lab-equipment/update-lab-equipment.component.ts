import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Equipment } from 'src/app/shared/equipment';
import { Router,ActivatedRoute } from '@angular/router';
import { EquipmentType } from 'src/app/shared/equipment_type';
import { Module } from 'src/app/shared/module';
import { Equi } from 'src/app/shared/equipment2';
import Swal from 'sweetalert2';
import { EquipmentModel } from 'src/app/shared/EquipmentModel';



@Component({
  selector: 'app-update-lab-equipment',
  templateUrl: './update-lab-equipment.component.html',
  styleUrls: ['./update-lab-equipment.component.scss']
})
export class UpdateLabEquipmentComponent {
  selectedOption: string =""
  onOptionChange(target: any) {
    const value = target.value; // Extract the selected value
    this.selectedOption = value;
    console.log(this.selectedOption);
  }
  EquipmentTypeOption:string ="";
  onEquipmentType(target:any)
  {
    const value = target.value;
    this.EquipmentTypeOption =value;
    console.log(this.EquipmentTypeOption);
  }
//All the things we going
Modules :Module[]=[];
EquipmentTypes :EquipmentType[]=[];
SearchModules :Module[]=[];

constructor(private data:DataService, private router:Router,
  private activated:ActivatedRoute){}

  formUpdate: FormGroup = new FormGroup
    ({
      name: new FormControl('', [Validators.required]),
      Description: new FormControl('', [Validators.required]),
      Quantity: new FormControl('', [Validators.required]),
      PriceAmount: new FormControl('', [Validators.required]),
      Image:new FormControl('', [Validators.required]),
      module: new FormControl(''),           // Add this line for the 'module' control
       equipmentType: new FormControl(''),

    })

UpdateEquipment:Equi= new Equi();

ngOnInit(): void {
  // Fetch equipment types and modules
  this.GetAllEquipmentTypes();
  this.GetAllModules();

  // Show loading alert with a timer
  Swal.fire({
    title: 'Loading...',
    text: 'Please wait while the information is loaded.',
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    timer: 2000, // 6000 milliseconds (6 seconds)
    didOpen: () => {
      Swal.showLoading();
    }
  });

  this.activated.params.subscribe(params => {
    this.data.GetEquipmentByid(params['id']).subscribe(res => {
      this.UpdateEquipment = res as Equi;

      // Add data to controls
      console.log(this.UpdateEquipment)



      this.formUpdate.controls['name'].setValue(this.UpdateEquipment.name);
      this.formUpdate.controls['Description'].setValue(this.UpdateEquipment.description);
      this.formUpdate.controls['Image'].setValue(this.UpdateEquipment.image);
      this.formUpdate.controls['Quantity'].setValue(this.UpdateEquipment.quantity_On_Hand);
      this.formUpdate.controls['PriceAmount'].setValue(this.UpdateEquipment.amount);

      // Set the selected module based on module_Code
        // Set the selected module based on module_Code
const selectedModuleName = this.UpdateEquipment?.equipment_Types?.modules?.module_Code;
console.log('SelectedModuleName:', selectedModuleName);
const selectedModuleId = this.Modules.find(module => module.module_Code === selectedModuleName)?.module_ID;
console.log('SelectedModuleId:', selectedModuleId);
if (selectedModuleId !== undefined) {
  this.formUpdate.controls['module'].setValue(selectedModuleId);
}

// Set the selected equipment type based on equipmentType_Name
const selectedEquipmentTypeName = this.UpdateEquipment?.equipment_Types?.name;
console.log('SelectedEquipmentTypeName:', selectedEquipmentTypeName);
const selectedEquipmentTypeId = this.EquipmentTypes.find(type => type.name === selectedEquipmentTypeName)?.equipmentType_ID;
console.log('SelectedEquipmentTypeId:', selectedEquipmentTypeId);
if (selectedEquipmentTypeId !== undefined) {
  this.formUpdate.controls['equipmentType'].setValue(selectedEquipmentTypeId);
}


      // Close the loading alert once data is loaded
      Swal.close();
    });
  });
}


GetAllEquipmentTypes() {
  this.data.GetAllEquipmentTypes().subscribe(
    (result) => {
      let TypesList: any[] = result;

      if (TypesList.length === 0) {
        // If the array is empty, show a SweetAlert with a message and a button
        Swal.fire({
          title: 'No Equipment Types Found',
          text: 'Please add an equipment type.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Go to Equipment Type Page',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect the user to the equipment type page
            // You can replace '/equipment-types' with the actual route for the equipment type page
            this.router.navigate(['/equipment_type']);
          }
        });
      } else {
        // Equipment types were retrieved successfully
        TypesList.forEach((element) => {
          this.EquipmentTypes.push(element);
        });

        // Log the loaded equipment types
        console.log('EquipmentTypes:', this.EquipmentTypes);
      }
    },
    (error) => {
      // If there was an error retrieving equipment types, show an error message
      Swal.fire({
        title: 'Error',
        text: 'Failed to retrieve equipment types. Please contact support.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  );
}

GetAllModules() {
  this.data.GetModules().subscribe(
    (result) => {
      let moduleList: any[] = result;

      if (moduleList.length === 0) {
        // If the array is empty, show a SweetAlert with a message and a button
        Swal.fire({
          title: 'No Modules Found',
          text: 'Please add a module.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Go to Module Page',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect the user to the module page
            // You can replace '/modules' with the actual route for the module page
            this.router.navigate(['/module']);
          }
        });
      } else {
        // Modules were retrieved successfully
        moduleList.forEach((element) => {
          this.Modules.push(element);
        });

        // Log the loaded modules
        console.log('Modules:', this.Modules);
      }
    },
    (error) => {
      // If there was an error retrieving modules, show an error message
      Swal.fire({
        title: 'Error',
        text: 'Failed to retrieve modules. Please contact support.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  );
}



AbortUpdate() {
  Swal.fire({
    icon: 'warning',
    title: 'Abort Equipment Update',
    text: 'Are you sure you want to abort updating the equipment?',
    showCancelButton: true,
    confirmButtonColor: 'red',
    cancelButtonColor: 'gray',
    confirmButtonText: 'Yes, abort',
    cancelButtonText: 'No, keep adding',
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/lab_equipment']); // Navigate back to lab equipment page
    }
  });
}

image: string = ''; // Property to store the base64-encoded image

uploadImage(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Define an array of allowed image MIME types
    const allowedImageTypes = ['image/jpeg', 'image/png']; // Add more formats if needed
    //, 'image/gif', 'image/bmp'

    // Check if the selected file's MIME type is in the allowed list
    if (allowedImageTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // Show an error message if the file format is not allowed
      Swal.fire({
        title: 'Invalid File Format',
        text: 'Please select a valid image file (JPEG / PNG).',
        icon: 'error',
      });
      event.target.value = ''; // Clear the input field
    }
  }
}
Updateequipment(){
  const nameValue = this.formUpdate.value.name;
    const descriptionValue = this.formUpdate.value.Description;
    const quantityValue =  this.UpdateEquipment.quantity_On_Hand;
    const PriceAmount = this.formUpdate.get('PriceAmount')?.value;
    const EquipmentTypeID = Number(this.EquipmentTypeOption);
    const module_ID = Number(this.selectedOption);
    const imageValue = this.formUpdate.value.Image;

    if (nameValue === '') {
      Swal.fire({
        icon: 'error',
        title: 'Name Required',
        text: 'Please provide a name for the equipment.',
      });
    } else if (nameValue.length > 100) {
      Swal.fire({
        icon: 'error',
        title: 'Name Length',
        text: 'Name should not exceed 100 characters.',
      });
    } else if (descriptionValue === '') {
      Swal.fire({
        icon: 'error',
        title: 'Description Required',
        text: 'Please provide a description for the equipment.',
      });
    } else if (descriptionValue.length > 255) {
      Swal.fire({
        icon: 'error',
        title: 'Description Length',
        text: 'Description should not exceed 255 characters.',
      });
    } else if (quantityValue === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Quantity Error',
        text: 'Quantity should not be zero.',
      });
    } else if (PriceAmount === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sale Amount Error',
        text: 'Sale Amount should not be zero.',
      });
    } else if (EquipmentTypeID === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Equipment Type Error',
        text: 'Please select an equipment type.',
      });
    } else if (module_ID === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Module ID Error',
        text: 'Please select a module.',
      });
    } else if (!imageValue) {
      Swal.fire({
        icon: 'error',
        title: 'Image Error',
        text: 'Please upload an image.',
      });
    } else {
      // Validation checks passed, proceed to confirmation

      const UpdatedEquipment: EquipmentModel = {
        name: nameValue,
        description: descriptionValue,
        quantity_On_Hand: quantityValue,
        image: this.image, // Use the base64-encoded image string from this.image
        amount: PriceAmount,
        module_ID: module_ID,
        equipmentType_ID: EquipmentTypeID,
      };
      console.log(UpdatedEquipment);
      console.log(this.UpdateEquipment.equipment_ID)

      Swal.fire({
        icon: 'question',
        title: 'Confirm Equipment Update',
        text: 'Are you sure you want to update this equipment?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {

          this.data.EditEquipment(this.UpdateEquipment.equipment_ID, UpdatedEquipment).subscribe(
            (response: any) => {
              if (typeof response === 'string' && response.includes('Updated successfully')) {

                let newObject = window.localStorage.getItem("loggedInUser");
                if (newObject !== null) {
                  const userObject = JSON.parse(newObject);
                  const fullname = userObject.name + " " + userObject.surname;

                  let newTrail = new FormData();
                  newTrail.append('AuditEntryTypeID', '43');
                  newTrail.append('Employee_ID', userObject.employee_ID);
                  newTrail.append('Comment', "Updated equipment'" + this.UpdateEquipment.name +"'");

                  this.data.GenerateAuditTrail(newTrail).subscribe(response => {
                   // Update was successful
                Swal.fire('Equipment has been updated successfully', '', 'success');
                this.router.navigate(['/lab_equipment']);
                  });
                }
                else {
                  console.log("loggedInUser is null");
                }




              } else {
                // Update was not successful
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
              }
            },
            (error) => {
              // Handle error here
              console.error(`Error updating equipment:`, error);
              Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'An error occurred while updating equipment. Please try again later.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then(() => {
                this.router.navigate(['/lab_equipment']);
              });
            }
          );

         }
},

)}
}



}
