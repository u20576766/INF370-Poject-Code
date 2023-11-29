import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailConfirmPage } from './email-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: EmailConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailConfirmPageRoutingModule {}
