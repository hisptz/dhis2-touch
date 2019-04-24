import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidationRulesResultsPage } from './validation-rules-results';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ValidationRulesResultsPage],
  imports: [
    IonicPageModule.forChild(ValidationRulesResultsPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class ValidationRulesResultsPageModule {}
