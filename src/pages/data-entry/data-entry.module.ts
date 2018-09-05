import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryPage } from './data-entry';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DataEntryPage],
  imports: [
    IonicPageModule.forChild(DataEntryPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class DataEntryPageModule {}
