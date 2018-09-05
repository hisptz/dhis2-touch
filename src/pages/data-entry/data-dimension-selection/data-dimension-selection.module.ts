import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataDimensionSelectionPage } from './data-dimension-selection';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DataDimensionSelectionPage],
  imports: [
    IonicPageModule.forChild(DataDimensionSelectionPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class DataDimensionSelectionPageModule {}
