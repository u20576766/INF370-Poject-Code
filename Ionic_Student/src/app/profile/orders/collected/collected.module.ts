import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectedPageRoutingModule } from './collected-routing.module';

import { CollectedPage } from './collected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectedPageRoutingModule
  ],
  declarations: [CollectedPage]
})
export class CollectedPageModule {}
