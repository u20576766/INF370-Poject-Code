import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

import { EvaluatedPageRoutingModule } from './evaluated-routing.module';

import { EvaluatedPage } from './evaluated.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluatedPageRoutingModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
  ],
  declarations: [EvaluatedPage]
})
export class EvaluatedPageModule {}
