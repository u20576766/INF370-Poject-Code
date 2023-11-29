import { Component } from '@angular/core';
import { ShoppingCart } from '../shared/shoppingcart';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelpTip } from '../shared/help-tip';

@Component({
  selector: 'app-help-tips',
  templateUrl: './help-tips.component.html',
  styleUrls: ['./help-tips.component.scss']
})


export class HelpTipsComponent {


  shoppingCart: ShoppingCart | null = null;

  constructor(private dataService: DataService, private router: Router, private snackbar: MatSnackBar) { }

  
  showProfile: boolean = true;
  useSharedFunction(): void {
    this.dataService.toggleProfile();
  }

  arrHelpTips: HelpTip[] = [];


  ngOnInit(): void {
    this.getAllHelpTips();

 }

  getAllHelpTips(){
    this.arrHelpTips = [];
    this.dataService.GetAllTheHelpTips().subscribe( result => {
      let listHelpTips: any[] = result;
      listHelpTips.forEach( (element) => {
        this.dataService.GenerateVideoStreamLink(element.fileName).subscribe( result => {
          element.filePath = result as string
        });
        this.arrHelpTips.push(element);
      });
    });
  }

  // Search Help Tips
  searchQuery: string = "";
  searchHelpTip() {
    if (this.searchQuery == "") {
      this.getAllHelpTips();
    }
    else {
      this.dataService.SearchHelpTips(this.searchQuery).subscribe(
        result => {
          let listHelpTips: any[] = result;
          this.arrHelpTips = [];
          listHelpTips.forEach((element) => {
            this.arrHelpTips.push(element);
          });
        }
      );
    }
  }


}
