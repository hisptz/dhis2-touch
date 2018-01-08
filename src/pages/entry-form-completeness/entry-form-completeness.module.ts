import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryFormCompletenessPage } from './entry-form-completeness';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    EntryFormCompletenessPage,
  ],
  imports: [
    IonicPageModule.forChild(EntryFormCompletenessPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class EntryFormCompletenessPageModule {}
