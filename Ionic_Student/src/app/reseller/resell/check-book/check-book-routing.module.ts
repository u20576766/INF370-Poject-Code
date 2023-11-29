import { NgModule } from '@angular/core';
import { Routes, RouterModule,  } from '@angular/router';

import { CheckBookPage } from './check-book.page';

const routes: Routes = [
  {
    path: '',
    component: CheckBookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckBookPageRoutingModule {}
