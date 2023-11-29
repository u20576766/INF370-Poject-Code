import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import * as XLSX from 'xlsx';
///import { Chart } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { Router , NavigationEnd} from '@angular/router';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  constructor(
    private data: DataService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private renderer: Renderer2,
    private el: ElementRef,
    private router :Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event fired');
        this.refreshData();
      }
    });

  }

  searchQuery: string = '';
  filteredSales: any[] = [];
  Sales: any[] = [];

  ngOnInit(): void {
    //this.getSale();
    this.refreshData();
  }

  refreshData()
  {
    this.getSale();
  }
  getSale() {
    this.data.getSaleTables().subscribe(response => {
      this.Sales = response.$values;
      this.applySearchFilter();
      this.formatDates();
     // this.showPieChart()
    });
  }

  applySearchFilter() {
    if (!this.searchQuery.trim()) {
      this.filteredSales = this.Sales;
      return;
    }

    const lowerCaseSearch = this.searchQuery.trim().toLowerCase();

    this.filteredSales = this.Sales.filter(sale =>
      sale.date.toLowerCase().includes(lowerCaseSearch) ||
      sale.totalAmount.toString().includes(lowerCaseSearch) ||
      sale.employee.toLowerCase().includes(lowerCaseSearch) ||
      sale.paymentType.toLowerCase().includes(lowerCaseSearch) ||
      sale.students.toLowerCase().includes(lowerCaseSearch)
    );
  }

  formatDates() {
    for (const sale of this.Sales) {
      sale.date = this.datePipe.transform(sale.date, 'MMMM d, y, h:mm:ss a');
      sale.totalAmount = this.currencyPipe.transform(sale.totalAmount, 'R', 'symbol', '1.2-2');
    }
  }

  showPieChart() {
    console.log(this.Sales);

    // Initialize total sales for Cash and Card
    let cashSalesTotal = 0;
    let cardSalesTotal = 0;

    // Calculate the totals based on payment type
    for (const sale of this.Sales) {
      const totalAmount = parseFloat(sale.totalAmount.replace('R', '').replace(',', ''));

      if (sale.paymentType.toLowerCase() === 'cash') {
        cashSalesTotal += totalAmount;
      } else if (sale.paymentType.toLowerCase() === 'card') {
        cardSalesTotal += totalAmount;
      }
    }

    console.log('Cash Sales Total:', cashSalesTotal);
    console.log('Card Sales Total:', cardSalesTotal);

    // Create a pie chart
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;

    // Use 'chart.js/auto' to create the chart
    const ctx = canvas.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            `Cash: ZAR${cashSalesTotal.toFixed(2)}`,
            `Card: ZAR${cardSalesTotal.toFixed(2)}`
          ],
          datasets: [
            {
              data: [cashSalesTotal, cardSalesTotal],
              backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            },
          ],
        },
      });
    } else {
      console.error('Canvas context is not available.');
    }

    // Use SweetAlert2 to display the chart in a modal
    Swal.fire({
      title: 'Total Sales per Payment',
      html: canvas,
      showCloseButton: true,
      showConfirmButton: false,
    });
  }



  generateExcel() {
    const dataToExport = [
      ['Sales Summary'],
      ['Date', 'Total Sales Amount', 'Employee', 'Student', 'Payment Type'],
      ...this.Sales.map(sale => [sale.date, sale.totalAmount, sale.employee, sale.students, sale.paymentType])
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesSummary');

    XLSX.writeFile(workbook, 'sales_summary.xlsx');
  }
}
