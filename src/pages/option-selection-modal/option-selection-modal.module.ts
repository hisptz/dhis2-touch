import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptionSelectionModalPage } from './option-selection-modal';

@NgModule({
  declarations: [
    OptionSelectionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OptionSelectionModalPage),
  ],
})
export class OptionSelectionModalPageModule {}
