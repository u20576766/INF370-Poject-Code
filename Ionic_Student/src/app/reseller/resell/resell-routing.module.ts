import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResellPage } from './resell.page';

const routes: Routes = [
  {
    path: '',
    component: ResellPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResellPageRoutingModule {}
