import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';
import { CurrentUser } from '../../../../models/current-user';
import { ProgramRulesProvider } from '../../../../providers/program-rules/program-rules';

/**
 * Generated class for the TrackerEventContainerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tracker-event-container',
  templateUrl: 'tracker-event-container.html'
})
export class TrackerEventContainerComponent implements OnInit, OnDestroy {
  @Input()
  programStage;
  @Input()
  currentOpenEvent;
  @Input()
  formLayout: string;
  @Input()
  currentUser: CurrentUser;
  @Input()
  isOpenRow: boolean;
  @Input()
  canEventBeDeleted: boolean;
  @Input()
  dataValuesSavingStatusClass;
  @Input()
  programSkipLogicMetadata;

  @Output()
  onChange = new EventEmitter();
  @Output()
  onDeleteEvent = new EventEmitter();

  translationMapper: any;
  dataObject: any;
  entryFormType: string;
  dataUpdateStatus: { [elementId: string]: string };
  hiddenSections: any;
  hiddenProgramStages: any;
  hiddenFields: any;
  errorOrWarningMessage: any;

  constructor(
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appTranslation: AppTranslationProvider,
    private programRulesProvider: ProgramRulesProvider
  ) {
    this.hiddenFields = {};
    this.hiddenProgramStages = {};
    this.hiddenSections = {};
    this.errorOrWarningMessage = {};
    this.entryFormType = 'event';
    this.dataObject = {};
  }

  ngOnInit() {
    if (
      this.currentOpenEvent &&
      this.currentOpenEvent.dataValues &&
      this.programStage &&
      this.programStage.programStageDataElements
    ) {
      this.updateDataObjectModel(
        this.currentOpenEvent.dataValues,
        this.programStage.programStageDataElements
      );
      setTimeout(() => {
        this.evaluatingProgramRules();
      }, 50);
    }
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
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

  hasEventDatesLabel(value) {
    return isNaN(value);
  }

  ngOnDestroy() {
    this.programStage = null;
    this.currentOpenEvent = null;
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
  updateEventDate(date, eventDateType) {
    //programStage.hideDueDate
    //handling of due date
    if (date && date !== '') {
      this.currentOpenEvent[eventDateType] = date;
      this.currentOpenEvent.syncStatus = 'not-synced';
      if (this.canEventBeDeleted) {
        this.updateData({}, false);
      }
    } else {
      if (this.canEventBeDeleted) {
        const data = {
          title:
            'Clearing this value results to deletion of this event, are you sure?',
          id: this.currentOpenEvent.id
        };
        if (eventDateType === 'eventDate') {
          this.onDeleteEvent.emit(data);
        } else {
          this.currentOpenEvent[eventDateType] = date;
        }
        //handling clearing of due date, check with web app
      } else {
        this.currentOpenEvent[eventDateType] = date;
      }
    }
  }

  updateEventCoordonate(coordinate) {
    this.currentOpenEvent.coordinate = coordinate;
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
            const { hiddenSections } = data;
            const { hiddenFields } = data;
            const { hiddenProgramStages } = data;
            const { errorOrWarningMessage } = data;
            const { assignedFields } = data;
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

  updateData(updatedData, shouldSkipProgramRules) {
    let dataValues = [];
    if (updatedData && updatedData.id) {
      this.dataObject[updatedData.id] = updatedData;
    }
    Object.keys(this.dataObject).forEach((key: any) => {
      let dataElementId = key.split('-')[0];
      dataValues.push({
        dataElement: dataElementId,
        value: this.dataObject[key].value
      });
    });
    //update evalutions of programing rules on tracker based events
    if (!shouldSkipProgramRules) {
      this.evaluatingProgramRules();
    }

    if (dataValues.length > 0) {
      this.currentOpenEvent.dataValues = dataValues;
      this.currentOpenEvent.syncStatus = 'not-synced';
      this.onChange.emit(this.isOpenRow);
      this.eventCaptureFormProvider
        .saveEvents([this.currentOpenEvent], this.currentUser)
        .subscribe(
          () => {
            this.dataValuesSavingStatusClass[updatedData.id] =
              'input-field-container-success';
            this.dataObject[updatedData.id] = updatedData;
            this.dataUpdateStatus = { [updatedData.domElementId]: 'OK' };
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

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return [
      'Report date',
      'Due date',
      'Touch to pick date',
      'Contact your help desk to add data elements on this stage'
    ];
  }
}
