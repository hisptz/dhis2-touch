import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
import { ProgramStageEventBasedComponent } from './program-stage-event-based/program-stage-event-based';
import { EventInputContainerComponent } from './event-input-container/event-input-container';
import { EventDateNotificationComponent } from './event-date-notification/event-date-notification';
import { DefaultEventEntryFormComponent } from './default-event-entry-form/default-event-entry-form';
import { EventCoordinateSelectorComponent } from './event-coordinate-selector/event-coordinate-selector';
import { ProgramRuleActionMessageComponent } from './program-rule-action-message/program-rule-action-message';
import { EventConflictHandlerComponent } from './event-conflict-handler/event-conflict-handler';

@NgModule({
  declarations: [
    ProgramStageEventBasedComponent,
    EventDateNotificationComponent,
    EventInputContainerComponent,
    DefaultEventEntryFormComponent,
    EventCoordinateSelectorComponent,
    ProgramRuleActionMessageComponent,
    EventConflictHandlerComponent
  ],
  imports: [
    IonicModule,
    sharedComponentsModule,
    DataEntryComponentsModule,
    TranslateModule.forChild({})
  ],
  exports: [
    ProgramStageEventBasedComponent,
    EventDateNotificationComponent,
    EventInputContainerComponent,
    DefaultEventEntryFormComponent,
    EventCoordinateSelectorComponent,
    ProgramRuleActionMessageComponent,
    EventConflictHandlerComponent
  ]
})
export class EventCaptureComponentsModule {}
