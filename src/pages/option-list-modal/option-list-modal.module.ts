import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptionListModalPage } from './option-list-modal';
import { SharedModule } from '../../components/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OptionListModalPage],
  imports: [
    IonicPageModule.forChild(OptionListModalPage),
    SharedModule,
    TranslateModule.forChild({})
  ]
})
export class OptionListModalPageModule {}
