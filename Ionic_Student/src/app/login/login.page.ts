import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  hide = true;
  credentials: any = {
    userName: '',
    password: ''
  };

  // Define isLoading property
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  togglePassword(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }

  async onLogin() {
    // Show loading spinner
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    await loading.present();
  
    this.authService.login(this.credentials).subscribe(
      async (response) => {
        console.log('Success response:', response);
        // Successful login
        localStorage.setItem('loggedInUser', 'true');
        loading.dismiss(); // Dismiss loading spinner on success
        location.reload();
      },
      async (error) => {
        console.error('Error response:', error);
        // Handle login error (show an Ionic Alert)
        localStorage.setItem('loggedInUser', 'false');
        loading.dismiss(); // Dismiss loading spinner on error
        const alert = await this.alertController.create({
          header: 'Login Error',
          message: 'Invalid login attempt.',
          buttons: ['OK']
        });
  
        await alert.present();
      }
    );
  }
  
}
