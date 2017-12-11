import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerHideShowColumnPage } from './tracker-hide-show-column';
import {SharedModule} from "../../components/shared.module";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Http} from "@angular/http";

@NgModule({
  declarations: [
    TrackerHideShowColumnPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackerHideShowColumnPage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class TrackerHideShowColumnPageModule {}
