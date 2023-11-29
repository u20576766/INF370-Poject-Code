import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2';
import { Order } from '../shared/order';
import { Student } from '../shared/student';
import { WalkInSaleViewModel } from '../shared/walkinSALE';
import { formatDate } from '@angular/common';
import { ResaleReport } from '../shared/resalereport';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  orders: Order[] = [];
  arrStudents: Student[] = [];
  Sales: WalkInSaleViewModel[] = [];
  resaleReports: ResaleReport[] = [];

  studentsNo: number = 0;
  ordersNo: number = 0;
  salesNo: number = 0;
  resalesNo: number = 0;

  LoggedInName: string = "";
  empType: number = 0;
  employeeID: number = 0;
  totalSales: number = 0;
  totalOrders: number = 0;
  totalMoneyIn: number = 0;
  totalMoneyOut: number = 0;

  moneyChart!: Chart;
  transactionsChart!: Chart;

  constructor(private data: DataService) {
    // Register Chart.js plugins (needed for TypeScript)
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // User Information
    this.GetAllOrders();
    console.log(this.ordersNo)

    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.employeeID = userObject.employee_ID;
      this.LoggedInName = userObject.name + " " + userObject.surname;
      this.empType = userObject.employee_Type_ID;
    }

    // Fetch data and create charts
    forkJoin([
      
      this.getAllStudents(),
      this.getSale(),
      this.GetResales()
    ])
  }



  ngAfterViewInit(): void {


    // Call chart creation methods here
    this.createMoneyChart();
    this.createTransactionsChart();

  }


  createMoneyChart() {
    const moneyCanvas = document.getElementById('moneyChart') as HTMLCanvasElement;

    // Destroy existing chart instance if it exists
    if (this.moneyChart) {
      this.moneyChart.destroy();
    }

    const moneyData = {
      labels: ['MONEY IN', 'MONEY OUT'],
      datasets: [
        {
          label: 'Money',
          data: [this.totalMoneyIn, this.totalMoneyOut],
          backgroundColor: ['green', 'red'],
        },
      ],
    };

    const moneyConfig: ChartConfiguration = {
      type: 'bar',
      data: moneyData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    this.moneyChart = new Chart(moneyCanvas, moneyConfig);
  }

  createTransactionsChart() {
    const transactionsCanvas = document.getElementById('transactionsChart') as HTMLCanvasElement;
    console.log("salesNo:", this.salesNo);
    console.log("ordersNo:", this.ordersNo);
    console.log("studentsNo:", this.studentsNo);
    console.log("resalesNo:", this.resalesNo);
    // Destroy existing chart instance if it exists
    if (this.transactionsChart) {
      this.transactionsChart.destroy();
    }

    const transactionsData = {
      labels: ['SALES', 'ORDERS', 'STUDENTS', 'RESALES'],
      datasets: [
        {
          label: 'Transactions',
          data: [this.salesNo, this.ordersNo, this.studentsNo, this.resalesNo],
          backgroundColor: 'blue',
        },
      ],
    };

    const transactionsConfig: ChartConfiguration = {
      type: 'bar',
      data: transactionsData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          y1: {
            position: 'right',
          },
        },
      },
    };

    this.transactionsChart = new Chart(transactionsCanvas, transactionsConfig);

    // Add a line chart on top of the bar chart
    this.transactionsChart.data.datasets!.push({
      label: 'Total Transactions',
      data: [
        this.salesNo,
        this.ordersNo,
        this.studentsNo,
        this.resalesNo,
      ],
      type: 'line',
      borderColor: 'orange',
      borderWidth: 2,
      fill: false,
      yAxisID: 'y1',
    });

    this.transactionsChart.update();
  }



  // Get all orders
  GetAllOrders() {
    this.orders = [];
    this.data.GetAllOrders().subscribe(
      (result) => {
        let orList: any[] = result;
        orList.forEach((element) => {
          this.orders.push(element);
        });

        const totalAmounts = this.orders.map(order => order.order_Total);
        const sumOfTotalAmounts = totalAmounts.reduce((total, amount) => total + amount, 0);

        this.totalOrders = sumOfTotalAmounts;

        // Get the length of orders with today's date
        this.ordersNo = this.orders.length;
        this.calculateTotalMoneyIn(); // Call calculateTotalMoneyIn here
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching orders.',
          confirmButtonText: 'OK',
        });
      }
    );
  }






  calculateTotalMoneyIn() {
    this.totalMoneyIn = this.totalSales + this.totalOrders;
  }

  // Get All Students
  getAllStudents() {
    this.arrStudents = [];
    this.data.GetAllTheStudents().subscribe(result => {
      let listStudents: any[] = result
      listStudents.forEach((element) => {
        this.arrStudents.push(element)
      });


      this.studentsNo = this.arrStudents.length; // Count the students and assign to studentsNo
      this.calculateTotalMoneyIn(); // Call this if needed
      this.createMoneyChart();
      this.createTransactionsChart();
    },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching students.',
          confirmButtonText: 'OK'
        });
      })
  }

  // Get All Sales
  getSale() {
    this.data.getSaleTables().subscribe(response => {
      this.Sales = response.$values;
      // Calculate the sum of total amounts
      const totalAmounts = this.Sales.map(sale => sale.totalAmount);
      const sumOfTotalAmounts = totalAmounts.reduce((total, amount) => total + amount, 0);

      this.totalSales = sumOfTotalAmounts;

      // Log the sum to the console
      console.log("Sum of Total Sales Amounts:", sumOfTotalAmounts);

      // Filter the sales with today's date
      const today = new Date();
      this.Sales = this.Sales.filter(sale => {
        const saleDate = new Date(sale.date); // Assuming there's a date property in the sale object
        return saleDate.toDateString() === today.toDateString();
      });
      this.salesNo = this.Sales.length;
      this.calculateTotalMoneyIn(); // Call calculateTotalMoneyIn here
      this.calculateTotalMoneyIn(); // Call this if needed
      this.createMoneyChart();
      this.createTransactionsChart();
    },
      (error) => {
        console.log(error)
      });
  }

  //Resales
  GetResales() {
    this.data.GenerateResaleReport().subscribe(data => {
      this.resaleReports = data.$values;

      const totalAmounts = this.resaleReports.map(resale => resale.amount_Exchanged);
      const sumOfTotalAmounts = totalAmounts.reduce((total, amount) => total + amount, 0);

      this.totalMoneyOut = sumOfTotalAmounts;

      // Filter the resales with today's date
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      const filteredResales = this.resaleReports.filter(resale => {
        const resaleDate = new Date(resale.date).toDateString().split('T')[0]; // Get the date from each resale in the same format
        return resaleDate === formattedToday; // Compare the dates
      });

      this.resalesNo = this.resaleReports.length;
      this.calculateTotalMoneyIn(); // Call this if needed
      this.createMoneyChart();
      this.createTransactionsChart();
    },
      (error: any) => {
        console.log(error)
      }
    );
  }


}
