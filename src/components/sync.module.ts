import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {ClearLocalDataComponent} from "./clear-local-data/clear-local-data";
import {DownloadMetaDataComponent} from "./download-meta-data/download-meta-data";

@NgModule({
  declarations: [
    ClearLocalDataComponent, DownloadMetaDataComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    ClearLocalDataComponent, DownloadMetaDataComponent
  ]
})

export class SyncModule { }
