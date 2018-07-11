import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CoordinateComponent } from './coordinate/coordinate';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../components/shared.module';
@NgModule({
  declarations: [CoordinateComponent],
  imports: [IonicModule, TranslateModule.forChild({}), SharedModule],
  exports: [CoordinateComponent]
})
export class CoordinateInputModule {}
