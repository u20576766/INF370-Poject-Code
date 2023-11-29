import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'The Book Market';

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.loadBasket();
    this.data.getShoppingCart(1);
  }

  loadBasket() {
    const studentId = localStorage.getItem('studentId');
    if (studentId != null) {
      const realCart = parseInt(studentId, 10);
      if (!isNaN(realCart)) {
        this.data.getShoppingCart(realCart);
      } else {
        console.error('Invalid student id stored in local storage');
        // Handle the case where the shopping cart ID is not a valid number
      }
    } else {
      console.error('No student id found in local storage');
      // Handle the case where no shopping cart ID is stored in local storage
    }
  }



}



