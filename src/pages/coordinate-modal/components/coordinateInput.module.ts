import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CoordinateComponent } from './coordinate/coordinate';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
@NgModule({
  declarations: [CoordinateComponent],
  imports: [IonicModule, TranslateModule.forChild({}), sharedComponentsModule],
  exports: [CoordinateComponent]
})
export class CoordinateInputModule {}
