import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EquipmentType } from 'src/app/shared/equipment_type';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-equipment-type',
  templateUrl: './add-equipment-type.component.html',
  styleUrls: ['./add-equipment-type.component.scss']
})
export class AddEquipmentTypeComponent {
  equipment_Type: EquipmentType[] = []

  constructor(private data: DataService, private router: Router) { }

  formAdd: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.GetAllEquipmentTypes()
  }

  GetAllEquipmentTypes() {
    this.data.GetAllEquipmentTypes().subscribe(result => {
      let etList: any[] = result
      etList.forEach((element) => {
        this.equipment_Type.push(element)
      });
    })
  }

  addEquipmentType() {
    let et = new EquipmentType();
    et.name = this.formAdd.value.name;
    et.description = this.formAdd.value.description;
  
    this.data.AddEquipmentType(et).subscribe(
      () => {
        this.router.navigate(['/equipment_type']);
        Swal.fire('Success', 'Equipment Type has been successfully added to the system.', 'success');
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while adding the equipment type.', 'error');
      }
    );
  }
  

  showAddConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to add this equipment type?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      preConfirm: () => {
        this.addEquipmentType();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Equipment Type has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/equipment_type']);
    });
  }

  showSuccessAlert() {
    Swal.fire({
      title: 'Success',
      text: 'Equipment Type has been added to the system.',
      icon: 'success',
      confirmButtonText: 'OKAY'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/equipment_type']);
      }
    });
  }

  showErrorAlert() {
    Swal.fire({
      title: 'Error',
      text: 'An error occurred while adding the Equipment Type.',
      icon: 'error',
      confirmButtonText: 'OKAY'
    });
  }
}
