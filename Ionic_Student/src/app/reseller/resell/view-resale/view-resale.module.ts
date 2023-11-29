import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewResalePageRoutingModule } from './view-resale-routing.module';

import { ViewResalePage } from './view-resale.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewResalePageRoutingModule
  ],
  declarations: [ViewResalePage]
})
export class ViewResalePageModule {}
