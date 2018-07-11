import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncPage } from './sync';
import { SharedModule } from '../../components/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SyncModule } from './components/sync.module';
@NgModule({
  declarations: [SyncPage],
  imports: [
    IonicPageModule.forChild(SyncPage),
    SyncModule,
    SharedModule,
    TranslateModule.forChild({})
  ]
})
export class SyncPageModule {}
