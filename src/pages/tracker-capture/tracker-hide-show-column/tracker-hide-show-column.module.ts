import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerHideShowColumnPage } from './tracker-hide-show-column';
import {SharedModule} from "../../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    TrackerHideShowColumnPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackerHideShowColumnPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class TrackerHideShowColumnPageModule {}
