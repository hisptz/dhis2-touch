import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncPage } from './sync';
import {SyncModule} from "../../components/sync.module";

@NgModule({
  declarations: [
    SyncPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncPage),SyncModule
  ],
})
export class SyncPageModule {}
