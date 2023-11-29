import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WaitingPageRoutingModule } from './waiting-routing.module';

import { WaitingPage } from './waiting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingPageRoutingModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
  ],
  declarations: [
    WaitingPage
  ]
})
export class WaitingPageModule {}
