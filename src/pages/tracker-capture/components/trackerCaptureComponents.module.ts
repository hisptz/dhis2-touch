import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TrackerRegistrationFormComponent } from './tracker-registration-form/tracker-registration-form';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
import { ProgramStageTrackerBasedComponent } from './program-stage-tracker-based/program-stage-tracker-based';
import { TrackerEventContainerComponent } from './tracker-event-container/tracker-event-container';
import { TrackedEntityInputsComponent } from './tracked-entity-inputs/tracked-entity-inputs';
import { EventCaptureComponentsModule } from '../../event-capture/components/eventCaptureComponents.module';
import { TrackerConflictHandlerComponent } from './tracker-conflict-handler/tracker-conflict-handler';
@NgModule({
  declarations: [
    TrackerRegistrationFormComponent,
    ProgramStageTrackerBasedComponent,
    TrackerEventContainerComponent,
    TrackedEntityInputsComponent,
    TrackerConflictHandlerComponent
  ],
  imports: [
    IonicModule,
    sharedComponentsModule,
    DataEntryComponentsModule,
    EventCaptureComponentsModule
  ],
  exports: [
    TrackerRegistrationFormComponent,
    ProgramStageTrackerBasedComponent,
    TrackerEventContainerComponent,
    TrackedEntityInputsComponent,
    TrackerConflictHandlerComponent
  ]
})
export class TrackerCaptureComponentsModule {}
