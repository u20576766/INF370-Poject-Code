import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookItemPageRoutingModule } from './book-item-routing.module';

import { BookItemPage } from './book-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookItemPageRoutingModule
  ],
  declarations: [BookItemPage]
})
export class BookItemPageModule {}
