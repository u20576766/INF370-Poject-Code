import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'pay-pal',
    loadChildren: () => import('./pay-pal/pay-pal.module').then( m => m.PayPalPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./login/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'update-password',
    loadChildren: () => import('./profile/account-info/update-account/update-password/update-password.module').then( m => m.UpdatePasswordPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import ('./profile/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'check-book',
    loadChildren: () => import('./reseller/resell/check-book/check-book.module').then( m => m.CheckBookPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./reseller/resell/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'view-resale',
    loadChildren: () => import('./reseller/resell/view-resale/view-resale.module').then( m => m.ViewResalePageModule)
  },
  {
    path: 'email-confirm',
    loadChildren: () => import('./register/email-confirm/email-confirm.module').then( m => m.EmailConfirmPageModule)
  },
  {
    path: 'checkout-cart',
    loadChildren: () => import('./cart/checkout-cart/checkout-cart.module').then( m => m.CheckoutCartPageModule)
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./profile/delete-account/delete-account.module').then( m => m.DeleteAccountPageModule)
  },
  {
    path: 'book-item/:id',
    loadChildren: () => import('./products/book-item/book-item.module').then( m => m.BookItemPageModule)
  },
  {
    path: 'equip-item/:id',
    loadChildren: () => import('./products/equip-item/equip-item.module').then( m => m.EquipItemPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'account-info',
    loadChildren: () => import('./profile/account-info/account-info.module').then( m => m.AccountInfoPageModule)
  },
  {
    path: 'resell',
    loadChildren: () => import('./reseller/resell/resell.module').then( m => m.ResellPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./login/forgot-password/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'advanced-search',
    loadChildren: () => import('./products/advanced-search/advanced-search.module').then( m => m.AdvancedSearchPageModule)
  },
  {
    path: 'waiting',
    loadChildren: () => import('./reseller/resell/view-resale/waiting/waiting.module').then( m => m.WaitingPageModule)
  },
  {
    path: 'booked',
    loadChildren: () => import('./reseller/resell/view-resale/booked/booked.module').then( m => m.BookedPageModule)
  },
  {
    path: 'evaluated',
    loadChildren: () => import('./reseller/resell/view-resale/evaluated/evaluated.module').then( m => m.EvaluatedPageModule)
  },
  {
    path: 'placed',
    loadChildren: () => import('./profile/orders/placed/placed.module').then( m => m.PlacedPageModule)
  },
  {
    path: 'ready',
    loadChildren: () => import('./profile/orders/ready/ready.module').then( m => m.ReadyPageModule)
  },
  {
    path: 'collected',
    loadChildren: () => import('./profile/orders/collected/collected.module').then( m => m.CollectedPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
