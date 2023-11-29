import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluatedPage } from './evaluated.page';

const routes: Routes = [
  {
    path: '',
    component: EvaluatedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluatedPageRoutingModule {}
