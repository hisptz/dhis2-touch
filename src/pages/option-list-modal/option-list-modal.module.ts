import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptionListModalPage } from './option-list-modal';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../components/sharedComponents.module';

@NgModule({
  declarations: [OptionListModalPage],
  imports: [
    IonicPageModule.forChild(OptionListModalPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class OptionListModalPageModule {}
