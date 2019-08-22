/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Coordinate } from 'src/models';

export interface Program {
  id: string;
  displayName: string;
  programType: string;
  displayIncidentDate: string;
  withoutRegistration: boolean;
  ignoreOverdueEvents: boolean;
  skipOffline: boolean;
  captureCoordinates?: boolean;
  featureType?: string;
  enrollmentDateLabel: string;
  onlyEnrollOnce: boolean;
  selectIncidentDatesInFuture: boolean;
  useFirstStageDuringRegistration: boolean;
  incidentDateLabel: string;
  completeEventsExpiryDays: number;
  displayFrontPageList: boolean;
  categoryCombo: any;
  trackedEntity?: any;
  trackedEntityType?: any;
  attributeValues?: any;
}

export interface ProgramProgramTrackedEntityAttribute {
  id: string;
  programId: string;
  sortOrder: number;
  mandatory: boolean;
  renderOptionsAsRadio: boolean;
  allowFutureDate: boolean;
  searchable: boolean;
  displayInList: string;
}

export interface TrackedEntityAttribute {
  id: string;
  programTrackedEntityAttributeId: string;
  trackedEntityAttribute: any;
}

export interface ProgramIndicator {
  id: string;
  programId: string;
  name: string;
  filter: string;
  description: string;
  expression: string;
}

export interface ProgramProgramStage {
  id: string;
  programId: string;
  name: string;
  sortOrder: number;
  executionDateLabel: string;
  formType: string;
  blockEntryForm: boolean;
  hideDueDate: boolean;
  repeatable: boolean;
  allowGenerateNextVisit: boolean;
  minDaysFromStart: number;
  generatedByEnrollmentDate: boolean;
  autoGenerateEvent: boolean;
  captureCoordinates?: boolean;
  featureType?: string;
  dueDateLabel?: string;
  programStageDataElements: any;
  programStageSections: any;
}

export interface ProgramStageSection {
  id: string;
  displayName: string;
  sortOrder: number;
  programStageId: string;
  attributeValues: any;
  dataElements: any;
}

export interface ProgramOrganisationUnit {
  id: string;
  orgUnitIds: string[];
}
export interface TrackerRegistrationForm {
  id: string;
  dataEntryForm: string;
}

export interface ProgramStageEntryForm {
  id: string;
  dataEntryForm: string;
}

export interface ProgramTrackedEntityAttribute {
  id: string;
  programId: string;
  sortOrder: number;
  displayInList: boolean;
  mandatory: boolean;
}

export interface TrackedEntityInstance {
  id: string;
  trackedEntity: string;
  orgUnit: string;
  orgUnitName: string;
  trackedEntityInstance: string;
  deleted: boolean;
  inactive: boolean;
  enrollments: any;
  relationships: any;
  syncStatus: string;
}

export interface TrackedEntityAttributeValue {
  id: string;
  trackedEntityInstance: string;
  attribute: string;
  value: string;
}

export interface Enrollment {
  id: string;
  trackedEntity: string;
  orgUnit: string;
  program: string;
  enrollment: string;
  trackedEntityInstance: string;
  enrollmentDate: string;
  incidentDate: string;
  status: string;
  coordinate: Coordinate;
  attributes: any;
  events: any;
  syncStatus: string;
}
