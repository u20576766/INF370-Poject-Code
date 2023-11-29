import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HelpTip } from 'src/app/shared/help-tip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer

import { ElementRef, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import Swal from 'sweetalert2';
import { AuditTrail } from 'src/app/shared/audit-trail';


@Component({
  selector: 'app-add-helptips',
  templateUrl: './add-helptips.component.html',
  styleUrls: ['./add-helptips.component.scss']
})

export class AddHelptipsComponent implements OnInit {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;


  constructor(private dataService: DataService, private router: Router, private sanitizer: DomSanitizer) { 

  }

  formAddHelpTip: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    video: new FormControl('', [Validators.required])
  });


showVideo: boolean = false;
videoUrl: string = ""; // Initialize the variable
isVideoUploaded: boolean = false;
fileUploadMessage: string = "";
showNoVideoMessage: boolean = false;
isTheRightVideoUploaded: boolean = false;
isWrongVideoUploaded: boolean = false;
verifyButtons: boolean = false;
selectedFile: any;

ngOnInit(): void {
  document.getElementById("videoInput")?.addEventListener("change", this.handleVideoUpload.bind(this));
}

handleVideoUpload(event: Event) {
  //get the video from event handler
  this.selectedFile = (event.target as HTMLInputElement).files?.[0];

  //if file is uploaded then read it as a url for the video player
  if (this.selectedFile) 
  {
    this.isVideoUploaded = true;
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.videoUrl = event.target?.result as string; // Store the data URL
    };

    reader.readAsDataURL(this.selectedFile);
    // console.log(this.videoUrl);

  }
  else 
  {
    //else dont show the video player because file is not uploaded
    this.isVideoUploaded = false;
  }
}

//-----------------------VERIFICATION FOR VIDEO BEING UPLOADED-----------------------//
  VerifyVideo() {

    if(!this.formAddHelpTip.valid)
    {
      //trigger your form controls
      Object.values(this.formAddHelpTip.controls).forEach(control => {
        if(control.invalid)
        {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }

        Swal.fire('Please fill in the form','','info');
      });
    }else
    {

          //if video is not uploaded when verify video is clicked then...
    if (this.isVideoUploaded == false) {
      this.showVideo = false;
      this.showNoVideoMessage = true;
      this.isWrongVideoUploaded = false;
      this.isTheRightVideoUploaded = false;
  
      this.fileUploadMessage = "It looks you haven't uploaded a video, please upload a video.";
    }
    else {

      if(this.selectedFile.size > 30000000 ){

        this.showVideo = false;
        this.showNoVideoMessage = true;
        this.isWrongVideoUploaded = false;
        this.isTheRightVideoUploaded = false;
    
        this.fileUploadMessage = " It looks like the file you uploaded is a bit too large. Please make sure the file size is smaller than 30MB.";
     }
     else{
      this.showVideo = true;//shows the video
      this.showNoVideoMessage = false; //hides no video error message
      this.ConfirmButtonsHidden = false; //hides the confirm video buttons
      this.isWrongVideoUploaded = false;//hides the wrong video uploaded message
      this.isTheRightVideoUploaded = false;//hides the right video uploaded message

     }
    }
    }

    

  }

  ConfirmButtonsHidden: boolean = false;

  YesVideo() {
    this.showVideo = false;
    this.isWrongVideoUploaded = false;
    this.showNoVideoMessage = false;

    this.isTheRightVideoUploaded = true;
    this.ConfirmButtonsHidden = true;
    this.verifyButtons = true;
  }
  
  NoVideo() {
    this.showVideo = false;
    this.isWrongVideoUploaded = true;
    this.isTheRightVideoUploaded = false;
    this.showNoVideoMessage = false;

    this.fileUploadMessage = "It seems you have uploaded the wrong video. If you intended to upload a different video, please use the correct video file and try again. If you need assistance, feel free to contact our support team for help.";

  }
  //--------------------------------------------------------------------------------//


  addNewHelpTip() {

    if(!this.formAddHelpTip.valid)
    {
      //trigger your form controls
      Object.values(this.formAddHelpTip.controls).forEach(control => {
        if(control.invalid)
        {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
        Swal.fire('Please fill in the form','','info');
      });
    }
    else
    {
      let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);    

        let newHelpTip = new FormData();
        newHelpTip.append('Name', this.formAddHelpTip.value.name);
        newHelpTip.append('Description', this.formAddHelpTip.value.description);
        newHelpTip.append('VideoFile', this.selectedFile, this.selectedFile.name);
        newHelpTip.append('Employee_ID', userObject.employee_ID);
  
        this.dataService.AddNewHelpTip(newHelpTip).subscribe(
          result => { 
      
              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID','8');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Added a new help tip '"+this.formAddHelpTip.value.name+"'");      

              this.dataService.GenerateAuditTrail(newTrail).subscribe( response => {
                this.router.navigate(['/help-tips'])
              });      
          },
          (errorResponse) => {
            if (errorResponse.error.includes("Error uploading video: The specified blob already exists.")) {
              Swal.fire('You have already uploaded this video before','Check the naming convetion of the file you are uploading if it is a different file','warning');
            } else {
              Swal.fire('Error uploading new help tip','Internal server error. Please contact support.','error');
            }
          }
        );
      } 
      else {
        console.log("loggedInUser is null");
      }
    }
  }

  ConfirmAddHelp(){
    Swal.fire({
      icon: 'question',
      title: 'Confirm',
      html: 'Are these the details of the helptip you wnat to add? <br>',
      text: "Help Tip Name: "+this.formAddHelpTip.value.name +" | Help Tip Description: " + this.formAddHelpTip.value.description,
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
    }).then((result) => {
      if (result.isConfirmed) //if user clicked yes
      {
        this.addNewHelpTip();
      } else if ( (result.isDenied) || (result.isDismissed))//if user clicked no
      {
        Swal.fire('Please verify that you have entered the correct information.', '', 'warning')
      }
    })
  }

  AbortAddHelp() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Add Help Tip has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/help-tips']);
    });
  }
}







