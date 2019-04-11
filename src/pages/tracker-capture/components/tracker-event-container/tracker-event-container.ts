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
  @Input() dataObject;
  @Input() programSkipLogicMetadata;
  @Input() dataValuesSavingStatusClass;
  @Input() programStage;
  @Input() currentOpenEvent;
  @Input() currentUser: CurrentUser;

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
      setTimeout(() => {
        this.evaluatingProgramRules();
      }, 50);
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
        res => {
          const { data } = res;
          if (data) {
            const {
              hiddenSections,
              assignedFields,
              hiddenFields,
              hiddenProgramStages,
              errorOrWarningMessage
            } = data;
            console.log(JSON.stringify(data));
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

  updateEventDate(date: string, eventDateType: string) {}

  updateEventCoordonate(coordinate: any) {
    this.currentOpenEvent.coordinate = coordinate;
    this.updateData({}, false);
  }

  updateData(updatedData: any, shouldSkipProgramRules: boolean) {
    if (!shouldSkipProgramRules) {
      this.evaluatingProgramRules();
    }
  }
}
