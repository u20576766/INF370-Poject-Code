import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

import { BookedPageRoutingModule } from './booked-routing.module';

import { BookedPage } from './booked.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookedPageRoutingModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
  ],
  declarations: [BookedPage]
})
export class BookedPageModule {}
