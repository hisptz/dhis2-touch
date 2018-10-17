import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSetSelectionPage } from './data-set-selection';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DataSetSelectionPage],
  imports: [
    IonicPageModule.forChild(DataSetSelectionPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class DataSetSelectionPageModule {}
