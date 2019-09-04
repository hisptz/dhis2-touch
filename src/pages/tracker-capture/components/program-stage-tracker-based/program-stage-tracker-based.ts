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
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppProvider } from '../../../../providers/app/app';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { SettingsProvider } from '../../../../providers/settings/settings';
import { ActionSheetController } from 'ionic-angular';
import * as _ from 'lodash';
import { CurrentUser } from '../../../../models';
import { EventCompletenessProvider } from '../../../../providers/event-completeness/event-completeness';

@Component({
  selector: 'program-stage-tracker-based',
  templateUrl: 'program-stage-tracker-based.html'
})
export class ProgramStageTrackerBasedComponent implements OnInit {
  @Input() programStage: any;
  @Input() formLayout: string;
  @Input() trackedEntityInstance: string;
  @Input() programSkipLogicMetadata: any;
  @Input() currentOrganisationUnit: any;
  @Input() currentProgram: any;
  @Input() currentUser: CurrentUser;

  isAddButtonDisabled: boolean;
  isLoading: boolean;
  loadingMessage: string;
  currentEvents: any[];
  currentOpenEvent: any;
  isNewEventFormOpened: boolean;
  dataEntrySettings: any;
  columnsToDisplay: any;
  tableLayout: any;
  dataValuesSavingStatusClass: any;
  dataObject: any;
  isDeletable: boolean;
  isTableRowActivated: boolean;
  // completeness variables
  isEventCompleted: boolean;
  isEventLocked: boolean;
  isEventCompletenessProcessRunning: boolean;
  complementenesInfo: any;

  constructor(
    private settingsProvider: SettingsProvider,
    private actionSheetCtrl: ActionSheetController,
    private appProvider: AppProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private eventCompletenessProvider: EventCompletenessProvider
  ) {
    this.isAddButtonDisabled = true;
    this.isTableRowActivated = false;
    this.isLoading = true;
    this.loadingMessage = '';
    this.currentEvents = [];
    this.dataValuesSavingStatusClass = {};
    this.dataObject = {};
    this.isDeletable = false;
  }

  ngOnInit() {
    this.resetCompletenessInfo();
    this.loadingMessage = 'Discovering data entry settings';
    this.settingsProvider.getSettingsForTheApp(this.currentUser).subscribe(
      (appSettings: any) => {
        this.dataEntrySettings = appSettings.entryForm;
        this.columnsToDisplay = {};
        const { id, programStageDataElements } = this.programStage;
        const { label } = this.dataEntrySettings;
        this.discoverAndSetColumnsToDisplay(programStageDataElements, label);
        this.discoveringProgramStageEvents(id, programStageDataElements);
      },
      error => {
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover data entry settings'
        );
        console.log(JSON.stringify({ error }));
      }
    );
  }

  resetCompletenessInfo() {
    // completeness control
    this.isEventCompleted = false;
    this.isEventLocked = false;
    this.isEventCompletenessProcessRunning = false;
    this.complementenesInfo = {
      completedBy: '',
      completedDate: ''
    };
  }

  async discoveringEventCompleteness(
    eventId: string,
    currentUser: CurrentUser
  ) {
    const complementenesInfo = {
      completedBy: '',
      completedDate: ''
    };
    try {
      const response = await this.eventCompletenessProvider.getEventCompletenessById(
        eventId,
        currentUser
      );
      this.complementenesInfo =
        response && response !== null ? response : complementenesInfo;
      this.isEventCompleted =
        response && response.completedDate && isNaN(response.completedDate);
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
          this.currentOpenEvent,
          this.currentUser
        );
      } else {
        response = await this.eventCompletenessProvider.completeEvent(
          this.currentOpenEvent,
          this.currentUser
        );
      }
      this.isEventCompleted = !previousStatus;
    } catch (error) {
      console.log({ error });
    } finally {
      this.complementenesInfo = response;
      setTimeout(() => {
        this.isEventCompletenessProcessRunning = false;
        this.currentOpenEvent.syncStatus = 'not-synced';
        this.currentOpenEvent.status = this.isEventCompleted
          ? 'COMPLETED'
          : 'ACTIVE';
      }, 50);
    }
  }

  discoverAndSetColumnsToDisplay(programStageDataElements, label) {
    if (programStageDataElements && label) {
      _.map(programStageDataElements, (programStageDataElement: any) => {
        const { dataElement, displayInReports } = programStageDataElement;
        if (dataElement && dataElement.id && displayInReports) {
          const fieldLabel =
            dataElement[label] && isNaN(dataElement[label])
              ? dataElement[label]
              : dataElement.displayName;
          this.columnsToDisplay[dataElement.id] = fieldLabel;
        }
      });
      if (
        Object.keys(this.columnsToDisplay).length === 0 &&
        programStageDataElements.length > 0
      ) {
        _.map(
          _.chunk(programStageDataElements, 3)[0],
          (programStageDataElement: any) => {
            const { dataElement } = programStageDataElement;
            if (dataElement && dataElement.id) {
              const fieldLabel =
                dataElement[label] && isNaN(dataElement[label])
                  ? dataElement[label]
                  : dataElement.displayName;
              this.columnsToDisplay[dataElement.id] = fieldLabel;
            }
          }
        );
      }
    }
  }

  discoveringProgramStageEvents(
    programStageId: string,
    programStageDataElements,
    shouldCreateEvent: boolean = false,
    eventId?: any,
    shouldSkipLoader?: boolean
  ) {
    if (!shouldSkipLoader) {
      this.isLoading = true;
      this.currentEvents = [];
    }
    this.loadingMessage = 'Discovering program stage events';
    this.isNewEventFormOpened = false;
    this.isAddButtonDisabled = false;
    this.isDeletable = false;
    this.isTableRowActivated = false;
    this.eventCaptureFormProvider
      .getEventsForProgramStage(
        this.currentUser,
        programStageId,
        this.trackedEntityInstance
      )
      .subscribe(
        (events: any) => {
          let sanitizedEvents = _.map(events, (event: any) => {
            let { eventDate, dueDate } = event;
            dueDate = dueDate ? dueDate : eventDate;
            dueDate = dueDate ? dueDate.split('T')[0] : dueDate;
            eventDate = eventDate ? eventDate.split('T')[0] : eventDate;
            return {
              ...event,
              eventDate,
              dueDate
            };
          });
          if (sanitizedEvents.length > 0) {
            if (shouldCreateEvent) {
              this.createEmptyEvent();
            } else {
              if (eventId) {
                const currentOpenEvent = _.find(sanitizedEvents, {
                  id: eventId
                });
                if (currentOpenEvent) {
                  this.currentOpenEvent = currentOpenEvent;
                }
              } else {
                this.currentOpenEvent =
                  sanitizedEvents[sanitizedEvents.length - 1];
              }
              const { dataValues } = this.currentOpenEvent;
              this.updateDataObjectModel(
                dataValues,
                programStageDataElements,
                shouldSkipLoader
              );
              this.isTableRowActivated = true;
              setTimeout(() => {
                this.isLoading = false;
              }, 50);
            }
            this.currentEvents = sanitizedEvents;
          } else {
            this.createEmptyEvent();
          }
          this.renderDataAsTable();
        },
        error => {
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover program stage events'
          );
          console.log(JSON.stringify({ error }));
        }
      );
  }

  createEmptyEvent() {
    this.eventCaptureFormProvider
      .getEventDueDate(
        this.currentEvents,
        this.programStage,
        this.trackedEntityInstance,
        this.currentOrganisationUnit.id,
        this.currentProgram.id,
        this.currentUser
      )
      .subscribe(
        dueDate => {
          const dataDimension: any = this.getDataDimensions();
          this.currentOpenEvent = this.eventCaptureFormProvider.getEmptyEvent(
            this.currentProgram,
            this.currentOrganisationUnit,
            this.programStage.id,
            dataDimension.attributeCos,
            dataDimension.attributeCc,
            'tracker-capture'
          );
          this.dataValuesSavingStatusClass = {};
          this.currentOpenEvent['dueDate'] = dueDate;
          this.currentOpenEvent[
            'trackedEntityInstance'
          ] = this.trackedEntityInstance;
          this.dataObject = {};
          this.isNewEventFormOpened = true;
          this.isAddButtonDisabled = true;
          this.isLoading = false;
        },
        error => {
          console.log(
            'Error on getting due date for new event ' + JSON.stringify(error)
          );
        }
      );
  }

  updateDataObjectModel(
    dataValues,
    programStageDataElements,
    shouldSkipLoader
  ) {
    const dataValuesMapper = _.keyBy(dataValues, 'dataElement');
    if (!shouldSkipLoader) {
      this.dataObject = {};
    }
    _.map(programStageDataElements, (programStageDataElement: any) => {
      const { dataElement } = programStageDataElement;
      if (dataElement && dataElement.id) {
        const { id } = dataElement;
        if (dataValuesMapper[id]) {
          const fieldId = `${id}-dataElement`;
          this.dataObject[fieldId] = dataValuesMapper[id];
        }
      }
    });
  }

  renderDataAsTable() {
    this.resetCompletenessInfo();
    if (this.currentOpenEvent && this.currentOpenEvent.id) {
      const { id } = this.currentOpenEvent;
      this.discoveringEventCompleteness(id, this.currentUser);
    }
    this.currentEvents = _.sortBy(this.currentEvents, ['eventDate']);
    this.eventCaptureFormProvider
      .getTableFormatResult(
        this.columnsToDisplay,
        this.currentEvents,
        'tracker-capture'
      )
      .subscribe(
        (response: any) => {
          const { eventIds, table } = response;
          this.tableLayout = table;
        },
        error => {
          this.appProvider.setNormalNotification(
            'Failed to prepare table for display'
          );
        }
      );
  }

  isTableRowActive(rowIndex: any) {
    const status =
      this.currentEvents &&
      this.currentEvents[rowIndex] &&
      this.currentOpenEvent &&
      this.currentEvents[rowIndex].id === this.currentOpenEvent.id;
    return status;
  }

  activateRowProgramStageDataEntry(rowIndex: number) {
    const { id, programStageDataElements } = this.programStage;
    const currentOpenEvent = this.currentEvents[rowIndex];
    const eventId = currentOpenEvent.id;
    this.isNewEventFormOpened = false;
    if (
      this.currentOpenEvent &&
      this.currentOpenEvent.id &&
      this.currentOpenEvent.id === eventId
    ) {
      this.currentOpenEvent = null;
      this.isTableRowActivated = false;
      this.isDeletable = false;
    } else {
      this.discoveringProgramStageEvents(
        id,
        programStageDataElements,
        false,
        eventId
      );
    }
  }

  onDataValueChange(response: any) {
    const { status } = response;
    if (status) {
      const { id, programStageDataElements } = this.programStage;
      const eventId = this.currentOpenEvent.id;
      this.isNewEventFormOpened = false;
      this.discoveringProgramStageEvents(
        id,
        programStageDataElements,
        false,
        eventId,
        true
      );
    }
  }

  onAddRepeatableEvent() {
    const { id, programStageDataElements } = this.programStage;
    this.discoveringProgramStageEvents(id, programStageDataElements, true);
  }

  onUpdateDeleteStatus(data: any) {
    const { status } = data;
    this.isDeletable = status;
    this.isAddButtonDisabled = !status;
  }

  onDeleteEvent(dataResponse) {
    const { title } = dataResponse;
    const { id } = this.currentOpenEvent;
    const actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.eventCaptureFormProvider
              .deleteEventByAttribute('id', id, this.currentUser)
              .subscribe(
                () => {
                  this.isLoading = true;
                  const { id, programStageDataElements } = this.programStage;
                  this.discoveringProgramStageEvents(
                    id,
                    programStageDataElements
                  );
                  this.appProvider.setNormalNotification(
                    'Event has been deleted successfully'
                  );
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

  getDataDimensions() {
    if (this.currentProgram && this.currentProgram.categoryCombo) {
      const { id } = this.currentProgram.categoryCombo;
      return { attributeCc: id, attributeCos: '' };
    } else {
      return {};
    }
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
