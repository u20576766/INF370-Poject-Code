import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResellPageRoutingModule } from './resell-routing.module';

import { ResellPage } from './resell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResellPageRoutingModule
  ],
  declarations: [ResellPage]
})
export class ResellPageModule {}
