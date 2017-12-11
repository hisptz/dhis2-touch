import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {ClearLocalDataComponent} from "./clear-local-data/clear-local-data";
import {DownloadMetaDataComponent} from "./download-meta-data/download-meta-data";
import {UploadDataViaSmsComponent} from "./upload-data-via-sms/upload-data-via-sms";
import {ClearLocalMetadataComponent} from "./clear-local-metadata/clear-local-metadata";
import {DownloadDataComponent} from "./download-data/download-data";
import {DownloadDataValuesComponent} from "./download-data-values/download-data-values";
import {UploadViaInternetComponent} from "./upload-data-via-internet/upload-via-internet";
import {Http} from "@angular/http";
import {createTranslateLoader} from "../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent,UploadViaInternetComponent,
    ClearLocalMetadataComponent,DownloadDataComponent, DownloadDataValuesComponent,
  ],
  imports: [
    IonicModule,SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      },
      isolate: true
    }),
  ],
  exports: [
    ClearLocalDataComponent, DownloadMetaDataComponent, UploadDataViaSmsComponent,UploadViaInternetComponent,
    ClearLocalMetadataComponent,DownloadDataComponent, DownloadDataValuesComponent,
  ]
})

export class SyncModule { }
