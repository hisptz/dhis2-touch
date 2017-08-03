import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppsPage } from './apps';

@NgModule({
  declarations: [
    AppsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppsPage),
  ],
  exports: [
    AppsPage
  ]
})
export class AppsPageModule {}
