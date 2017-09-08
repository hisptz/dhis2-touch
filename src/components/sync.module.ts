import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {ClearLocalDataComponent} from "./clear-local-data/clear-local-data";
import {DownloadMetaDataComponent} from "./download-meta-data/download-meta-data";
import {UploadDataViaSmsComponent} from "./upload-data-via-sms/upload-data-via-sms";
import {ClearLocalMetadataComponent} from "./clear-local-metadata/clear-local-metadata";
import {ReportCompComponent} from "./report-comp/report-comp";

@NgModule({
  declarations: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent, ClearLocalMetadataComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent, ClearLocalMetadataComponent
  ]
})

export class SyncModule { }
