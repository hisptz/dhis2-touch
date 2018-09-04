import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryFormCompletenessPage } from './entry-form-completeness';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [EntryFormCompletenessPage],
  imports: [
    IonicPageModule.forChild(EntryFormCompletenessPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class EntryFormCompletenessPageModule {}
