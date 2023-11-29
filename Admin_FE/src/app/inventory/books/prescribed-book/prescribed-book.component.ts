import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PrescribedBook } from 'src/app/shared/prescribedbook';
import { Module } from 'src/app/shared/module';

@Component({
  selector: 'app-prescribed-book',
  templateUrl: './prescribed-book.component.html',
  styleUrls: ['./prescribed-book.component.scss']
})
export class PrescribedBookComponent implements OnInit {
  prescribedBooks: PrescribedBook[] = [];
  modules: Module[] = []; // Declare the modules property here

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getAllPrescribedBooks();
    this.GetAllModules();
  }

  getAllPrescribedBooks(): void {
    this.dataService.getAllPrescribedBooks().subscribe(
      (prescribedBooks) => {
        console.log(prescribedBooks); // Check if data is being retrieved
        this.prescribedBooks = prescribedBooks;
      },
      (error) => {
        console.log('Error fetching prescribed books:', error);
      }
    );
  }

  GetAllModules(): void {
    this.dataService.GetAllModules().subscribe(
      (modules) => {
        console.log(modules); // Check if data is being retrieved
        this.modules = modules;
      },
      (error) => {
        console.log('Error fetching modules:', error);
      }
    );
  }

  getModuleCode(module_ID: number): string {
    const module = this.modules.find((m) => m.module_ID === module_ID);
    return module ? module.module_Code.toString() : 'N/A';
  }
  
  searchInput: string = "";
  searchPre() {
    if (this.searchInput.trim() === "") {
      location.reload();
      this.getAllPrescribedBooks();
    } else {
      this.dataService.searchPrescribedBooks(this.searchInput).subscribe(result => {
        let preList: any[] = result;
        this.prescribedBooks = preList;
      });
    }
  }
}
