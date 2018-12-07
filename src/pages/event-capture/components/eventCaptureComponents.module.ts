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
