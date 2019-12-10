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
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Coordinate } from 'src/models';

@Entity()
export class ProgramEntity {
  @PrimaryColumn() id: string;
  @Column() displayName: string;
  @Column() programType: string;
  @Column() displayIncidentDate: string;
  @Column() withoutRegistration: boolean;
  @Column() ignoreOverdueEvents: boolean;
  @Column() skipOffline: boolean;
  @Column({ nullable: true }) captureCoordinates: boolean;
  @Column({ nullable: true }) featureType: string;
  @Column({ nullable: true }) enrollmentDateLabel: string;
  @Column() onlyEnrollOnce: boolean;
  @Column() selectIncidentDatesInFuture: boolean;
  @Column() useFirstStageDuringRegistration: boolean;
  @Column({ nullable: true }) incidentDateLabel: string;
  @Column() completeEventsExpiryDays: number;
  @Column() displayFrontPageList: boolean;
  @Column('simple-json') categoryCombo: string;
  @Column({ type: 'simple-json', nullable: true }) trackedEntity: string;
  @Column({ type: 'simple-json', nullable: true }) trackedEntityType: string;
  @Column('simple-json') attributeValues: string;
}

@Entity()
export class ProgramProgramTrackedEntityAttributeEntity {
  @PrimaryColumn() id: string;
  @Column() programId: string;
  @Column() sortOrder: number;
  @Column() mandatory: boolean;
  @Column({ nullable: true }) renderOptionsAsRadio: boolean;
  @Column({ nullable: true }) allowFutureDate: boolean;
  @Column({ nullable: true }) searchable: boolean;
  @Column() displayInList: string;
}

@Entity()
export class TrackedEntityAttributeEntity {
  @PrimaryColumn() id: string;
  @Column() programTrackedEntityAttributeId: string;
  @Column('simple-json') trackedEntityAttribute: string;
}

@Entity()
export class ProgramIndicatorEntity {
  @PrimaryColumn() id: string;
  @Column() programId: string;
  @Column() name: string;
  @Column({ nullable: true }) filter: string;
  @Column({ nullable: true, type: 'simple-json' }) description: string;
  @Column({ nullable: true, type: 'simple-json' }) expression: string;
}

@Entity()
export class ProgramProgramStageEntity {
  @PrimaryColumn() id: string;
  @Column() programId: string;
  @Column() name: string;
  @Column() sortOrder: number;
  @Column({ nullable: true }) executionDateLabel: string;
  @Column() formType: string;
  @Column() blockEntryForm: boolean;
  @Column() hideDueDate: boolean;
  @Column() repeatable: boolean;
  @Column() allowGenerateNextVisit: boolean;
  @Column() minDaysFromStart: number;
  @Column() generatedByEnrollmentDate: boolean;
  @Column() autoGenerateEvent: boolean;
  @Column({ nullable: true }) captureCoordinates: boolean;
  @Column({ nullable: true }) featureType: string;
  @Column({ nullable: true }) dueDateLabel: string;
  @Column('simple-json') programStageDataElements: string;
  @Column('simple-json') programStageSections: string;
}

@Entity()
export class ProgramStageSectionEntity {
  @PrimaryColumn() id: string;
  @Column() displayName: string;
  @Column({ nullable: true }) sortOrder: number;
  @Column() programStageId: string;
  @Column('simple-json') attributeValues: string;
  @Column('simple-json') dataElements: string;
}

@Entity()
export class ProgramOrganisationUnitEntity {
  @PrimaryColumn() id: string;
  @Column() orgUnitIds: string;
}

@Entity()
export class TrackerRegistrationFormEntity {
  @PrimaryColumn() id: string;
  @Column() dataEntryForm: string;
}

@Entity()
export class ProgramStageEntryFormEntity {
  @PrimaryColumn() id: string;
  @Column() dataEntryForm: string;
}

@Entity()
export class ProgramTrackedEntityAttributeEntity {
  @PrimaryColumn() id: string;
  @Column() programId: string;
  @Column() sortOrder: number;
  @Column() displayInList: boolean;
  @Column() mandatory: boolean;
}

@Entity()
export class TrackedEntityInstanceEntity {
  @PrimaryColumn() id: string;
  @Column() trackedEntity: string;
  @Column() orgUnit: string;
  @Column() orgUnitName: string;
  @Column() trackedEntityInstance: string;
  @Column() deleted: boolean;
  @Column() inactive: boolean;
  @Column('simple-json') enrollments: string;
  @Column('simple-json') relationships: string;
  @Column() syncStatus: string;
}

@Entity()
export class TrackedEntityAttributeValueEntity {
  @PrimaryColumn() id: string;
  @Column() trackedEntityInstance: string;
  @Column() attribute: string;
  @Column() value: string;
}

@Entity()
export class EnrollmentEntity {
  @PrimaryColumn() id: string;
  @Column() trackedEntity: string;
  @Column() orgUnit: string;
  @Column() program: string;
  @Column() enrollment: string;
  @Column() trackedEntityInstance: string;
  @Column() enrollmentDate: string;
  @Column() incidentDate: string;
  @Column() status: string;
  @Column('simple-json') coordinate: Coordinate;
  @Column('simple-json') attributes: string;
  @Column('simple-json') events: string;
  @Column() syncStatus: string;
}
