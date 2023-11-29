import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-request',
  templateUrl: './change-request.component.html',
  styleUrls: ['./change-request.component.scss']
})
export class ChangeRequestComponent {


  hintButton(){
    Swal.fire({
      title: 'Change Request Tutorial',
      html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/MtRkxYeMa_Y?si=7xBWzEjoFmwsZgaQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      showCloseButton: true,
      showConfirmButton: false,
      width: 'auto'
    });
  }
}
