import { Component, Output, EventEmitter,OnInit } from '@angular/core';
import { Schedule } from 'src/app/shared/schedule';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
const DAY_MS = 60 * 60 * 24 * 1000;
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuditTrail } from 'src/app/shared/audit-trail';
import { Newsletter } from 'src/app/shared/newsletter';


@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {

  schedules:Schedule[]=[];
  dates: Array<Date>;//represents the dates object
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; //dates of the week
  date = new Date(); //selected current date
   showModals:boolean =false;
  @Output() selected = new EventEmitter();

  constructor(private dataServices:DataService, private router:Router) {
    this.dates = this.getCalendarDays(this.date);
  }
  ngOnInit(): void {
    this.getAllSchedules();
  }

  //this is where the month is changed and increases or decreases
  setMonth(inc:number) {
    const [year, month] = [this.date.getFullYear(), this.date.getMonth()];
    this.date = new Date(year, month + inc, 1);
    this.dates = this.getCalendarDays(this.date);
  }


  //check if the date is in the same month as current selected date
  isSameMonth(date: Date) {
    const today = new Date();
    return date.getMonth() === this.date.getMonth()
  }


  //WISANI THIS METHOD ONLY , THE GET CALENADAR DATYS

 //this generates the array of date objects (calendar days)
 // Original getCalendarDays method
private getCalendarDays(date: Date = new Date()): Array<Date> {
  const today = new Date();
  const calendarStartTime = this.getCalendarStartDay(date).getTime();

  return this.range(0, 41)
    .map(num => new Date(calendarStartTime + DAY_MS * num));
}



  //represents calanders days
  private getCalendarStartDay(date: Date): Date {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();

    //monday to sunday
    return this.range(1, 7)
      .map(num => new Date(firstDayOfMonth - DAY_MS * num))
      .find(dt => dt.getDay() === 0)!; // The '!' asserts that the value won't be null/undefined
  }


  private range(start: number, end: number): Array<number> {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

//checks for the picked dates on the calendar
  pickedDates: Set<string> = new Set();
  onDateClicked(date: Date) {
    const today = new Date(); // Get the current date

    // Check if the selected date is in the same month
    if (this.isSameMonth(date)) {
      // Check if the selected date is not a previous date or the current date
      if (date >= today) {
        const pickedDateKey = this.dateToKey(date);
        this.pickedDates.add(pickedDateKey);
        this.selected.emit(date);
        console.log(this.pickedDates);
      } else {
        // Show a SweetAlert pop-up for an invalid date selection
        Swal.fire({
          icon: 'error',
          title: 'Invalid Date',
          text: 'You cannot select previous dates or the current date.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    }
  }
  //this where the dates is converted to string and format
 //this where the dates is converted to string and format
 isDatePicked(date: Date): boolean {
  const pickedDateKey = this.dateToKey(date);
  return this.pickedDates.has(pickedDateKey);
}
//captures date and returns it in a format '
private dateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
}


  getPickedDates(): string[] {
    return Array.from(this.pickedDates);
  }

  //remove date from string and update set and array
  removePickedDate(date: string) {
    this.pickedDates.delete(date);
    // Refresh the picked dates by creating a new Set with the updated values
    this.pickedDates = new Set(Array.from(this.pickedDates));
  }

  getAllSchedules(): void {
    this.dataServices.getAllScheduleSlots().subscribe(
      (schedules: Schedule[]) => {
        this.schedules = schedules;
        console.log(this.schedules)
      },
      (error) => {
        console.error('Error fetching schedules:', error);
      }
      )}


      AddSlots() {
        if (!this.pickedDates || this.pickedDates.size === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No schedule slot were picked. Select at least one slot.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        } else {
          const existingDates = Array.from(this.pickedDates).filter(pickedDate =>
            this.schedules.some(schedule => {
              const formattedScheduleDate = this.formatScheduleDate(schedule.date);
              return formattedScheduleDate === pickedDate;
            })
          );

          if (existingDates.length > 0) {
            Swal.fire({
              title: 'Date Exists',
              text: 'The selected date(s) already exist in the schedule. They will not be added.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });

            // Remove existing dates from pickedDates set
            existingDates.forEach(existingDate => {
              this.pickedDates.delete(existingDate);
            });
          }

          if (this.pickedDates.size > 0) {
            Swal.fire({
              title: 'Add new slots',
              text: 'Confirm to add new evaluation schedule slots',
              showConfirmButton: true,
              showDenyButton: true,
              confirmButtonText: 'Yes',
              denyButtonText: 'No'
            }).then((result) => {
              if (result.isConfirmed) {
                //const employeeId = 1;

                let empId ;
                //New employee id
                let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
         empId = userObject.employee_ID; }
                // Loop through the picked dates and create a Schedule for each
                for (const pickedDate of this.pickedDates) {
                  const newSchedule: Schedule = {
                    schedule_ID: 0,
                    date: pickedDate,
                    slots_Available: 5,
                    employee_ID: empId
                     };

                  // Call the API to add the schedule slot
                  this.dataServices.addScheduleSlot(newSchedule).subscribe(
                    (response: any) => {
                      if (typeof response === 'string' && response.includes('Schedule added successfully')) {
                        console.log(`Added schedule slot for date: ${pickedDate}`);

                        let newObject = window.localStorage.getItem("loggedInUser");
      if (newObject !== null) {
        const userObject = JSON.parse(newObject);
        const fullname = userObject.name + " " + userObject.surname;

        let newTrail = new FormData();
        newTrail.append('AuditEntryTypeID', '29');
        newTrail.append('Employee_ID', userObject.employee_ID);
        newTrail.append('Comment', "Added new evaluation schedule slot '"+ newSchedule.date+"'");

        this.dataServices.GenerateAuditTrail(newTrail).subscribe(response => {
          Swal.fire('Evaluation schedule has been updated successfully', '', 'success');
          this.router.navigate(['/schedule']);
        });
      }
      else {
        console.log("loggedInUser is null");
        Swal.fire('Adding of schedule slot has been unsuccessful. Try again.', '', 'error');
      }
                      } else {
                        console.error(`Unexpected response:`, response);
                        Swal.fire('Adding of schedule slot has been unsuccessful. Try again.', '', 'error');
                      }
                    }
                  );
                }
                // Clear the picked dates after adding
                this.pickedDates.clear();
                // Show the success modal
              }
            });
          }
        }
      }
      private formatScheduleDate(dateString: string): string {
        const [day, month, year] = dateString.split('-');
        return `${day}-${month}-${year}`;
      }




}
