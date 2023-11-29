import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder and FormGroup
import { ResellerPercent } from '../shared/ResellerPercent';

@Component({
  selector: 'app-resale',
  templateUrl: './resale.component.html',
  styleUrls: ['./resale.component.scss']
})
export class ResaleComponent implements OnInit {
  resellerData: ResellerPercent[] = []; // Declare an array to store the data

  formUpdate!: FormGroup; // Define a FormGroup for the update form

  constructor(private data: DataService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }


  ViewResalePercent() {
    this.data.getresellerpercent().subscribe(
      (response: ResellerPercent | undefined) => {
        if (response) {
          // Check if response is defined
          this.resellerData = [response];
          //  console.log(this.resellerData);

          // Build the HTML for the table
          const tableHtml = `
        <table class="table table-inverse">
          <thead>
            <tr>
              <th>Name</th>
              <th>Percent Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr style="height: max-content;">
              <td>Reseller Percent</td>
              <td>${this.resellerData[0].percent_Value}</td>
              <td style="text-align: right;">
                <button class="btn update" style="background-color: #50294A;padding:20px;
                color: white;
                font-weight: bold;
                padding: 4px;
                width: fit-content;"><i class="fa fa-edit"></i>&nbsp;&nbsp;UPDATE</button>
              </td>
            </tr>
          </tbody>
        </table>
      `;

          // Display the table in a SweetAlert2 modal
          Swal.fire({
            title: 'Reseller Percent',
            html: tableHtml,
            showCloseButton: true,
            showConfirmButton: false
          });

          // Add click event listeners to the "Update" buttons if needed
          const updateButtons = document.querySelectorAll('.update');
          updateButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
              this.ShowUpdatePage(); // Show the update page
              //Swal.close(); // Close the modal after the update button is clicked
            });
          });

        } else {
          console.error('Response is undefined or does not have the expected structure.');
          // Handle the error or set a default value for this.resellerData if needed.
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching the reseller percent.',
            confirmButtonText: 'OK'
          });
        }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching the reseller percent.',
          confirmButtonText: 'OK'
        });
      });
  }
  ShowUpdatePage() {
    // Check if this.resellerData is defined and has the property percent_Value
    if (this.resellerData && this.resellerData.length > 0) {
      const resellerPercent = this.resellerData[0]; // Assuming you have a single reseller percent object

      this.formUpdate = this.fb.group({
        percent: [resellerPercent.percent_Value, [Validators.min(1), Validators.max(99)]]
      });

      // Display the Swal Alert with the HTML content
      Swal.fire({
        title: 'Update Reseller Percent',
        html: this.createSwalHtml(resellerPercent.percent_Value), // Pass the initial value
        showCloseButton: true,
        showConfirmButton: false
      });


      const updateButtons = document.querySelectorAll('.update');
      updateButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // Get the updated percent value from the input field
          const percentInput = document.querySelector('.percent') as HTMLInputElement;
          if (percentInput) {
            const updatedValue = parseFloat(percentInput.value); // Convert to a number if needed
            console.log(updatedValue);

            this.updateResellerPercent(updatedValue)

          }

        });
      });


      const CancelButtons = document.querySelectorAll('.cancel');
      CancelButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // Show the update page
          this.ViewResalePercent();
        });
      });
    } else {
      console.error('Reseller data is not defined or does not have the property percent_Value.');
    }
  }

  // Create the HTML content for the Swal modal
  // Create the HTML content for the Swal modal
  createSwalHtml(initialValue: number) {
    return `
      <div class="row" style="text-align:center;">
        <div class="col">
          <form class="form-group" [formGroup]="formUpdate" (ngSubmit)="onUpdateSubmit($event)">
            <div class="mb-3">
              <label class="form-label" style="font-weight: bold;">Percentage</label>
              <input #percentInput type="number" class="form-control percent" name="percent" formControlName="percent" min="1" max="99" step="1" value="${initialValue}">
            </div>
            <div class="row">
            <div class="col">
            <button type="submit" class="btn cancel" style="width: fit-content; margin-top: 5px; margin-left: 4px;  background-color: #50294A;
            color: white;
            font-weight: bold;
            padding: 10px;
            width: fit-content;" (click)="onUpdateSubmit($event)">UPDATE</button>
            </div>
            <div class="col">
            <button type="button" class="btn cancel" style="width: fit-content; margin-top: 5px; margin-left: 4px;  background-color: black;
            color: white;
            font-weight: bold;
            padding: 10px;
            width: fit-content;"
            (click)="Swal.close()">CANCEL</button>
            </div>
            </div>
          </form>
        </div>
      </div>
  `;
  }


  updateResellerPercent(updatedPercentValue: number) {
    // Get the updated percent value from the form

    const UpdatedPercentValue = updatedPercentValue;

    // Check if the value is within the valid range (1 to 99)
    if (UpdatedPercentValue >= 1 && UpdatedPercentValue <= 99) {
      // Display a confirmation Swal alert
      Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update the reseller percent?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // The user confirmed, you can proceed with the update logic here
          console.log('Updating the reseller percent...');

          let editedPercent = new ResellerPercent();
          editedPercent.percent_Id = this.resellerData[0].percent_Id;
          editedPercent.percent_Value = UpdatedPercentValue;
          this.data.UpdatePercent(editedPercent).subscribe((response: any) => {
            let newObject = window.localStorage.getItem("loggedInUser");
            if (newObject !== null) {
              const userObject = JSON.parse(newObject);
              const fullname = userObject.name + " " + userObject.surname;

              let newTrail = new FormData();
              newTrail.append('AuditEntryTypeID', '70');
              newTrail.append('Employee_ID', userObject.employee_ID);
              newTrail.append('Comment', "Updated reseller percent to '" + editedPercent.percent_Value + "%'");

              this.data.GenerateAuditTrail(newTrail).subscribe(response => {

                Swal.close
                Swal.fire('Success', 'Reseller Percent has been successfully updated', 'success');
              });
            }
            else {
              console.log("loggedInUser is null");
              Swal.fire('Error', 'Failed to update reseller percent ', 'error');
              Swal.close()
            }



          }),
            (error: any) => {
              Swal.fire('Error', 'Failed to update reseller percent ', 'error');
              Swal.close()
            }




          Swal.close();
        }
      });
    } else {
      // Display an error Swal alert if the value is not within the valid range
      Swal.fire({
        icon: 'error',
        title: 'Invalid Value',
        text: 'Please enter a value between 1 and 99.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ViewResalePercent()
        }
      });
    }
  }

}
