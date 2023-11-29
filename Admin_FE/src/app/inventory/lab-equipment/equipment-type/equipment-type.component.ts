import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { EquipmentType } from 'src/app/shared/equipment_type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-type',
  templateUrl: './equipment-type.component.html',
  styleUrls: ['./equipment-type.component.scss']
})
export class EquipmentTypeComponent implements OnInit {

  equipment_type: EquipmentType[] = []

  constructor(private dService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.GetAllEquipmentTypes();
  }

  GetAllEquipmentTypes() {
    this.dService.GetAllEquipmentTypes().subscribe(result => {
      let etList: any[] = result
      etList.forEach((element) => {
        this.equipment_type.push(element)
      });
    })
  }

  deleteEquipmentType(equipmentType_ID: number) {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to delete this equipment type?',
      icon: 'question',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Confirm',
      denyButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dService.DeleteEquipmentType(equipmentType_ID).subscribe(
          () => {
              const index = this.equipment_type.findIndex(type => type.equipmentType_ID === equipmentType_ID);
              if (index !== -1) {
                this.equipment_type.splice(index, 1);
              }
              Swal.fire('Deleted!', 'The equipment type has been deleted.', 'success');
            },
            (error: any) => {
              Swal.fire('Error', 'An error occurred while deleting the equipment type', 'error');
            }
          );
        } else if (result.isDenied || result.isDismissed) {
          Swal.fire('Delete equipment type has been cancelled', '', 'error');
        }
      });
    }
  

  


  updateEquipmentType(equipmentType_ID: number) {
    this.router.navigate(['/updateET', equipmentType_ID]);
  }

  searchInput: string = "";
  searchEquipmentType() {
    if (this.searchInput.trim() === "") {
      window.location.reload();
      this.GetAllEquipmentTypes();
    } else {
      this.dService.SearchEquipmentType(this.searchInput).subscribe(result => {
        let etList: any[] = result;
        this.equipment_type = [];
        etList.forEach((element) => {
          this.equipment_type.push(element);
        });
      });
    }
  }
}
