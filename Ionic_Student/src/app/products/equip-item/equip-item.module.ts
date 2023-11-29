import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipItemPageRoutingModule } from './equip-item-routing.module';

import { EquipItemPage } from './equip-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipItemPageRoutingModule
  ],
  declarations: [EquipItemPage]
})
export class EquipItemPageModule {}
