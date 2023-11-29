import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EquipmentType } from 'src/app/shared/equipment_type';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-equipment-type',
  templateUrl: './update-equipment-type.component.html',
  styleUrls: ['./update-equipment-type.component.scss']
})
export class UpdateEquipmentTypeComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute) { }

  upEquipmentType: EquipmentType = new EquipmentType();
  formUpdate: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.activated.params.subscribe(params => {
      this.data.GetEquipmentType(params['id']).subscribe(response => {
        
        this.upEquipmentType = response as EquipmentType;
        this.formUpdate.controls['name'].setValue(this.upEquipmentType.name);
        this.formUpdate.controls['description'].setValue(this.upEquipmentType.description);
      })
    })
  }

  showUpdateConfirmation() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this equipment type?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UpdateEquipmentType();
      }
    });
  }

  showCancelConfirmation() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Update Equipment Type has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/equipment_type']);
    });
  }

  UpdateEquipmentType() {
    let equipmentType = new EquipmentType();
    equipmentType.name = this.formUpdate.value.name;
    equipmentType.description = this.formUpdate.value.description;
  
    this.data.updateEquipmentType(this.upEquipmentType.equipmentType_ID, equipmentType).subscribe(
      (response: any) => {
        this.router.navigate(['/equipment_type']);
        Swal.fire('Success', 'Equipment Type has been successfully updated', 'success');
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to update equipment type', 'error');
      }
    );
  }
  
}
