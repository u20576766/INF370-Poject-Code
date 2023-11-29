import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-resell',
  templateUrl: './resell.page.html',
  styleUrls: ['./resell.page.scss'],
})
export class ResellPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    this.showResellAlert();
  }

  async showResellAlert() {
    const alert = await this.alertController.create({
      header: 'Welcome To Resell!',
      message: `
        Here you can go through the processes to resell your book to us.
        You can first check the book's estimate, if satisfied you can add it to resale.
        Then proceed to schedule an evaluation for the books you have added to resale.
        After all is said and done, you can view the details of all your resale transactions.
      `,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  

}
