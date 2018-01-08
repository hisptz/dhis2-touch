import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),SharedModule,
    TranslateModule
  ],
})
export class SettingsPageModule {}
