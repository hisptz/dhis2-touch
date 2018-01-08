import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventHideShowColumnPage } from './event-hide-show-column';
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    EventHideShowColumnPage,
  ],
  imports: [
    IonicPageModule.forChild(EventHideShowColumnPage),
    TranslateModule.forChild({})
  ],
})
export class EventHideShowColumnPageModule {}
