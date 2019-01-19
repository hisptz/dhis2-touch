/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
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
