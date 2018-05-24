import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HideAndShowColumnsPage } from './hide-and-show-columns';

@NgModule({
  declarations: [
    HideAndShowColumnsPage,
  ],
  imports: [
    IonicPageModule.forChild(HideAndShowColumnsPage),
  ],
})
export class HideAndShowColumnsPageModule {}
