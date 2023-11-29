import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HelpTip } from 'src/app/shared/help-tip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer

import { ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { AuditTrail } from 'src/app/shared/audit-trail';


@Component({
  selector: 'app-send-newsletter',
  templateUrl: './send-newsletter.component.html',
  styleUrls: ['./send-newsletter.component.scss']
})

export class SendNewsletterComponent {
  isLoading: boolean = false;
  
  constructor(private dataService: DataService, private router: Router) {

  }

  formSendNewsletter: FormGroup = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required])
  });


  fileURL: string = ""; // Initialize the variable

  selectedFile: any;
  dt: any;
  dataDisplay: any;

  ngOnInit(): void {
    document.getElementById("videoInput")?.addEventListener("change", this.handleVideoUpload.bind(this));
  }

  handleVideoUpload(event: Event) {
    //get the video from event handler
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];

    //if file is uploaded then read it as a url for the video player
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.fileURL = event.target?.result as string; // Store the data URL
      };

      reader.readAsDataURL(this.selectedFile);
      // console.log(this.videoUrl);

    }
  }


  ConfirmSendNewsletter() {
    if (!this.formSendNewsletter.valid) {
      //trigger your form controls
      Object.values(this.formSendNewsletter.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }

        Swal.fire('Please fill in the form', '', 'info');
      });
    }
    else {
      if (this.selectedFile.size > 30000000) {
        Swal.fire('File too big', 'Please upload a file that is smaller than 30MB', 'error');
      }
      else if (this.selectedFile.size == null || this.selectedFile.length < 0) {
        Swal.fire('No File Uploaded', "Oops! It look like you haven't uploaded a file", 'error');
      }
      else {
        Swal.fire({
          title: 'Confirm',
          text: 'Are you sure you want to send this newsletter?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'green',
          confirmButtonText: 'CONFIRM',
          cancelButtonText: 'CANCEL',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.isLoading()
            this.sendNewsletter();
          }
        });

      }
    }
  }

  sendNewsletter() {
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);

      let newsletter = new FormData();
      newsletter.append('subject', this.formSendNewsletter.value.subject);
      newsletter.append('description', this.formSendNewsletter.value.description);
      newsletter.append('newsletterFile', this.selectedFile, this.selectedFile.name);
      newsletter.append('employee_ID', userObject.employee_ID);

      Swal.isLoading()

      this.dataService.SendANewsletter(newsletter).subscribe(
        result => {

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '11');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Sent a newsletter, Subject: '" + this.formSendNewsletter.value.subject + "'");

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
            Swal.close();
            Swal.fire('Newsletter sent successfully', '', 'info');
            this.router.navigate(['/newsletter'])
          });
        },
        error => {
          Swal.close();
          if (error.status = "Status: 409 (The specified blob already exists.)") {
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '11');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Sent a newsletter, Subject: '" + this.formSendNewsletter.value.subject + "'");

              this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
                Swal.fire("Newsletter sent successfully", '', 'info');
                this.router.navigate(['/newsletter'])
              });
            }
            else {
              console.log("loggedInUser is null");
            }
          }
          Swal.fire('Error sending newsletter', 'Internal server error. Please contact support', 'error');
          console.error('Error sending newsletter:', error);
        }
      );

    }
    else {
      console.log("loggedInUser is null");
    }
  }


  AbortSendNewsletter() {
    Swal.fire({
      title: 'Cancelled',
      text: 'Send Newsletter has been aborted.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigate(['/newsletter']);
    });
  }
}
