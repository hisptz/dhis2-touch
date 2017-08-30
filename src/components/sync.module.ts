import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {ClearLocalDataComponent} from "./clear-local-data/clear-local-data";
import {DownloadMetaDataComponent} from "./download-meta-data/download-meta-data";
import {UploadDataViaSmsComponent} from "./upload-data-via-sms/upload-data-via-sms";

@NgModule({
  declarations: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent
  ]
})

export class SyncModule { }
