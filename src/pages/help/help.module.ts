import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpPage } from './help';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [HelpPage],
  imports: [
    IonicPageModule.forChild(HelpPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class HelpPageModule {}
