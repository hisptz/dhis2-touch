/*
 *
 * Copyright 2015 HISP Tanzania
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
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClearLocalDataComponent } from './clear-local-data/clear-local-data';
import { DownloadMetaDataComponent } from './download-meta-data/download-meta-data';
import { UploadDataViaSmsComponent } from './upload-data-via-sms/upload-data-via-sms';
import { ClearLocalMetadataComponent } from './clear-local-metadata/clear-local-metadata';
import { DownloadDataComponent } from './download-data/download-data';
import { DownloadDataValuesComponent } from './download-data-values/download-data-values';
import { UploadViaInternetComponent } from './upload-data-via-internet/upload-via-internet';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { loginComponentsModule } from '../../login/components/loginComponents.module';
import { AggregateDataDownloaderComponent } from './aggregate-data-downloader/aggregate-data-downloader';
import { EventDataDownloaderComponent } from './event-data-downloader/event-data-downloader';
import { TrackerDataDownloaderComponent } from './tracker-data-downloader/tracker-data-downloader';
import { EventCaptureComponentsModule } from '../../event-capture/components/eventCaptureComponents.module';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';

@NgModule({
  declarations: [
    ClearLocalDataComponent,
    DownloadMetaDataComponent,
    UploadDataViaSmsComponent,
    UploadViaInternetComponent,
    ClearLocalMetadataComponent,
    DownloadDataComponent,
    DownloadDataValuesComponent,
    AggregateDataDownloaderComponent,
    EventDataDownloaderComponent,
    TrackerDataDownloaderComponent
  ],
  imports: [
    IonicModule,
    TranslateModule.forChild({}),
    sharedComponentsModule,
    EventCaptureComponentsModule,
    DataEntryComponentsModule,
    loginComponentsModule
  ],
  exports: [
    ClearLocalDataComponent,
    DownloadMetaDataComponent,
    UploadDataViaSmsComponent,
    UploadViaInternetComponent,
    ClearLocalMetadataComponent,
    DownloadDataComponent,
    DownloadDataValuesComponent,
    AggregateDataDownloaderComponent,
    EventDataDownloaderComponent,
    TrackerDataDownloaderComponent
  ]
})
export class SyncModule {}
