import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
import { DataEntryModule } from '../../../components/data.entry.module';
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
  imports: [
    IonicModule,
    SharedModule,
    DataEntryComponentsModule,
    DataEntryModule
  ],
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
