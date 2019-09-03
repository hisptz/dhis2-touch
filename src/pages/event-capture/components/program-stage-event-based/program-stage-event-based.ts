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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ProgramsProvider } from '../../../../providers/programs/programs';
import { OrganisationUnitsProvider } from '../../../../providers/organisation-units/organisation-units';
import { UserProvider } from '../../../../providers/user/user';
import { AppProvider } from '../../../../providers/app/app';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { ActionSheetController } from 'ionic-angular';
import { ProgramRulesProvider } from '../../../../providers/program-rules/program-rules';
import { CurrentUser } from '../../../../models';
import { EventCompletenessProvider } from '../../../../providers/event-completeness/event-completeness';

/**
 * Generated class for the ProgramStageEventBasedComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage-event-based',
  templateUrl: 'program-stage-event-based.html'
})
export class ProgramStageEventBasedComponent implements OnInit, OnDestroy {
  @Input() programStage: any;
  @Input() dataDimension: any;
  @Input() currentEvent: any;
  @Input() emptyEvent: any;
  @Input() formLayout: string;
  @Input() programSkipLogicMetadata: any;

  @Output() onDeleteEvent = new EventEmitter();
  @Output() onCancelEvent = new EventEmitter();

  currentOrgUnit: any;
  currentProgram: any;
  currentUser: any;
  isLoading: boolean;
  loadingMessage: string;
  dataObject: any;
  eventDate: any;
  dataValuesSavingStatusClass: any;
  entryFormType: string;
  hasEntryFormReSet: boolean;
  dataUpdateStatus: { [elementId: string]: string };
  hiddenSections: any;
  hiddenProgramStages: any;
  errorOrWarningMessage: any;
  hiddenFields: any;
  assignedFields: any;
  programIndicators: any;
  customFormProgramRules: any;
  // completeness variables
  isEventCompleted: boolean;
  isEventLocked: boolean;
  isEventCompletenessProcessRunning: boolean;
  complementenesInfo: any;

  constructor(
    private programsProvider: ProgramsProvider,
    private programRulesProvider: ProgramRulesProvider,
    private actionSheetCtrl: ActionSheetController,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private eventCompletenessProvider: EventCompletenessProvider
  ) {
    this.entryFormType = 'event';
    this.hasEntryFormReSet = false;
    this.dataObject = {};
    this.dataValuesSavingStatusClass = {};
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.isLoading = true;
    this.hiddenFields = {};
    this.hiddenProgramStages = {};
    this.hiddenSections = {};
    this.errorOrWarningMessage = {};
    this.assignedFields = {};
    this.customFormProgramRules = {};
    this.programIndicators = [];
    // completeness control
    this.isEventCompleted = false;
    this.isEventLocked = false;
    this.isEventCompletenessProcessRunning = false;
    this.complementenesInfo = {
      completedBy: '',
      completedDate: ''
    };
  }

  ngOnInit() {
    this.loadingCurrentUserInformation();
    this.eventDate = '';
    if (this.currentEvent && this.currentEvent.eventDate) {
      this.eventDate = this.currentEvent.eventDate;
    }
  }

  getEventDateNotification() {
    const key = 'executionDateLabel';
    let notificationTitle = 'Select ';
    if (isNaN(this.programStage[key])) {
      notificationTitle += this.programStage[key];
    } else {
      notificationTitle += 'Report date';
    }
    notificationTitle += ' above to start entry';
    return notificationTitle;
  }

  async discoveringEventCompleteness(
    eventId: string,
    currentUser: CurrentUser
  ) {
    this.complementenesInfo = {
      completedBy: '',
      completedDate: ''
    };
    try {
      const response = await this.eventCompletenessProvider.getEventCompletenessById(
        eventId,
        currentUser
      );
      this.complementenesInfo =
        response && response.length > 0 ? response[0] : this.complementenesInfo;
    } catch (error) {
      console.log({ error });
    }
  }

  async onUpdatingEventCompleteness(previousStatus: boolean) {
    this.isEventCompletenessProcessRunning = true;
    let response: any;
    try {
      if (previousStatus) {
        response = await this.eventCompletenessProvider.unCompleteEvent(
          this.currentEvent,
          this.currentUser
        );
      } else {
        response = await this.eventCompletenessProvider.completeEvent(
          this.currentEvent,
          this.currentUser
        );
      }
    } catch (error) {
      console.log({ error });
    } finally {
      this.complementenesInfo =
        response && response.length > 0 ? response[0] : this.complementenesInfo;
      setTimeout(() => {
        this.isEventCompletenessProcessRunning = false;
        this.isEventCompleted = !previousStatus;
      }, 50);
    }
  }

  hasEventDatesLabel(value: any) {
    return value && isNaN(value) && value.trim() !== '';
  }

  loadingCurrentUserInformation() {
    this.loadingMessage = 'Discovering current user information';
    this.userProvider.getCurrentUser().subscribe(
      (user: CurrentUser) => {
        this.currentUser = user;
        if (
          this.currentEvent &&
          this.currentEvent.dataValues &&
          this.currentEvent.dataValues.length > 0
        ) {
          const eventId = this.currentEvent.id;
          this.discoveringEventCompleteness(eventId, this.currentUser);
          this.updateDataObjectModel(
            this.currentEvent.dataValues,
            this.programStage.programStageDataElements
          );
        }
        const { id } = this.currentProgram;
        this.programsProvider
          .getProgramIndicators(id, user.currentDatabase)
          .subscribe(
            programIndicators => {
              this.programIndicators = programIndicators;
              this.isLoading = false;
              setTimeout(() => {
                this.evaluatingProgramRules();
              }, 50);
            },
            error => {
              this.isLoading = false;
              console.log(JSON.stringify(error));
              this.appProvider.setNormalNotification(
                'Failed to dicover program indicators'
              );
            }
          );
      },
      error => {
        this.isLoading = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  AddNewEvent() {
    this.eventDate = '';
    this.hasEntryFormReSet = true;
    this.currentEvent = Object.assign({}, this.emptyEvent);
    this.currentEvent.id = this.eventCaptureFormProvider.getEventUid();
    setTimeout(() => {
      this.dataObject = {};
      this.dataValuesSavingStatusClass = {};
    }, 100);
  }

  goBack() {
    this.onCancelEvent.emit();
  }

  canEventBeDeleted() {
    return this.currentEvent && this.currentEvent.eventDate;
  }

  deleteEvent(currentEventId, title?) {
    const actionSheet = this.actionSheetCtrl.create({
      title:
        title && title !== ''
          ? title
          : 'You are about to delete this event, are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.isLoading = true;
            this.loadingMessage = 'Deleting event';
            this.eventCaptureFormProvider
              .deleteEventByAttribute('id', currentEventId, this.currentUser)
              .subscribe(
                () => {
                  this.appProvider.setNormalNotification(
                    'Event has been deleted successfully'
                  );
                  this.onDeleteEvent.emit();
                },
                error => {
                  console.log(JSON.stringify(error));
                  this.isLoading = false;
                  this.appProvider.setNormalNotification(
                    'Failed to delete event'
                  );
                }
              );
          }
        },
        {
          text: 'No',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  updateDataObjectModel(dataValues, programStageDataElements) {
    let dataValuesMapper = {};
    dataValues.map((dataValue: any) => {
      dataValuesMapper[dataValue.dataElement] = dataValue;
    });
    programStageDataElements.map((programStageDataElement: any) => {
      if (
        programStageDataElement.dataElement &&
        programStageDataElement.dataElement.id
      ) {
        let dataElementId = programStageDataElement.dataElement.id;
        let fieldId = programStageDataElement.dataElement.id + '-dataElement';
        if (dataValuesMapper[dataElementId]) {
          this.dataObject[fieldId] = dataValuesMapper[dataElementId];
        }
      }
    });
  }

  updateEventDate(date) {
    this.hasEntryFormReSet = false;
    if (date && date !== '') {
      this.eventDate = date;
      this.currentEvent.syncStatus = 'not-synced';
      if (this.canEventBeDeleted()) {
        this.updateData({}, false);
      }
    } else {
      if (this.canEventBeDeleted()) {
        const title =
          'Clearing this value results to deletion of this event, are you sure?';
        this.deleteEvent(this.currentEvent.id, title);
      } else {
        this.eventDate = date;
      }
    }
  }

  updateEventCoordonate(coordinate) {
    this.currentEvent.coordinate = coordinate;
    this.updateData({}, false);
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
              hiddenFields,
              hiddenProgramStages,
              errorOrWarningMessage,
              assignedFields
            } = data;
            const assignedFieldIds = Object.keys(this.assignedFields);
            assignedFieldIds.map(key => {
              this.assignedFields[key] = '';
            });
            Object.keys(assignedFields).map(key => {
              this.assignedFields[key] = assignedFieldIds[key];
            });
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
                this.assignedFields[key] = value;
                this.hiddenFields[key] = true;
                this.dataValuesSavingStatusClass[id] = 'input-field-container';
                this.updateData({ id: id, value }, true);
                setTimeout(() => {
                  delete this.hiddenFields[key];
                }, 10);
              });
            }
            const programStageId =
              this.programStage && this.programStage.id
                ? this.programStage.id
                : '';
            this.customFormProgramRules = {
              ...{},
              assignedFields: this.assignedFields,
              errorOrWarningMessage,
              hiddenFields: this.hiddenFields,
              programStageId
            };
          }
        },
        error => {
          console.log(
            'Error evaluate program rules : ' + JSON.stringify(error)
          );
        }
      );
  }

  updateData(updatedData, shouldSkipProgramRules) {
    const oldEventDate = this.currentEvent['eventDate'];
    this.currentEvent['eventDate'] = this.eventDate;
    this.currentEvent['dueDate'] = this.eventDate;
    if (oldEventDate !== this.eventDate) {
      this.currentEvent.syncStatus = 'not-synced';
    }
    const dataValues = [];
    const { id } = updatedData;
    if (id) {
      const newValue = updatedData.value;
      const hasNoOldValue =
        this.dataObject && this.dataObject[id] && this.dataObject[id].value
          ? false
          : true;
      const oldValue = !hasNoOldValue ? this.dataObject[id].value : newValue;
      if (oldValue !== newValue || hasNoOldValue) {
        this.currentEvent.syncStatus = 'not-synced';
        this.dataObject[updatedData.id] = updatedData;
      }
    }
    Object.keys(this.dataObject).forEach((key: any) => {
      let dataElementId = key.split('-')[0];
      dataValues.push({
        dataElement: dataElementId,
        value: this.dataObject[key].value
      });
    });
    if (dataValues && dataValues.length > 0) {
      this.currentEvent.dataValues = dataValues;
      this.eventCaptureFormProvider
        .saveEvents([this.currentEvent], this.currentUser)
        .subscribe(
          () => {
            if (!this.hasEntryFormReSet) {
              this.dataObject[updatedData.id] = updatedData;
              this.dataUpdateStatus = { [updatedData.domElementId]: 'OK' };
              if (!shouldSkipProgramRules) {
                this.dataValuesSavingStatusClass[updatedData.id] =
                  'input-field-container-success';
                this.evaluatingProgramRules();
              }
            }
          },
          error => {
            if (!this.hasEntryFormReSet) {
              this.dataValuesSavingStatusClass[updatedData.id] =
                'input-field-container-failed';
              console.log(JSON.stringify(error));
              this.dataUpdateStatus = { [updatedData.domElementId]: 'ERROR' };
            }
          }
        );
    }
  }

  ngOnDestroy() {
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
