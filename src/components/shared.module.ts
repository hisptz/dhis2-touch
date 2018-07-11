import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { LoadingComponent } from './loading/loading';
import { NotificationComponent } from './notification/notification';
import { EmptyListNotificationComponent } from './empty-list-notification/empty-list-notification';
import { HelpContentsComponent } from './help-contents/help-contents';
import { WarningComponent } from './warning/warning';
import { AvailableLocalInstanceComponent } from './available-local-instance/available-local-instance';
import { ProgressLoaderComponent } from './progress-loader/progress-loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageTranslationSelectionComponent } from './language-translation-selection/language-translation-selection';
import { MultiOrganisationUnitComponent } from './multi-organisation-unit/multi-organisation-unit';
import { MultiOrganisationUnitTreeComponent } from './multi-organisation-unit-tree/multi-organisation-unit-tree';
@NgModule({
  declarations: [
    ProgressBarComponent,
    MultiOrganisationUnitComponent,
    MultiOrganisationUnitTreeComponent,
    ProgressLoaderComponent,
    LoadingComponent,
    NotificationComponent,
    EmptyListNotificationComponent,
    HelpContentsComponent,
    WarningComponent,
    AvailableLocalInstanceComponent,
    LanguageTranslationSelectionComponent
  ],
  imports: [IonicModule, TranslateModule.forChild()],
  exports: [
    ProgressBarComponent,
    MultiOrganisationUnitComponent,
    MultiOrganisationUnitTreeComponent,
    ProgressLoaderComponent,
    LoadingComponent,
    NotificationComponent,
    EmptyListNotificationComponent,
    HelpContentsComponent,
    WarningComponent,
    AvailableLocalInstanceComponent,
    LanguageTranslationSelectionComponent
  ]
})
export class SharedModule {}
