import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerHideShowColumnPage } from './tracker-hide-show-column';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    TrackerHideShowColumnPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackerHideShowColumnPage),SharedModule
  ],
})
export class TrackerHideShowColumnPageModule {}
