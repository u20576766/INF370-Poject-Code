import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Update the path to your AuthService
import { UpdateAccountModel } from 'src/app/shared/account';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  userDetails: UpdateAccountModel = {
    firstName: '', // Initialize with empty values
    lastName: '',
    email: '',
    cell_Number: '',
    subscribed: true,

  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch the user's details from local storage
    this.userDetails.firstName = localStorage.getItem('firstName') || '';
    this.userDetails.lastName = localStorage.getItem('lastName') || '';
    this.userDetails.email = localStorage.getItem('email') || '';
    this.userDetails.cell_Number = localStorage.getItem('cell_Number') || '';
    // Convert the 'subscribed' value from string to boolean
    const subscribedValue = localStorage.getItem('subscribed');
    this.userDetails.subscribed = subscribedValue === 'true'; 
  }
}
