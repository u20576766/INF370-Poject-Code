import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewResalePage } from './view-resale.page';

const routes: Routes = [
  {
    path: '',
    component: ViewResalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewResalePageRoutingModule {}
