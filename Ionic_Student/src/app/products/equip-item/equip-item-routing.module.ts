import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipItemPage } from './equip-item.page';

const routes: Routes = [
  {
    path: '',
    component: EquipItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipItemPageRoutingModule {}
