import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookItemPage } from './book-item.page';

const routes: Routes = [
  {
    path: '',
    component: BookItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookItemPageRoutingModule {}
