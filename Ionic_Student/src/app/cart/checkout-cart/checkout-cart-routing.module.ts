import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutCartPage } from './checkout-cart.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutCartPageRoutingModule {}
