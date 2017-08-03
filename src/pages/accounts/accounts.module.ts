import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountsPage } from './accounts';

@NgModule({
  declarations: [
    AccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountsPage),
  ],
  exports: [
    AccountsPage
  ]
})
export class AccountsPageModule {}
