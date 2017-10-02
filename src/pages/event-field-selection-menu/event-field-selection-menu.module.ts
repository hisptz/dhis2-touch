import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {EventFieldSelectionMenu} from "./event-field-selection-menu";

@NgModule({
  declarations: [
    EventFieldSelectionMenu,
  ],
  imports: [
    IonicPageModule.forChild(EventFieldSelectionMenu),SharedModule
  ],
})
export class EventFieldSelectionMenuPageModule {}
