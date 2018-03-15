import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptionListModalPage } from './option-list-modal';

@NgModule({
  declarations: [
    OptionListModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OptionListModalPage),
  ],
})
export class OptionListModalPageModule {}
