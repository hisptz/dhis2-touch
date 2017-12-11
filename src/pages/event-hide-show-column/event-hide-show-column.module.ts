import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventHideShowColumnPage } from './event-hide-show-column';
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    EventHideShowColumnPage,
  ],
  imports: [
    IonicPageModule.forChild(EventHideShowColumnPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class EventHideShowColumnPageModule {}
