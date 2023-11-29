import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailConfirmPageRoutingModule } from './email-confirm-routing.module';

import { EmailConfirmPage } from './email-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailConfirmPageRoutingModule
  ],
  declarations: [EmailConfirmPage]
})
export class EmailConfirmPageModule {}
