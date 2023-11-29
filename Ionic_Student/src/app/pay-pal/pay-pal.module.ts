import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayPalPageRoutingModule } from './pay-pal-routing.module';

import { PayPalPage } from './pay-pal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayPalPageRoutingModule
  ],
  declarations: [PayPalPage]
})
export class PayPalPageModule {}
