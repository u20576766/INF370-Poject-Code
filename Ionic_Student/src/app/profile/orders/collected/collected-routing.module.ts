import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectedPage } from './collected.page';

const routes: Routes = [
  {
    path: '',
    component: CollectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectedPageRoutingModule {}
