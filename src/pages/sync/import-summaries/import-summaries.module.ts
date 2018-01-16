import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportSummariesPage } from './import-summaries';
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    ImportSummariesPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportSummariesPage),
    TranslateModule.forChild({})
  ],
})
export class ImportSummariesPageModule {}
