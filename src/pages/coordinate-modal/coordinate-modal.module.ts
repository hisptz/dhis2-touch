import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoordinateModalPage } from './coordinate-modal';
import { CoordinateInputModule } from './components/coordinateInput.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CoordinateModalPage],
  imports: [
    CoordinateInputModule,
    IonicPageModule.forChild(CoordinateModalPage),
    TranslateModule.forChild({})
  ]
})
export class CoordinateModalPageModule {}
