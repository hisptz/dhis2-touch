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
import { SettingsProvider } from '../../../../providers/settings/settings';
import { ActionSheetController } from 'ionic-angular';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

/**
 * Generated class for the ProgramStageTrackerBasedComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage-tracker-based',
  templateUrl: 'program-stage-tracker-based.html'
})
export class ProgramStageTrackerBasedComponent implements OnInit, OnDestroy {
  @Input() programStage;
  @Input() formLayout: string;
  @Input() trackedEntityInstance;
  @Input() currentWidgetIndex;
  @Input() isLastStage;
  @Output() onChange = new EventEmitter();

  currentOrgUnit: any;
  currentProgram: any;
  currentUser: any;
  isLoading: boolean;
  loadingMessage: string;
  selectedDataDimension: any;
  dataObjectModel: any;
  currentEvents: Array<any> = [];
  isNewEventFormOpened: boolean = false;
  currentOpenEvent: any;

  dataEntrySettings: any;
  columnsToDisplay: any;
  tableLayout: any;

  isTableRowOpened: any = {};
  canEventBeDeleted: boolean = false;
  isAddButtonDisabled: boolean = true;
  translationMapper: any;
  currentEventId: string;
  dataValuesSavingStatusClass: any;

  constructor(
    private programsProvider: ProgramsProvider,
    private settingsProvider: SettingsProvider,
    private actionSheetCtrl: ActionSheetController,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appTranslation: AppTranslationProvider,
    private organisationUnitProvider: OrganisationUnitsProvider
  ) {}

  ngOnInit() {
    this.dataObjectModel = {};
    this.dataValuesSavingStatusClass = {};
    this.currentEvents = [];
    //@todo add support of data dimensions
    this.selectedDataDimension = [];
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUserInformation();
      },
      error => {
        this.loadingCurrentUserInformation();
      }
    );

    this.isLoading = true;
  }

  loadingCurrentUserInformation() {
    this.loadingMessage = 'Discovering current user information';
    this.userProvider.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        if (this.programStage && this.programStage.id) {
          this.settingsProvider
            .getSettingsForTheApp(this.currentUser)
            .subscribe((appSettings: any) => {
              this.dataEntrySettings = appSettings.entryForm;
              this.columnsToDisplay = {};
              if (this.programStage.programStageDataElements) {
                this.programStage.programStageDataElements.forEach(
                  (programStageDataElement: any) => {
                    if (
                      programStageDataElement.dataElement &&
                      programStageDataElement.dataElement.id
                    ) {
                      let dataElement = programStageDataElement.dataElement;
                      let fieldLabelKey = dataElement.displayName;
                      if (
                        this.dataEntrySettings &&
                        this.dataEntrySettings.label &&
                        dataElement[this.dataEntrySettings.label]
                      ) {
                        if (isNaN(dataElement[this.dataEntrySettings.label])) {
                          fieldLabelKey =
                            dataElement[this.dataEntrySettings.label];
                        }
                      }
                      if (programStageDataElement.displayInReports) {
                        this.columnsToDisplay[
                          programStageDataElement.dataElement.id
                        ] = fieldLabelKey;
                      }
                    }
                  }
                );
                if (
                  Object.keys(this.columnsToDisplay).length == 0 &&
                  this.programStage.programStageDataElements.length > 0
                ) {
                  let counter = 0;
                  this.programStage.programStageDataElements.forEach(
                    (programStageDataElement: any) => {
                      if (
                        programStageDataElement.dataElement &&
                        programStageDataElement.dataElement.id &&
                        counter < 3
                      ) {
                        let dataElement = programStageDataElement.dataElement;
                        let fieldLabelKey = dataElement.displayName;
                        this.columnsToDisplay[
                          programStageDataElement.dataElement.id
                        ] = fieldLabelKey;
                        counter++;
                      }
                    }
                  );
                }
              }
              this.loadEventsBasedOnProgramStage(this.programStage.id);
            });
        }
      },
      error => {
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  loadEventsBasedOnProgramStage(programStageId) {
    this.loadingMessage = 'Discovering events';
    this.isNewEventFormOpened = false;
    this.isAddButtonDisabled = false;
    this.currentEvents = [];
    this.eventCaptureFormProvider
      .getEventsForProgramStage(
        this.currentUser,
        programStageId,
        this.trackedEntityInstance
      )
      .subscribe(
        (events: any) => {
          events.forEach((event: any) => {
            if (!event.dueDate) {
              event.dueDate = event.eventDate;
            }
          });
          if (events && events.length > 0) {
            this.eventCaptureFormProvider
              .saveEvents(events, this.currentUser)
              .subscribe(() => {});
          }
          this.isLoading = false;
          if (events && events.length == 0) {
            this.createEmptyEvent();
          } else if (events && events.length == 1) {
            this.currentOpenEvent = events[0];
            this.currentEventId = events[0].id;
            this.updateDataObjectModel(
              this.currentOpenEvent.dataValues,
              this.programStage.programStageDataElements
            );
            this.isNewEventFormOpened = true;
          } else if (events && events.length > 1) {
            this.currentEvents = events;
          }
          this.renderDataAsTable();
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification('Failed to discover events');
        }
      );
  }

  openProgramStageEventEntryForm(currentIndex) {
    this.canEventBeDeleted = false;
    this.isAddButtonDisabled = false;
    if (this.isTableRowOpened[currentIndex]) {
      this.isTableRowOpened[currentIndex] = false;
    } else {
      this.resetOpenRowOnRepeatableEvents();
      this.isTableRowOpened[currentIndex] = true;
      if (
        this.currentEvents[currentIndex] &&
        this.currentEvents[currentIndex].id
      ) {
        this.currentEventId = this.currentEvents[currentIndex].id;
      }
      this.canEventBeDeleted = true;
    }
    if (
      this.currentOpenEvent &&
      this.currentOpenEvent.dataValues &&
      this.currentOpenEvent.dataValues.length > 0 &&
      this.isNewEventFormOpened
    ) {
      this.currentEvents.push(this.currentOpenEvent);
      this.renderDataAsTable();
    }
    this.currentOpenEvent = null;
    this.isNewEventFormOpened = false;
  }

  createEmptyEvent() {
    //@todo creation of empty events based on
    let dataDimension: any = this.getDataDimensions();
    this.currentOpenEvent = this.eventCaptureFormProvider.getEmptyEvent(
      this.currentProgram,
      this.currentOrgUnit,
      this.programStage.id,
      dataDimension.attributeCos,
      dataDimension.attributeCc,
      'tracker-capture'
    );
    this.dataValuesSavingStatusClass = {};
    this.currentOpenEvent['trackedEntityInstance'] = this.trackedEntityInstance;
    this.dataObjectModel = {};
    this.currentEventId = this.currentOpenEvent.id;
    this.isNewEventFormOpened = true;
    this.isAddButtonDisabled = true;
    this.canEventBeDeleted = false;
  }

  addRepeatableEvent(currentOpenEvent) {
    if (
      currentOpenEvent &&
      currentOpenEvent.dataValues &&
      currentOpenEvent.dataValues.length > 0 &&
      this.isNewEventFormOpened
    ) {
      this.currentEvents.push(currentOpenEvent);
      this.renderDataAsTable();
    }
    this.isNewEventFormOpened = false;
    this.currentOpenEvent = {};
    setTimeout(() => {
      this.resetOpenRowOnRepeatableEvents();
      this.createEmptyEvent();
    }, 100);
  }

  couldEventBeDeleted() {
    return (
      this.canEventBeDeleted ||
      (this.currentOpenEvent &&
        this.currentOpenEvent.dataValues &&
        this.currentOpenEvent.dataValues.length > 0)
    );
  }

  deleteEventAction(data) {
    const { id } = data;
    const { title } = data;
    this.deleteEvent(id, title);
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
            this.eventCaptureFormProvider
              .deleteEventByAttribute('id', currentEventId, this.currentUser)
              .subscribe(
                () => {
                  this.isLoading = true;
                  this.loadEventsBasedOnProgramStage(this.programStage.id);
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

  renderDataAsTable() {
    this.eventCaptureFormProvider
      .getTableFormatResult(
        this.columnsToDisplay,
        this.currentEvents,
        'tracker-capture'
      )
      .subscribe(
        (response: any) => {
          this.tableLayout = response.table;
          this.resetOpenRowOnRepeatableEvents();
        },
        error => {
          this.appProvider.setNormalNotification(
            'Failed to prepare table for display'
          );
        }
      );
  }

  trackByFn(index, item) {
    return index;
  }

  updateDataObjectModel(dataValues, programStageDataElements) {
    let dataValuesMapper = {};
    dataValues.forEach((dataValue: any) => {
      dataValuesMapper[dataValue.dataElement] = dataValue;
    });
    programStageDataElements.forEach((programStageDataElement: any) => {
      if (
        programStageDataElement.dataElement &&
        programStageDataElement.dataElement.id
      ) {
        let dataElementId = programStageDataElement.dataElement.id;
        let fieldId = programStageDataElement.dataElement.id + '-dataElement';
        if (dataValuesMapper[dataElementId]) {
          this.dataObjectModel[fieldId] = dataValuesMapper[dataElementId];
        }
      }
    });
  }

  updateData(shouldUpdateTable) {
    this.isAddButtonDisabled = false;
    if (shouldUpdateTable) {
      this.eventCaptureFormProvider
        .getTableFormatResult(this.columnsToDisplay, this.currentEvents)
        .subscribe(
          (response: any) => {
            this.tableLayout = response.table;
          },
          error => {
            this.appProvider.setNormalNotification(
              'Failed to prepare table for display'
            );
          }
        );
    }
  }

  getDataDimensions() {
    if (this.currentProgram && this.currentProgram.categoryCombo) {
      let attributeCc = this.currentProgram.categoryCombo.id;
      let attributeCos = '';
      this.selectedDataDimension.forEach((dimension: any, index: any) => {
        if (index == 0) {
          attributeCos += dimension.id;
        } else {
          attributeCos += ';' + dimension.id;
        }
      });
      return { attributeCc: attributeCc, attributeCos: attributeCos };
    } else {
      return {};
    }
  }

  updateWidgetPagination(pageIndex) {
    this.onChange.emit(pageIndex);
  }

  resetOpenRowOnRepeatableEvents() {
    Object.keys(this.isTableRowOpened).forEach(key => {
      this.isTableRowOpened[key] = false;
    });
  }
  ngOnDestroy() {
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }

  getValuesToTranslate() {
    return [
      'New event',
      'Delete',
      'Discovering current user information',
      'Discovering events',
      'You are about to delete this event, are you sure?',
      'Yes',
      'No',
      'Prev',
      'Next'
    ];
  }
}
