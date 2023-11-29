import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule } from '@angular/forms';


import { CheckoutCartPageRoutingModule } from './checkout-cart-routing.module';

import { CheckoutCartPage } from './checkout-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutCartPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CheckoutCartPage]
})
export class CheckoutCartPageModule {}
