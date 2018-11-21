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

@NgModule({
  declarations: [
    ClearLocalDataComponent,
    DownloadMetaDataComponent,
    UploadDataViaSmsComponent,
    UploadViaInternetComponent,
    ClearLocalMetadataComponent,
    DownloadDataComponent,
    DownloadDataValuesComponent
  ],
  imports: [
    IonicModule,
    TranslateModule.forChild({}),
    sharedComponentsModule,
    loginComponentsModule
  ],
  exports: [
    ClearLocalDataComponent,
    DownloadMetaDataComponent,
    UploadDataViaSmsComponent,
    UploadViaInternetComponent,
    ClearLocalMetadataComponent,
    DownloadDataComponent,
    DownloadDataValuesComponent
  ]
})
export class SyncModule {}
