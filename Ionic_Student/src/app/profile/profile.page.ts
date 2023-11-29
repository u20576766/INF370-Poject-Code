import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firstName: string = ''; // Initialize with an empty string

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Retrieve the user's first name from local storage
    this.firstName = localStorage.getItem('firstName') || '';

    // Listen for changes in authentication status
    this.authService.authStatus.subscribe((authenticated) => {
      if (!authenticated) {
        // Redirect to the login page after logout
        window.location.href = '/login'; // You can change this to your actual login page URL
      }
    });
  }

  logout() {
    localStorage.setItem('loggedInUser', 'false');
    console.log('Logging out...');
    this.authService.logout();
    location.reload()
  }

}
