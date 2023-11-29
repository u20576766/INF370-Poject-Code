import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Newsletter } from '../shared/newsletter';
import { AuditTrail } from '../shared/audit-trail';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  arrNewsletters: Newsletter[] = [];
  searchQuery: string = "";
  constructor(private dataService: DataService){

  }
  ngOnInit():void {
    this.getNewsletters();
console.log(this.arrNewsletters);
  }
  searchNewsletter() {

  }
  //Get All the Help Tips
  getNewsletters(){
    this.arrNewsletters = [];
    this.dataService.GetAllTheNewsletters().subscribe( result => {
      let listNewsletters: any[] = result;
      listNewsletters.forEach( (element) => {
        this.dataService.GenerateVideoStreamLink(element.FileName).subscribe( result => {
          element.FilePath = result as string
        });
        this.arrNewsletters.push(element);
      });
    });
  }

  handleChange() {
    const selectElement = document.getElementById("dateOrderBy") as HTMLSelectElement;
    const selectedValue = selectElement.value;
    
    // Do something with the selected value
    console.log("Selected value: " + selectedValue);

    if (selectedValue == "ascending") {
      this.arrNewsletters = [];
      this.dataService.GetAllTheNewsletters().subscribe( result => {
        let listNewsletters: any[] = result;
        listNewsletters.forEach( (element) => {
          this.dataService.GenerateVideoStreamLink(element.FileName).subscribe( result => {
            element.FilePath = result as string
          });
          this.arrNewsletters.push(element);
        });
      });
    }

    else if (selectedValue =="descending") {
      this.arrNewsletters = [];
      this.dataService.SortNewslettersByDescending().subscribe( result => {
        let listNewsletters: any[] = result;
        listNewsletters.forEach( (element) => {
          this.dataService.GenerateVideoStreamLink(element.FileName).subscribe( result => {
            element.FilePath = result as string
          });
          this.arrNewsletters.push(element);
        });
      });
    }
  }

  downloadNewsletterFile(fileName: string){
 
    let newObject = window.localStorage.getItem("loggedInUser");
    if (newObject !== null) {
      const userObject = JSON.parse(newObject);
      const fullname = userObject.name + " " + userObject.surname;

      let newTrail = new FormData();
      newTrail.append('AuditEntryTypeID', '61');
      newTrail.append('Employee_ID', userObject.employee_ID);
      newTrail.append('Comment', "Downloaded a newsletter file '"+fileName+"'"  );

      this.dataService.GenerateAuditTrail(newTrail).subscribe(response => {
      });
    }
    else {
      console.log("loggedInUser is null");
    }


  }
  
}
