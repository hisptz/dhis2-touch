import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsComponentsModule } from './components/settingsComponentsModule';
@NgModule({
  declarations: [SettingsPage],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    sharedComponentsModule,
    TranslateModule,
    SettingsComponentsModule
  ]
})
export class SettingsPageModule {}
