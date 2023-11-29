import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Schedule } from '../shared/schedule';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';




@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit {

  schedules: Schedule[] = [];
  nonDeletableSlots: Schedule[] = [];
  cart: number = 5;
  deleteid: number = 0;
  constructor(private dataService: DataService, private router: Router, private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.refreshData();
  }
  refreshData(): void {
    this.getAllSchedules();
    this.fetchNonDeletableSlots();
  }

  getAllSchedules(): void {
    this.dataService.getAllScheduleSlots().subscribe(
      (schedules: Schedule[]) => {
        this.schedules = schedules;
      },
      (error) => {
        console.error('Error fetching schedules:', error);

        // Display SweetAlert2 error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error retrieving schedules.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    );
  }


  fetchNonDeletableSlots(): void {
    this.dataService.getNonDeletableSlots().subscribe(
      (slots: Schedule[]) => {
        this.nonDeletableSlots = slots;
      },
      (error) => {
        console.error('Error fetching non-deletable slots:', error);
      }
    );
  }


  UpdateSlots(scheduleId: number) {
    this.router.navigate(['/Update-Slot', scheduleId])
  }


  deletescheduleslot(scheduleid: number , scheduledate:string) {
    const isDeletable = this.nonDeletableSlots.some(schedule => schedule.schedule_ID === scheduleid);

    if (!isDeletable) {
      console.log('Schedule is deletable.');// slot is deletable
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you want to delete this slot?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
      }).then((result) => {
        if (result.isConfirmed) //if user clicked yes
        {
          this.dataService.deleteScheduleSlot(scheduleid).subscribe((response: any) => {
            if (typeof response == 'string' && response.includes('Slot deleted successfully!')) {
              console.log('Slot deleted successfully!');
              let newObject = window.localStorage.getItem("loggedInUser");
              if (newObject !== null) {
                const userObject = JSON.parse(newObject);
                const fullname = userObject.name + " " + userObject.surname;

                let newTrail = new FormData();
                newTrail.append('AuditEntryTypeID', '31');
                newTrail.append('Employee_ID', userObject.employee_ID);
                newTrail.append('Comment', "Deleted evaluation schedule slot '" + scheduledate+"'");

                this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {

              Swal.fire('Deleted!', 'Slot has been deleted successfully', 'success');
              this.getAllSchedules();
                });
              }
              else {
                console.log("loggedInUser is null");
                Swal.fire('Error', 'An error occurred while deleting the slot.Please contact Support', 'error');
              }



            }
            else {
              Swal.fire('Error', 'An error occurred while deleting the slot', 'error');
            }
          })
        }
      })
    }
    else {
      Swal.fire('This slot cannot be deleted because it has booking(s).', '', 'error');
    }
  } //end of delte


}
