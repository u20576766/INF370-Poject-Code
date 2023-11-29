import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckBookPageRoutingModule } from './check-book-routing.module';

import { CheckBookPage } from './check-book.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckBookPageRoutingModule,
     ReactiveFormsModule
  ],
  declarations: [CheckBookPage]
})
export class CheckBookPageModule {}
