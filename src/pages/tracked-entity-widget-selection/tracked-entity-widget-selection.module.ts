import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityWidgetSelectionPage } from './tracked-entity-widget-selection';
import {SharedModule} from "../../components/shared.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    TrackedEntityWidgetSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackedEntityWidgetSelectionPage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class TrackedEntityWidgetSelectionPageModule {}
