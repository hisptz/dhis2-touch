import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryFormCompletenessPage } from './entry-form-completeness';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    EntryFormCompletenessPage,
  ],
  imports: [
    IonicPageModule.forChild(EntryFormCompletenessPage),SharedModule
  ],
})
export class EntryFormCompletenessPageModule {}
