import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ProgramsProvider } from '../../providers/programs/programs';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { EventCaptureFormProvider } from '../../providers/event-capture-form/event-capture-form';
import { ActionSheetController } from 'ionic-angular';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

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
  @Input() programStage;
  @Input() dataDimension;
  @Input() currentEvent;
  @Output() onDeleteEvent = new EventEmitter();

  currentOrgUnit: any;
  currentProgram: any;
  currentUser: any;
  isLoading: boolean;
  loadingMessage: string;
  dataObjectModel: any;
  eventDate: any;
  dataValuesSavingStatusClass: any;
  translationMapper: any;

  constructor(
    private programsProvider: ProgramsProvider,
    private actionSheetCtrl: ActionSheetController,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.dataObjectModel = {};
    this.translationMapper = {};
    this.dataValuesSavingStatusClass = {};
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.isLoading = true;
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUserInformation();
      },
      error => {
        this.loadingCurrentUserInformation();
      }
    );

    if (this.currentEvent && this.currentEvent.eventDate) {
      this.eventDate = this.currentEvent.eventDate;
    }
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      (user: any) => {
        this.currentUser = user;
        if (
          this.currentEvent &&
          this.currentEvent.dataValues &&
          this.currentEvent.dataValues.length > 0
        ) {
          this.updateDataObjectModel(
            this.currentEvent.dataValues,
            this.programStage.programStageDataElements
          );
        }
        this.isLoading = false;
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

  canEventBeDeleted() {
    return this.currentEvent && this.currentEvent.eventDate;
  }

  deleteEvent(currentEventId) {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.translationMapper[
        'You are about to delete this event, are you sure?'
      ],
      buttons: [
        {
          text: this.translationMapper['Yes'],
          handler: () => {
            this.isLoading = true;
            let key = 'Deleting event';
            this.loadingMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
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
          text: this.translationMapper['No'],
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
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

  updateEventDate() {
    this.currentEvent.syncStatus = 'not-synced';
  }

  updateData(updatedData) {
    this.currentEvent['eventDate'] = this.eventDate;
    this.currentEvent['dueDate'] = this.eventDate;
    this.currentEvent.syncStatus = 'not-synced';
    let dataValues = [];
    if (updatedData && updatedData.id) {
      this.dataObjectModel[updatedData.id] = updatedData;
    }
    Object.keys(this.dataObjectModel).forEach((key: any) => {
      let dataElementId = key.split('-')[0];
      dataValues.push({
        dataElement: dataElementId,
        value: this.dataObjectModel[key].value
      });
    });
    this.currentEvent.dataValues = dataValues;
    this.currentEvent.syncStatus = 'not-synced';
    this.eventCaptureFormProvider
      .saveEvents([this.currentEvent], this.currentUser)
      .subscribe(
        () => {
          this.dataObjectModel[updatedData.id] = updatedData;
          this.dataValuesSavingStatusClass[updatedData.id] =
            'input-field-container-success';
        },
        error => {
          this.dataValuesSavingStatusClass[updatedData.id] =
            'input-field-container-failed';
          console.log(JSON.stringify(error));
        }
      );
  }

  ngOnDestroy() {
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return [
      'Report date',
      'Touch to pick date',
      'Delete',
      'There are no data elements, please contact you help desk',
      'Discovering current user information',
      'You are about to delete this event, are you sure?',
      'Yes',
      'No',
      'Deleting event',
      'Event has been deleted successfully',
      'Failed to discover current user information',
      'Failed to delete event'
    ];
  }
}
