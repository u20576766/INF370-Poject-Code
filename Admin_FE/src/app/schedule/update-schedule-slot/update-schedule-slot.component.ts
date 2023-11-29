import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Schedule } from 'src/app/shared/schedule';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-schedule-slot',
  templateUrl: './update-schedule-slot.component.html',
  styleUrls: ['./update-schedule-slot.component.scss']
})
export class UpdateScheduleSlotComponent implements OnInit {

  constructor(private data: DataService, private router: Router, private activated: ActivatedRoute) {}

  UpdateOldSchedule: Schedule = new Schedule();
  updateScheduleForm: FormGroup = new FormGroup({
    date: new FormControl('', [Validators.required]),
    slotsNumber: new FormControl('', [Validators.required]),
    //EmployeeID: new FormControl('', [Validators.required])

  });

  ngOnInit(): void {
    this.activated.params.subscribe(params => {
      this.data.getSlotById(params['id']).subscribe(res => {
        this.UpdateOldSchedule = res as Schedule;

        // Populate the form controls
        this.updateScheduleForm.patchValue({
          date: this.UpdateOldSchedule.date,
          slotsNumber: this.UpdateOldSchedule.slots_Available,
          //EmployeeID: this.UpdateOldSchedule.employee_ID
        });

        // Disable the date form control
        this.updateScheduleForm.get('date')?.disable();
      });
    });
  }


  UpdateSlot() {
    // Check if the form is valid before further validation
    if (this.updateScheduleForm.valid) {
      const slotsNumberValue = this.updateScheduleForm.get('slotsNumber')?.value;

      // Check if slotsNumberValue is between 0 and 5
      if (slotsNumberValue >= 0 && slotsNumberValue <= 5) {
        // Check if slotsNumberValue is different from the old number
        if (slotsNumberValue !== this.UpdateOldSchedule.slots_Available) {
          Swal.fire({
            title: 'Are you sure you want to update available number of slots for this date?',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: "green",
            confirmButtonText: 'Yes',
            denyButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              let empId;
              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);
                empId = userObject.employee_ID;
              }

              const updatedSchedule: Schedule = {
                schedule_ID: this.UpdateOldSchedule.schedule_ID,
                date: this.updateScheduleForm.get('date')?.value,
                slots_Available: slotsNumberValue,
                employee_ID: this.UpdateOldSchedule.employee_ID
              };

              console.log('Updated Schedule:', updatedSchedule);

              this.data.updateScheduleSlot(this.UpdateOldSchedule.schedule_ID, updatedSchedule).subscribe(
                (response) => {
                  console.log('Server response:', response);
                    //AuditTrail
                    let newObject = window.localStorage.getItem("loggedInUser");
                    if (newObject !== null) {
                      const userObject = JSON.parse(newObject);
                      const fullname = userObject.name + " " + userObject.surname;

                      let newTrail = new FormData();
                      newTrail.append('AuditEntryTypeID', '30');
                      newTrail.append('Employee_ID', userObject.employee_ID);
                      newTrail.append('Comment', "Updated slot information '" +updatedSchedule.date+"'");

                      this.data.GenerateAuditTrail(newTrail).subscribe(response => {
                        Swal.fire('Evaluation schedule has been updated successfully', '', 'success');
                  this.router.navigate(['/schedule']);
                      });
                    }
                    else {
                      console.log("loggedInUser is null");
                      Swal.fire('Update of schedule slot has been unsuccessful. Try again or  Please contact support', '', 'error');
                    }




                },
                (error) => {
                  console.error('Error updating slot:', error);
                  Swal.fire('Update of schedule slot has been unsuccessful. Try again.', '', 'error');
                  this.router.navigate(['/schedule']);
                }
              );
            }
          });
        } else {
          // Show an error alert if the new slots number is the same as the old number
          Swal.fire('New slots number must be different from the old number.', '', 'error');
        }
      } else {
        // Show an error alert if the slotsNumberValue is not between 0 and 5
        Swal.fire('Slots number must be between 0 and 5.', '', 'error');
      }
    } else {
      console.error('Form is not valid.');
      Swal.fire('Slots number must be between 0 and 5.', '', 'error');
    }
  }



}
