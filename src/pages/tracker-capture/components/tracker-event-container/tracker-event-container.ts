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
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { CurrentUser } from '../../../../models/current-user';
import { ProgramRulesProvider } from '../../../../providers/program-rules/program-rules';

@Component({
  selector: 'tracker-event-container',
  templateUrl: 'tracker-event-container.html'
})
export class TrackerEventContainerComponent implements OnInit, OnDestroy {
  @Input() formLayout: string;
  @Input() dataObject: any;
  @Input() programSkipLogicMetadata: any;
  @Input() dataValuesSavingStatusClass: any;
  @Input() programStage: any;
  @Input() currentOpenEvent: any;
  @Input() currentUser: CurrentUser;
  @Input() isDeletable: boolean;
  @Input() isEventCompleted: boolean;

  @Output() deleteEvent = new EventEmitter();
  @Output() updateDeleteStatus = new EventEmitter();
  @Output() dataValueChange = new EventEmitter();

  entryFormType: string;
  dataUpdateStatus: { [elementId: string]: string };
  hiddenSections: any;
  hiddenProgramStages: any;
  hiddenFields: any;
  errorOrWarningMessage: any;

  dueDateLabel: string;
  executionDateLabel: string;
  captureCoordinates: boolean;
  hideDueDate: boolean;

  constructor(
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private programRulesProvider: ProgramRulesProvider
  ) {
    this.dueDateLabel = 'Due date';
    this.executionDateLabel = 'Report Date';
    this.hiddenFields = {};
    this.hiddenProgramStages = {};
    this.hiddenSections = {};
    this.errorOrWarningMessage = {};
    this.entryFormType = 'event';
  }

  ngOnInit() {
    if (this.programStage) {
      const {
        captureCoordinates,
        dueDateLabel,
        executionDateLabel,
        hideDueDate
      } = this.programStage;
      this.hideDueDate = hideDueDate;
      this.captureCoordinates = captureCoordinates;
      this.dueDateLabel =
        dueDateLabel && isNaN(dueDateLabel) && dueDateLabel !== ''
          ? dueDateLabel
          : this.dueDateLabel;
      this.executionDateLabel =
        executionDateLabel &&
        isNaN(executionDateLabel) &&
        executionDateLabel !== ''
          ? executionDateLabel
          : this.executionDateLabel;
      const { dataValues } = this.currentOpenEvent;
      if (dataValues && dataValues.length > 0) {
        this.updateDeleteStatus.emit({ status: true });
        setTimeout(() => {
          this.evaluatingProgramRules();
        }, 50);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['currentOpenEvent'] &&
      !changes['currentOpenEvent'].firstChange
    ) {
      const { previousValue, currentValue } = changes.currentOpenEvent;
      console.log({ previousValue, currentValue, changes });
    }
  }

  getEventDateNotification() {
    return `Select ${this.executionDateLabel} above to start data entry`;
  }

  ngOnDestroy() {
    this.programStage = null;
    this.currentOpenEvent = null;
  }

  evaluatingProgramRules() {
    this.programRulesProvider
      .getProgramRulesEvaluations(
        this.programSkipLogicMetadata,
        this.dataObject
      )
      .subscribe(
        (res: any) => {
          const { data } = res;
          if (data) {
            const {
              hiddenSections,
              assignedFields,
              hiddenFields,
              hiddenProgramStages,
              errorOrWarningMessage
            } = data;
            if (errorOrWarningMessage) {
              this.errorOrWarningMessage = errorOrWarningMessage;
            }
            if (hiddenFields) {
              this.hiddenFields = hiddenFields;
              Object.keys(hiddenFields).map(key => {
                const id = key + '-dataElement';
                this.dataValuesSavingStatusClass[id] = 'input-field-container';
                this.updateData({ id: id, value: '' }, true);
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
                const id = key + '-dataElement';
                const message = errorOrWarningMessage[key];
                const { messageType } = message;
                if (messageType === 'error') {
                  this.hiddenFields[key] = true;
                  this.dataValuesSavingStatusClass[id] =
                    'input-field-container';
                  this.updateData({ id: id, value: '' }, true);
                  setTimeout(() => {
                    delete this.hiddenFields[key];
                  }, 10);
                }
              });
            }
            if (assignedFields) {
              Object.keys(assignedFields).map(key => {
                const id = key + '-dataElement';
                const value = assignedFields[key];
                this.hiddenFields[key] = true;
                this.dataValuesSavingStatusClass[id] = 'input-field-container';
                this.updateData({ id: id, value }, true);
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

  updateEventDate(date: string, eventDateType: string) {
    if (date && date !== '') {
      this.currentOpenEvent[eventDateType] = date;
      this.currentOpenEvent.syncStatus = 'not-synced';
      if (this.isDeletable) {
        this.updateData({}, false);
      }
    } else {
      if (this.isDeletable) {
        const data = {
          title: `Clearing of ${this.executionDateLabel} lead to deletion of this event, Are you sure?`
        };
        if (eventDateType === 'eventDate') {
          this.deleteEvent.emit(data);
        } else {
          this.currentOpenEvent[eventDateType] = date;
        }
      } else {
        this.currentOpenEvent[eventDateType] = date;
      }
    }
  }

  updateEventCoordonate(coordinate: any) {
    this.currentOpenEvent.coordinate = coordinate;
    this.updateData({}, false);
  }

  updateData(updatedData: any, shouldSkipProgramRules: boolean) {
    const dataValues = [];
    const { id } = updatedData;
    if (id) {
      const newValue = updatedData.value;
      const hasNoOldValue =
        this.dataObject && this.dataObject[id] ? false : true;
      const oldValue = !hasNoOldValue ? this.dataObject[id].value : newValue;
      if (oldValue !== newValue || hasNoOldValue) {
        this.currentOpenEvent = {
          ...this.currentOpenEvent,
          syncStatus: 'not-synced'
        };
        this.dataObject[updatedData.id] = updatedData;
      }
      Object.keys(this.dataObject).forEach((key: any) => {
        const dataElementId = key.split('-')[0];
        dataValues.push({
          dataElement: dataElementId,
          value: this.dataObject[key].value
        });
      });
      if (dataValues && dataValues.length > 0) {
        this.currentOpenEvent = { ...this.currentOpenEvent, dataValues };
        this.eventCaptureFormProvider
          .saveEvents([this.currentOpenEvent], this.currentUser)
          .subscribe(
            () => {
              this.dataValueChange.emit({ status: true });
              this.dataObject[updatedData.id] = updatedData;
              this.dataUpdateStatus = { [updatedData.domElementId]: 'OK' };
              if (!shouldSkipProgramRules) {
                this.dataValuesSavingStatusClass[updatedData.id] =
                  'input-field-container-success';
                this.updateDeleteStatus.emit({ status: true });
                this.evaluatingProgramRules();
              }
            },
            error => {
              this.dataValuesSavingStatusClass[updatedData.id] =
                'input-field-container-failed';
              console.log(JSON.stringify(error));
              this.dataUpdateStatus = { [updatedData.domElementId]: 'ERROR' };
            }
          );
      }
    }
  }
}
