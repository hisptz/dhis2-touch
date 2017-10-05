import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerEntityRegisterPage } from './tracker-entity-register';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    TrackerEntityRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackerEntityRegisterPage),SharedModule,DataEntryModule,
  ],
})
export class TrackerEntityRegisterPageModule {}
