import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { ProgramSelection } from './program-selection';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProgramSelection],
  imports: [
    IonicPageModule.forChild(ProgramSelection),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class ProgramPageModule {}
