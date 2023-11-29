import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HelpTipsComponent } from './help-tips/help-tips.component';
import { CartComponent } from './cart/cart.component';
import { BooksComponent } from './books/books.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CheckBookEstimateComponent } from './resell/check-book-estimate/check-book-estimate.component';
import { ScheduleBookEvalComponent } from './resell/schedule-book-eval/schedule-book-eval.component';
import { ViewResaleDetailsComponent } from './resell/view-resale-details/view-resale-details.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { CheckOutComponent } from './cart/check-out/check-out.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderComponent } from './profile/order/order.component';
import { AccountDetailsComponent } from './profile/account-details/account-details.component';
import { ChangePasswordComponent } from './profile/account-details/change-password/change-password.component';
import { DeleteAccountComponent } from './profile/delete-account/delete-account.component';
import { UpdateAccountComponent } from './profile/account-details/update-account/update-account.component';
import { PayfastComponent } from './payfast/payfast.component';
import { EmailConfirmationComponent } from './sign-up/email-confirmation/email-confirmation.component';
import { ResetPasswordComponent } from './login/forgot-password/reset-password/reset-password.component';


import { AuthGuard } from './services/auth.guard';
import { EquipmentItemComponent } from './equipment-item/equipment-item.component';
import { BookItemComponent } from './book-item/book-item.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: SignUpComponent },
  { path: 'Help', component: HelpTipsComponent },
  { path: 'Cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'Books', component: BooksComponent },
  { path: 'BookItem/:id', component: BookItemComponent },
  { path: 'Equipment', component: EquipmentComponent },
  { path: 'EquipmentItem/:id', component: EquipmentItemComponent },
  { path: 'About', component: AboutUsComponent },
  { path: 'Check', component: CheckBookEstimateComponent, canActivate: [AuthGuard] },
  { path: 'Schedule', component: ScheduleBookEvalComponent, canActivate: [AuthGuard] },
  { path: 'View-Resale', component: ViewResaleDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Forgot-Password', component: ForgotPasswordComponent },
  { path: 'Change-Password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'Check-Out', component: CheckOutComponent, canActivate: [AuthGuard] },
  { path: 'Profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'Order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'Account-Info', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Delete-Account', component: DeleteAccountComponent, canActivate: [AuthGuard] },
  { path: 'Update-Account', component: UpdateAccountComponent, canActivate: [AuthGuard] },
  { path: 'PayPal', component: PayfastComponent, canActivate: [AuthGuard] },
  { path: 'confirm-email', component: EmailConfirmationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
