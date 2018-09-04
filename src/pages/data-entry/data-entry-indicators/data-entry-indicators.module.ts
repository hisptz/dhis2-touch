import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryIndicatorsPage } from './data-entry-indicators';
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DataEntryIndicatorsPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryIndicatorsPage),
    TranslateModule.forChild({})
  ],
})
export class DataEntryIndicatorsPageModule {}
