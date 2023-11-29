import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Equipment } from 'src/app/shared/equipment';
import { Router } from '@angular/router';
import { EquipmentType } from 'src/app/shared/equipment_type';
import { Module } from 'src/app/shared/module';
import Swal from 'sweetalert2';
import { EquipmentModel } from 'src/app/shared/EquipmentModel';

@Component({
  selector: 'app-add-lab-equipment',
  templateUrl: './add-lab-equipment.component.html',
  styleUrls: ['./add-lab-equipment.component.scss']
})
export class AddLabEquipmentComponent {

  //All the things we going
  Modules: Module[] = [];
  EquipmentTypes: EquipmentType[] = [];


  constructor(private data: DataService, private router: Router) { }

  formAdd: FormGroup = new FormGroup
    ({
      name: new FormControl('', [Validators.required]),
      Description: new FormControl('', [Validators.required]),
      Quantity: new FormControl('', [Validators.required]),
      PriceAmount: new FormControl('', [Validators.required]),
      Image: new FormControl('', [Validators.required])
    })

  ngOnInit(): void {

    this.GetAllEquipmentTypes()
    this.GetAllModules()
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
    );}

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

  //Getting the options of the dropdown
  selectedOption: string = ""
  onOptionChange(target: any) {
    const value = target.value; // Extract the selected value
    this.selectedOption = value;
    console.log(this.selectedOption);
  }
  EquipmentTypeOption: string = "";
  onEquipmentType(target: any) {
    const value = target.value;
    this.EquipmentTypeOption = value;
    console.log(this.EquipmentTypeOption);
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


  Addequipment() {
    const nameValue = this.formAdd.value.name;
    const descriptionValue = this.formAdd.value.Description;
    const quantityValue = this.formAdd.get('Quantity')?.value;
    const PriceAmount = this.formAdd.get('PriceAmount')?.value;
    const EquipmentTypeID = Number(this.EquipmentTypeOption);
    const module_ID = Number(this.selectedOption);
    const imageValue = this.formAdd.value.Image;

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

      const newEquipment: EquipmentModel = {
        name: nameValue,
        description: descriptionValue,
        quantity_On_Hand: quantityValue,
        image: this.image, // Use the base64-encoded image string from this.image
        amount: PriceAmount,
        module_ID: module_ID,
        equipmentType_ID: EquipmentTypeID,
      };
      console.log(newEquipment);

      Swal.fire({
        icon: 'question',
        title: 'Confirm Equipment Addition',
        text: 'Are you sure you want to add this equipment?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.data.AddEquipment(newEquipment).subscribe(
            (response: any) => {
              if (typeof response === 'string' && response.includes('Added equipment successfully')) {
                let newObject = window.localStorage.getItem("loggedInUser");
                if (newObject !== null) {
                  const userObject = JSON.parse(newObject);
                  const fullname = userObject.name + " " + userObject.surname;

                  let newTrail = new FormData();
                  newTrail.append('AuditEntryTypeID', '42');
                  newTrail.append('Employee_ID', userObject.employee_ID);
                  newTrail.append('Comment', "Added new equipment '" + newEquipment.name);

                  this.data.GenerateAuditTrail(newTrail).subscribe(response => {
                    Swal.fire('Equipment has been added successfully', '', 'success');
                this.router.navigate(['/lab_equipment']);
                  });
                }
                else {
                  console.log("loggedInUser is null");
                  Swal.fire({
                    icon: 'error',
                    title: 'Adding equipment unsuccessful',
                    text: 'Adding equipment has been unsuccessful. Try again.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    this.router.navigate(['/lab_equipment']);
                  });
                }

              } else {
                console.error(`Unexpected response:`, response);
                Swal.fire({
                  icon: 'error',
                  title: 'Adding equipment unsuccessful',
                  text: 'Adding equipment has been unsuccessful. Try again.',
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/lab_equipment']);
                });
              }
            },
            (error) => {
              console.error(`Error adding equipment:`, error);
              Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'An error occurred while adding equipment. Please try again later.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then(() => {
                this.router.navigate(['/lab_equipment']);
              });
            }
          );


        }
      });
    }
  }

  AbortAdd() {
    Swal.fire({
      icon: 'warning',
      title: 'Abort Equipment Addition',
      text: 'Are you sure you want to abort adding the equipment?',
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

}







