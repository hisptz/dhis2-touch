import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportSummariesPage } from './import-summaries';

@NgModule({
  declarations: [
    ImportSummariesPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportSummariesPage),
  ],
})
export class ImportSummariesPageModule {}
