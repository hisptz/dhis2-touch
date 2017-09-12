import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {ClearLocalDataComponent} from "./clear-local-data/clear-local-data";
import {DownloadMetaDataComponent} from "./download-meta-data/download-meta-data";
import {UploadDataViaSmsComponent} from "./upload-data-via-sms/upload-data-via-sms";
import {ClearLocalMetadataComponent} from "./clear-local-metadata/clear-local-metadata";
import {DownloadDataComponent} from "./download-data/download-data";
import {DownloadDataValuesComponent} from "./download-data-values/download-data-values";
import {DownloadEventsDataComponent} from "./download-events-data/download-events";

@NgModule({
  declarations: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent,
    ClearLocalMetadataComponent,DownloadDataComponent, DownloadDataValuesComponent, DownloadEventsDataComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent,
    ClearLocalMetadataComponent,DownloadDataComponent, DownloadDataValuesComponent, DownloadEventsDataComponent
  ]
})

export class SyncModule { }
