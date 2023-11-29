import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';

  constructor(private authService: AuthService, private alertController: AlertController) {}

  ngOnInit(): void {}

  async forgotPassword() {
    if (this.email) {
      const model = { email: this.email };
      console.log(this.email);
      try {
        await this.authService.forgotPassword(model).toPromise(); // Assuming your authService returns an Observable
        await this.presentSuccessAlert();
      } catch (error) {
        console.error(error);
        await this.presentErrorAlert();
      }
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Password reset request sent. Please check your email for further instructions.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Password reset request failed. Please try again later.',
      buttons: ['OK']
    });
    await alert.present();
  }
}