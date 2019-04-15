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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgramRulesProvider } from '../../../../providers/program-rules/program-rules';
import { AppProvider } from '../../../../providers/app/app';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { TrackedEntityAttributeValuesProvider } from '../../../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values';
import { TrackerCaptureProvider } from '../../../../providers/tracker-capture/tracker-capture';
import { EnrollmentsProvider } from '../../../../providers/enrollments/enrollments';

@Component({
  selector: 'profile-enrollment-form',
  templateUrl: 'profile-enrollment-form.html'
})
export class ProfileEnrollmentFormComponent implements OnInit {
  @Input() currentProgram;
  @Input() currentOrganisationUnit;
  @Input() enrollmentDate;
  @Input() incidentDate;
  @Input() coordinate;

  @Input() formLayout: string;
  @Input() dataObject;
  @Input() currentUser;
  @Input() trackedEntityAttributesSavingStatusClass;
  @Input() trackerRegistrationForm: string;
  @Input() programTrackedEntityAttributes;
  @Input() dataUpdateStatus: { [elementId: string]: string };
  @Input() programSkipLogicMetadata: any;
  @Input() trackedEntityInstance: string;
  @Input() isTrackedEntityRegistered: boolean;

  @Output() deleteTrackedEntityInstance = new EventEmitter();
  @Output() addNewTrackedEntityInstance = new EventEmitter();
  @Output() updateEnrollment = new EventEmitter();
  @Output() goBackEvent = new EventEmitter();

  addNewIcon: string;
  isEnrollmentDetailsReady: boolean;
  hiddenFields: any;
  hiddenSections: any;
  errorOrWarningMessage: any;
  hiddenProgramStages: any;

  private _dataUpdateStatus$: BehaviorSubject<{
    [elementId: string]: string;
  }> = new BehaviorSubject<{ [elementId: string]: string }>({});
  dataUpdateStatus$: Observable<{ [elementId: string]: string }>;

  constructor(
    private programRulesProvider: ProgramRulesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
    private appProvider: AppProvider
  ) {
    this.hiddenFields = {};
    this.hiddenProgramStages = {};
    this.errorOrWarningMessage = {};
    this.hiddenSections = {};
    this.isEnrollmentDetailsReady = false;
    this.addNewIcon = 'assets/icon/add-new-case.png';
    this.dataUpdateStatus$ = this._dataUpdateStatus$.asObservable();
  }

  ngOnInit() {
    if (this.dataObject && Object.keys(this.dataObject).length > 0) {
      setTimeout(() => {
        this.evaluatingProgramRules();
      }, 50);
    }
  }

  goBack() {
    this.goBackEvent.emit({ status: true });
  }

  evaluatingProgramRules() {
    this.programRulesProvider
      .getProgramRulesEvaluations(
        this.programSkipLogicMetadata,
        this.dataObject
      )
      .subscribe(
        ressponse => {
          const { data } = ressponse;
          if (data) {
            const { hiddenSections } = data;
            const { hiddenFields } = data;
            const { hiddenProgramStages } = data;
            const { errorOrWarningMessage } = data;
            const { assignedFields } = data;
            if (hiddenFields) {
              this.hiddenFields = hiddenFields;
              Object.keys(hiddenFields).map(key => {
                const id = key + '-trackedEntityAttribute';
                this.trackedEntityAttributesSavingStatusClass[id] =
                  'input-field-container';
                this.onUpdateAttributesValue(
                  { id: id, value: '' },
                  true,
                  false
                );
              });
            }
            if (hiddenSections) {
              this.hiddenSections = hiddenSections;
            }
            if (hiddenProgramStages) {
              this.hiddenProgramStages = hiddenProgramStages;
            }
            if (errorOrWarningMessage) {
              this.errorOrWarningMessage = errorOrWarningMessage;
              Object.keys(errorOrWarningMessage).map(key => {
                const id = key + '-trackedEntityAttribute';
                const message = errorOrWarningMessage[key];
                const { messageType } = message;
                if (messageType === 'error') {
                  this.hiddenFields[key] = true;
                  this.trackedEntityAttributesSavingStatusClass[id] =
                    'input-field-container';
                  this.onUpdateAttributesValue(
                    { id: id, value: '' },
                    true,
                    false
                  );
                  setTimeout(() => {
                    delete this.hiddenFields[key];
                  }, 10);
                }
              });
            }
            if (assignedFields) {
              Object.keys(assignedFields).map(key => {
                const id = key + '-trackedEntityAttribute';
                const value = assignedFields[key];
                this.hiddenFields[key] = true;
                this.trackedEntityAttributesSavingStatusClass[id] =
                  'input-field-container';
                this.onUpdateAttributesValue({ id: id, value }, true, false);
                setTimeout(() => {
                  delete this.hiddenFields[key];
                }, 10);
              });
            }
          }
        },
        error => {
          console.log(
            'Error evaluate program rules : ' + JSON.stringify(error)
          );
        }
      );
  }

  addNewTrackedEntity() {
    this.addNewTrackedEntityInstance.emit({
      status: true,
      isTrackedEntityRegistered: this.isTrackedEntityRegistered
    });
  }

  onUpdateEnrollmentDeatils(data) {
    const {
      enrollmentDate,
      incidentDate,
      coordinate,
      isEnrollmentDetailsReady
    } = data;
    this.isEnrollmentDetailsReady = isEnrollmentDetailsReady;
    this.enrollmentDate = enrollmentDate;
    this.coordinate = coordinate;
    this.incidentDate = incidentDate;
    if (isEnrollmentDetailsReady) {
      this.onUpdateAttributesValue('', false, true);
    }
  }

  onUpdateAttributesValue(
    data: any,
    shouldSkipProgramRules: boolean = false,
    shoulOnlyCheckDates: boolean = false
  ) {
    if (!shoulOnlyCheckDates) {
      const { id, value } = data;
      const hasNoOldValue =
        this.dataObject && this.dataObject[id] ? false : true;
      const oldValue = !hasNoOldValue ? this.dataObject[id].value : value;
      if (oldValue !== value || hasNoOldValue) {
        this.dataObject[id] = data;
      }
    }
    if (!shouldSkipProgramRules) {
      this.evaluatingProgramRules();
    }
    const trackedEntityAttributeValuesObject = {};
    Object.keys(this.dataObject).map(key => {
      const id = key.split('-')[0];
      const { value } = this.dataObject[key];
      if (value) {
        trackedEntityAttributeValuesObject[id] = value;
      }
    });
    const isFormReady = this.isALlRequiredFieldHasValue(
      this.programTrackedEntityAttributes,
      trackedEntityAttributeValuesObject
    );
    if (isFormReady) {
      const { id } = data;
      const currentTrackedEntityId = id ? id : 'currentTrackedEntityId';
      this.updateOrRegisterTrackedEntity(
        trackedEntityAttributeValuesObject,
        currentTrackedEntityId
      );
    }
  }

  onDeleteTrackedEntityInstance(data: any) {
    const { status } = data;
    if (!status) {
      data = {
        ...{},
        status: true,
        title: `Are you sure you wan to delete this tracked entity instance`
      };
    }
    data = {
      ...data,
      trackedEntityInstance: this.trackedEntityInstance,
      isTrackedEntityRegistered: this.isTrackedEntityRegistered
    };
    this.deleteTrackedEntityInstance.emit(data);
  }

  updateOrRegisterTrackedEntity(
    trackedEntityAttributeValuesObject: any,
    currentTrackedEntityId: string
  ) {
    const trackedEntityAttributeValues = _.map(
      Object.keys(trackedEntityAttributeValuesObject),
      key => {
        return {
          value: trackedEntityAttributeValuesObject[key],
          attribute: key
        };
      }
    );
    if (this.isTrackedEntityRegistered) {
      this.trackedEntityAttributeValuesProvider
        .savingTrackedEntityAttributeValues(
          this.trackedEntityInstance,
          trackedEntityAttributeValues,
          this.currentUser
        )
        .subscribe(
          () => {
            this.trackedEntityAttributesSavingStatusClass[
              currentTrackedEntityId
            ] = 'input-field-container-success';
            // Update status for custom form
            const dataUpdateStatus = {};
            _.each(_.keys(this.dataObject), dataObjectId => {
              dataUpdateStatus[dataObjectId + '-val'] = 'OK';
            });
            this._dataUpdateStatus$.next(dataUpdateStatus);
            this.enrollmentsProvider
              .updateEnrollement(
                this.trackedEntityInstance,
                this.incidentDate,
                this.enrollmentDate,
                this.coordinate,
                this.currentProgram.id,
                this.currentOrganisationUnit.id,
                this.currentUser
              )
              .subscribe(() => {}, () => {});
          },
          error => {
            this.trackedEntityAttributesSavingStatusClass[
              currentTrackedEntityId
            ] = 'input-field-container-failed';
            console.log(JSON.stringify(error));
            // Update status for custom form
            const dataUpdateStatus = {};
            _.each(_.keys(this.dataObject), dataObjectId => {
              dataUpdateStatus[dataObjectId + '-val'] = 'ERROR';
            });
            this._dataUpdateStatus$.next(dataUpdateStatus);
          }
        );
    } else {
      this.trackerCaptureProvider
        .saveTrackedEntityRegistration(
          this.incidentDate,
          this.enrollmentDate,
          this.currentUser,
          this.trackedEntityInstance,
          this.coordinate
        )
        .subscribe(
          () => {
            this.appProvider.setNormalNotification(
              'A tracked entity instance has been saved successfully'
            );
            this.isTrackedEntityRegistered = true;
            Object.keys(trackedEntityAttributeValuesObject).forEach(key => {
              this.trackedEntityAttributesSavingStatusClass[
                key + '-trackedEntityAttribute'
              ] = 'input-field-container-success';
            });
            // Update status for custom form
            const dataUpdateStatus = {};
            _.each(_.keys(this.dataObject), dataObjectId => {
              dataUpdateStatus[dataObjectId + '-val'] = 'OK';
            });
            this._dataUpdateStatus$.next(dataUpdateStatus);
            this.updateOrRegisterTrackedEntity(
              trackedEntityAttributeValuesObject,
              currentTrackedEntityId
            );
          },
          error => {
            Object.keys(trackedEntityAttributeValuesObject).forEach(key => {
              this.trackedEntityAttributesSavingStatusClass[
                key + '-trackedEntityAttribute'
              ] = 'input-field-container-failed';
            });
            this.appProvider.setNormalNotification(
              'Failed to save a tracked entity instance'
            );
            console.log(JSON.stringify(error));
            // Update status for custom form
            const dataUpdateStatus = {};
            _.each(_.keys(this.dataObject), dataObjectId => {
              dataUpdateStatus[dataObjectId + '-val'] = 'OK';
            });
            this._dataUpdateStatus$.next(dataUpdateStatus);
          }
        );
    }
  }

  isALlRequiredFieldHasValue(
    programTrackedEntityAttributes,
    trackedEntityAttributeValuesObject
  ) {
    let result = Object.keys(trackedEntityAttributeValuesObject).length > 0;
    programTrackedEntityAttributes.map((programTrackedEntityAttribute: any) => {
      const {
        mandatory,
        trackedEntityAttribute
      } = programTrackedEntityAttribute;
      if (mandatory && trackedEntityAttribute && trackedEntityAttribute.id) {
        if (!trackedEntityAttributeValuesObject[trackedEntityAttribute.id]) {
          result = false;
        }
      }
    });
    if (result) {
      const { displayIncidentDate } = this.currentProgram;
      if (this.enrollmentDate === '') {
        this.appProvider.setNormalNotification(
          this.currentProgram.enrollmentDateLabel + ' is mandatory field'
        );
        result = false;
      }
      if (result && displayIncidentDate && this.enrollmentDate !== '') {
        if (this.incidentDate === '') {
          this.appProvider.setNormalNotification(
            this.currentProgram.incidentDateLabel + ' is mandatory field'
          );
          result = false;
        }
      }
    }
    return result;
  }
}
