import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryFormCompletenessPage } from './entry-form-completeness';
import {SharedModule} from "../../components/shared.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    EntryFormCompletenessPage,
  ],
  imports: [
    IonicPageModule.forChild(EntryFormCompletenessPage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class EntryFormCompletenessPageModule {}
