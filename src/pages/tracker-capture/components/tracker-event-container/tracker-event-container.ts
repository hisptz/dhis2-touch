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
import { CurrentUser } from '../../../../models/currentUser';

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
  @Input() programStage;
  @Input() currentOpenEvent;
  @Input() formLayout: string;
  @Input() currentUser: CurrentUser;
  @Input() isOpenRow: boolean;
  @Input() canEventBeDeleted: boolean;
  @Input() dataValuesSavingStatusClass;
  @Output() onChange = new EventEmitter();
  @Output() onDeleteEvent = new EventEmitter();
  translationMapper: any;
  dataObject: any;
  entryFormType: string;
  dataUpdateStatus: { [elementId: string]: string };

  constructor(
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.entryFormType = 'event';
    this.dataObject = {};
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
    }
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
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
        this.updateData({});
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

  updateData(updatedData) {
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
    return item.id;
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
