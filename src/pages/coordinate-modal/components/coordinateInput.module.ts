import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CoordinateComponent } from './coordinate/coordinate';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [CoordinateComponent],
  imports: [IonicModule, TranslateModule.forChild({})],
  exports: [CoordinateComponent]
})
export class CoordinateInputModule {}
