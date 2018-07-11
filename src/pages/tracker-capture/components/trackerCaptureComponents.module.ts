import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { TrackerRegistrationFormComponent } from './tracker-registration-form/tracker-registration-form';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
import { DataEntryModule } from '../../../components/data.entry.module';
import { ProgramStageTrackerBasedComponent } from './program-stage-tracker-based/program-stage-tracker-based';
import { TrackerEventContainerComponent } from './tracker-event-container/tracker-event-container';
import { TrackedEntityInputsComponent } from './tracked-entity-inputs/tracked-entity-inputs';
import { EventCaptureComponentsModule } from '../../event-capture/components/eventCaptureComponents.module';
@NgModule({
  declarations: [
    TrackerRegistrationFormComponent,
    ProgramStageTrackerBasedComponent,
    TrackerEventContainerComponent,
    TrackedEntityInputsComponent
  ],
  imports: [
    IonicModule,
    SharedModule,
    DataEntryComponentsModule,
    EventCaptureComponentsModule,
    DataEntryModule
  ],
  exports: [
    TrackerRegistrationFormComponent,
    ProgramStageTrackerBasedComponent,
    TrackerEventContainerComponent,
    TrackedEntityInputsComponent
  ]
})
export class TrackerCaptureComponentsModule {}
