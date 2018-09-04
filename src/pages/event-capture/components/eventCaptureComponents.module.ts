import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
import { ProgramStageEventBasedComponent } from './program-stage-event-based/program-stage-event-based';
import { EventInputContainerComponent } from './event-input-container/event-input-container';
import { EventDateNotificationComponent } from './event-date-notification/event-date-notification';
import { DefaultEventEntryFormComponent } from './default-event-entry-form/default-event-entry-form';
import { EventCoordinateSelectorComponent } from './event-coordinate-selector/event-coordinate-selector';
import { ProgramRuleActionMessageComponent } from './program-rule-action-message/program-rule-action-message';

@NgModule({
  declarations: [
    ProgramStageEventBasedComponent,
    EventDateNotificationComponent,
    EventInputContainerComponent,
    DefaultEventEntryFormComponent,
    EventCoordinateSelectorComponent,
    ProgramRuleActionMessageComponent
  ],
  imports: [IonicModule, sharedComponentsModule, DataEntryComponentsModule],
  exports: [
    ProgramStageEventBasedComponent,
    EventDateNotificationComponent,
    EventInputContainerComponent,
    DefaultEventEntryFormComponent,
    EventCoordinateSelectorComponent,
    ProgramRuleActionMessageComponent
  ]
})
export class EventCaptureComponentsModule {}
