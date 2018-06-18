import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../components/shared.module';
import { AppSettingsComponent } from './app-settings/app-settings';
import { SynchronizationSettingsComponent } from './synchronization-settings/synchronization-settings';
import { EntryFormSettingsComponent } from './entry-form-settings/entry-form-settings';
import { BarcodeSettingsComponent } from './barcode-settings/barcode-settings';

@NgModule({
  declarations: [
    AppSettingsComponent,
    SynchronizationSettingsComponent,
    EntryFormSettingsComponent,
    BarcodeSettingsComponent
  ],
  imports: [IonicModule, SharedModule, TranslateModule],
  exports: [
    AppSettingsComponent,
    SynchronizationSettingsComponent,
    EntryFormSettingsComponent,
    BarcodeSettingsComponent
  ]
})
export class SettingsComponentsModule {}
