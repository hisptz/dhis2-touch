/*
 *
 * Copyright 2019 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/sharedComponents.module';
import { SettingContainerComponent } from './setting-container/setting-container.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { BarcodeSettingsComponent } from './barcode-settings/barcode-settings.component';
import { EntryFormSettingsComponent } from './entry-form-settings/entry-form-settings.component';
import { SynchronizationSettingsComponent } from './synchronization-settings/synchronization-settings.component';

@NgModule({
  declarations: [
    SettingContainerComponent,
    AppSettingsComponent,
    BarcodeSettingsComponent,
    EntryFormSettingsComponent,
    SynchronizationSettingsComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild(),
    SharedComponentsModule
  ],
  exports: [
    SettingContainerComponent,
    AppSettingsComponent,
    BarcodeSettingsComponent,
    EntryFormSettingsComponent,
    SynchronizationSettingsComponent
  ]
})
export class SettingsComponentsModule {}
