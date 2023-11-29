import { Component, OnInit } from '@angular/core';
import { HelpTip } from '../shared/help-tip';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuditTrail } from '../shared/audit-trail';



@Component({
  selector: 'app-help-tips',
  templateUrl: './help-tips.component.html',
  styleUrls: ['./help-tips.component.scss']
})
export class HelpTipsComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }
  arrHelpTips: HelpTip[] = [];
  selectedHelpTip!: HelpTip;
  videoUrl!: string;
  streamLink!: string;

  ngOnInit(): void {
    this.getAllHelpTips()
  }

  //Get All the Help Tips
  getAllHelpTips() {
    this.arrHelpTips = [];
    this.dataService.GetAllTheHelpTips().subscribe(result => {
      let listHelpTips: any[] = result;
      listHelpTips.forEach((element) => {
        this.arrHelpTips.push(element);
      });
    });
  }

  // Search Help Tips
  searchQuery: string = "";
  searchHelpTip() {
    if (this.searchQuery == "") {
      this.getAllHelpTips();
      console.log("searchbar empty");
    }
    else {
      this.dataService.SearchHelpTips(this.searchQuery).subscribe(
        result => {
          let listHelpTips: any[] = result;
          this.arrHelpTips = [];
          listHelpTips.forEach((element) => {
            this.arrHelpTips.push(element);
          });
          console.log("retrieving search results");
        }
      );
    }
  }

  goToViewHelpTip(help_ID: number) {
    this.router.navigate(['/view-helptip', help_ID]);
  }

  goToEditHelpTip(help_ID: number) {
    this.router.navigate(['/edit-helptip', help_ID]);
  }
  deleteHelpTip(help_ID: number) {
    Swal.fire({
      title: 'Are you sure you want to delete this help tip?',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.dataService.GetSelectedHelpTip(help_ID).subscribe(response => {
          this.selectedHelpTip = response as HelpTip;

          this.dataService.DeleteHelpTip(help_ID).subscribe((response: any) => {
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '10');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Deleted help tip '" + this.selectedHelpTip.name + "'");

              this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                Swal.fire('Help tip has been deleted successfully', '', 'success')
                this.getAllHelpTips();

              });
            }
            else {
              console.log("loggedInUser is null");
            }



          })
        });
      }
      else if (result.isDenied) {
        Swal.fire('Delete help tip has been aborted', '', 'warning')
      }
    })
  }

  videoView(item: HelpTip) {
    this.dataService.GenerateVideoStreamLink(item.fileName).subscribe(
      (response: string) => {
        this.videoUrl = response; // Assign the plain text URL to videoUrl
        console.log("Stream link:", this.videoUrl);
        Swal.fire({
          title: item.name,
          html: `
            <p>Description: ${item.description}</p><br>
            <p>Date: ${item.date}</p><br> 
            <video width="560" height="315" controls>
            <source src="${this.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.</video>`,
          showCloseButton: true,
          confirmButtonColor: 'green',
          confirmButtonText: 'DOWNLOAD',
          width: 'auto'
        }).then((result) => {
          if (result.isConfirmed) {
            // When the "DOWNLOAD" button is clicked, you can redirect the user to the stream link
            window.open(this.videoUrl, '_blank'); // Opens the link in a new tab
          }
        });
      },
      error => {
        console.error('Error generating help tip link:', error);
      }
    );

   
  }

  getVideoLink(item: HelpTip) {
    console.log('Get Video Link Called');
    this.videoUrl = item.fileName;
    this.dataService.GenerateVideoStreamLink(this.videoUrl).subscribe(result => {
      this.streamLink = result as string;
      console.log('Stream Link:', this.streamLink);
    });
  }

}
