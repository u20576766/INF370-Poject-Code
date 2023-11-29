import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayPalPage } from './pay-pal.page';

const routes: Routes = [
  {
    path: '',
    component: PayPalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayPalPageRoutingModule {}
