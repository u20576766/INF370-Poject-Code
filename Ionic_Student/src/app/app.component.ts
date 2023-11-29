import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showContent = false;

  user = localStorage.getItem('loggedInUser')
  loggedIn = this.user === "true";

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  constructor(private router: Router, private alertController: AlertController, public data: DataService) {}

  ngOnInit(): void {
    this.data.getShoppingCart(this.sID)
    // Simulate a delay of 2 seconds before showing the content
    setTimeout(() => {
      this.showContent = true;
      console.log(this.user);
      if (this.loggedIn == true){
        this.router.navigate(['/home']);
      }
      else{
        this.router.navigate(['/login']);
      }
    }, 3000);
  }

}
