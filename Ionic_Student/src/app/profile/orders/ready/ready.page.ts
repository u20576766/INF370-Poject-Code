import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Order, OrderLine } from 'src/app/shared/order';
import { Student } from 'src/app/shared/student';
import { AlertController } from '@ionic/angular'; // Import AlertController

@Component({
  selector: 'app-ready',
  templateUrl: './ready.page.html',
  styleUrls: ['./ready.page.scss'],
})
export class ReadyPage implements OnInit {

  statusId: number = 1;
  orders2: Order[] = [];
  lines: OrderLine[] = [];
  isLoading: boolean = true; // Add a loading variable

  studentId = localStorage.getItem('studentId') || '';
  sID = parseInt(this.studentId ?? '0', 10);

  constructor(
    private data: DataService,
    private router: Router,
    private alertController: AlertController // Inject AlertController
  ) { }

  ngOnInit() {
    this.getOrderLines();
    this.getOrders2();
    console.log(this.orders2)
  }

  getOrderLines() {
    this.isLoading = true; // Set loading to true before the request
    this.data.GetOrderLines().subscribe(
      (result) => {
        this.isLoading = false;
        this.lines = result;
      },
      (error) => {
        this.isLoading = false;
        this.presentErrorAlert('An error occurred while fetching order lines.');
      }
    );
  }

  getOrders2() {
    this.orders2 = [];
    this.isLoading = true; // Set loading to true before the request
    this.data.GetOrdersByStatus(2).subscribe(
      (result) => {
        this.isLoading = false; // Set loading to true before the request
        let orList: any[] = result;
        
        // Format the date strings to "dd-mm-yyyy"
        orList = orList.filter((order) => order.student_ID === this.sID);
        orList.forEach((order) => {
          order.order_Date = this.formatDate(order.order_Date);
        });
  
        this.orders2 = orList;
      },
      (error) => {
        this.presentErrorAlert('An error occurred while fetching orders.');
      }
    );
  }

  // Function to format date as "dd Month yyyy"
  formatDate(dateString: string): string {
    const parts = dateString.split('-'); // Assuming the format is dd-mm-yyyy
    const day = String(parts[0]).padStart(2, '0');
    const month = String(parts[1]).padStart(2, '0');
    const year = parts[2];

    // Array of month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = parseInt(month, 10) - 1; // Subtract 1 since months are 0-based in JavaScript Date objects
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const monthName = monthNames[monthIndex];

    return `${day} ${monthName} ${formattedDate.getFullYear()}`;
  }
  

  // Function to count the number of order lines for a specific order
  getOrderLineCount(orderID: number): number {
    return this.lines.filter((line) => line.order_ID === orderID).length;
  }

  // Search for orders
searchInput: string = "";

searchOrder() {
  if (this.searchInput.trim() === "") {
    this.getOrders2();
  } else {
    this.data.SearchOrder(this.searchInput).subscribe(result => {
      let orList: any[] = result;
      this.orders2 = [];

      if (orList.length === 0) {
        // Show an alert if the array returned is empty
        this.getOrders2();
        this.presentNoOrderAlert();
      } else {
        orList.forEach((element) => {
          this.orders2.push(element);
        });
      }
    });
  }
}

async presentNoOrderAlert(): Promise<void> {
  const alert = await this.alertController.create({
    header: 'No Orders Found',
    message: 'There are no orders with the provided reference.',
    buttons: ['OK']
  });
  await alert.present();
}


  // Function to present an Ionic Alert for errors
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
