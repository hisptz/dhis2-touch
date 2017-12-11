import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountsPage } from './accounts';
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    AccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountsPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  exports: [
    AccountsPage
  ]
})
export class AccountsPageModule {}
