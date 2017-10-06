import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {EventView} from "./event-view";

@NgModule({
  declarations: [
    EventView,
  ],
  imports: [
    IonicPageModule.forChild(EventView),SharedModule
  ],
})
export class EventViewModule {}
