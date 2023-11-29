import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataService } from 'src/app/services/data.service';
import { OrderReport, OrderVoucherBreakdown } from 'src/app/shared/orderreport';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {
  orderReport!: OrderReport;
  vouchers!: OrderVoucherBreakdown;
  vouchersApplied: number = 0;
  isDataLoaded: boolean = false; // Flag to track if data is loaded

  LoggedInName: string = "";
  empType: number = 0;
  employeeID: number = 0;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    //User Information
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.employeeID = userObject.employee_ID;
      this.LoggedInName = userObject.name + " " + userObject.surname;
      this.empType = userObject.employee_Type_ID;
    }

    this.dataService.GenerateOrderReport().subscribe(
      (report: OrderReport) => {
        this.orderReport = report;
        this.isDataLoaded = true; // Mark data as loaded

        // Count the length of ordersWithVoucher
        this.vouchersApplied = this.orderReport.orderVoucherBreakdowns.$values.length;

        console.log('Received report:', this.orderReport);
        let newObject = window.localStorage.getItem("loggedInUser");
        if (newObject !== null) {
          const userObject = JSON.parse(newObject);
          this.fullname = userObject.name + " " + userObject.surname;

          let newTrail = new FormData();
          newTrail.append('AuditEntryTypeID', '55');
          newTrail.append('Employee_ID', userObject.employee_ID);
          newTrail.append('Comment', "Visited Online Orders Report");

          this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
          });
        }
        else {
          console.log("loggedInUser is null");
        }
      },
      error => {
        console.error('Error fetching order report:', error);
      }
    );
  }

  toggleDetails(details: any): void {
    details.showDetails = !details.showDetails;
  }


  stringDate!: string;
  fullname: string = "";
  img: string = 'data:image/png;base64,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'; // Your image data

  downloadOrdersReport() {
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      this.fullname = userObject.name + " " + userObject.surname;

      let newTrail = new FormData();
      newTrail.append('AuditEntryTypeID', '55');
      newTrail.append('Employee_ID', userObject.employee_ID);
      newTrail.append('Comment', "Downloaded Online Orders Report");
    } else {
      console.log("loggedInUser is null");
    }

    const doc = new jsPDF();
    const pageCount = (doc as any).internal.getNumberOfPages();
    // Reset the font style and color for the rest of the document
    doc.setFont('helvetica'); // Reset font style to regular
    doc.setTextColor(0); // Reset text color to black (RGB)

    const date = new Date();
    this.stringDate = date.toString();

    // Add the image at the top left corner
    const imgWidth = 20;
    const imgHeight = 20;
    doc.addImage(this.img, 'PNG', 10, 10, imgWidth, imgHeight);
    let text = "";
    text = "The Book Market\n114 Duxbury Rd\nPretoria, South Africa\n\nOnline Orders Report\nReport Date: "
      + date.toDateString() + "\nGenerated By: " + this.LoggedInName;

    const textX = 10 + imgWidth + 10; // 10 pixels spacing between image and text
    const textY = 10; // Adjust this value to position the text vertically
    const maxWidth = 90; // Adjust the maximum width of the text
    const lines = doc.splitTextToSize(text, maxWidth);

    const fontSize = 10; // Adjust the font size
    doc.setFontSize(fontSize); // Set the font size
    doc.text(lines, textX, textY);

    // Calculate the Y position for the table (below the image and text)
    const lineHeight = fontSize * 0.5; // Adjust line height based on font size
    const tableY = Math.max(textY + lines.length * lineHeight); // Adjust spacing
    const textBlockHeight = lines.length * lineHeight;

    const Vouchercolumns = ['Voucher Code', 'Total Orders with Voucher', 'Total Discount Amount from Voucher'];
    let Voucherdata: any[] = [];

    if (this.orderReport && this.orderReport.orderVoucherBreakdowns && this.orderReport.orderVoucherBreakdowns.$values) {
      Voucherdata = this.orderReport.orderVoucherBreakdowns.$values.map(voucher => [
        voucher.voucherCode,
        voucher.totalOrdersWithVoucher,
        voucher.totalDiscountAmountFromVoucher
      ]);
    }

    const rowHeight = 10; // Adjust row height as needed
    const tableHeight = Voucherdata.length * rowHeight;
    doc.setFontSize(12); // Set font size to 14
    doc.setFont('helvetica', 'bold'); // Set font style to bold
    doc.setTextColor(0, 0, 255); // Set text color to blue (RGB)

    // Generate the Voucher Breakdown table
    doc.text('Voucher Breakdown Table', textX - 19, textBlockHeight + 4);
    autoTable(doc, {
      head: [Vouchercolumns],
      body: Voucherdata,
      startY: tableY
    });

    const DateBreakdownColumns = ['Date', 'Total Orders on Date', 'Total Revenue on Date'];
    let DateBreakdownData: any[] = [];

    if (this.orderReport && this.orderReport.orderDateBreakdowns && this.orderReport.orderDateBreakdowns.$values) {
      DateBreakdownData = this.orderReport.orderDateBreakdowns.$values.map(dateBreakdown => [
        dateBreakdown.date,
        dateBreakdown.totalOrdersOnDate,
        dateBreakdown.totalRevenueOnDate
      ]);
    }

    const dateRowHeight = 10; // Adjust row height as needed
    const dateTableHeight = DateBreakdownData.length * dateRowHeight;

    // Calculate the Y position for the date breakdown table (below the Voucher table)
    const dateTableY = tableY + tableHeight + 10; // Adjust spacing between tables

    // Generate the Date Breakdown table
    doc.text('Date Breakdown Table', textX - 19, dateTableY - 4);
    autoTable(doc, {
      head: [DateBreakdownColumns],
      body: DateBreakdownData,
      startY: dateTableY
    });

    let facultyData: any[] = []
    if (this.orderReport && this.orderReport.facultyBreakdowns && this.orderReport.facultyBreakdowns.$values) {
      facultyData = this.orderReport.facultyBreakdowns.$values.map(faculty => [
        faculty.facultyName,
        faculty.totalRevenueFromBooks,
        faculty.totalBooksSold
      ])
    }
    const facultyColumns = ['Faculty Name', 'Total Revenue from Books', 'Total number of books sold']
    const facultyTableY = dateTableY + dateTableHeight + 10; // Adjust spacing between tables
    doc.text('Faculty Breakdown Table', textX - 19, facultyTableY - 4);
    autoTable(doc, {
      head: [facultyColumns],
      body: facultyData,
      startY: facultyTableY
    });

    // For each page, print the page number and the total pages
    for (let i = 1; i <= pageCount; i++) {
      doc.setFontSize(10);
      // Go to page i
      doc.setPage(i);
      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.getWidth() / 2, pageHeight - 8); //data.settings.margin.left if you want it on the left
      doc.save('OnlineOrdersReport' + Date.now() + '.pdf');
    }


  }

}