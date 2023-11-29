import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture-equip',
  templateUrl: './capture-equip.component.html',
  styleUrls: ['./capture-equip.component.scss']
})
export class CaptureEquipComponent {

  constructor(private router: Router){}

  cancelCapEqup() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Capture Equipment has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/lab_equipment']);
    });
  }

}
