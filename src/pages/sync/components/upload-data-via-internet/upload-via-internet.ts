import { Component, OnInit } from '@angular/core';
import { UserProvider } from '../../../../providers/user/user';
import { ModalController } from 'ionic-angular';
import { DataValuesProvider } from '../../../../providers/data-values/data-values';
import { TrackerCaptureProvider } from '../../../../providers/tracker-capture/tracker-capture';
import { EnrollmentsProvider } from '../../../../providers/enrollments/enrollments';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

/**
 * Generated class for the UploadViaInternetComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'upload-data-via-internet',
  templateUrl: 'upload-via-internet.html'
})
export class UploadViaInternetComponent implements OnInit {
  currentUser: any;
  selectedItems: any = {};
  isLoading: boolean;
  loadingMessage: string;
  itemsToUpload: Array<string>;
  importSummaries: any;
  dataObject: any;
  translationMapper: any;

  constructor(
    private modalCtrl: ModalController,
    private dataValuesProvider: DataValuesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private user: UserProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.itemsToUpload = [];
    this.dataObject = {
      events: [],
      dataValues: [],
      eventsForTracker: [],
      Enrollments: []
    };
    this.importSummaries = null;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUsereInfromation();
      },
      error => {
        this.loadingCurrentUsereInfromation();
      }
    );
  }

  loadingCurrentUsereInfromation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.user.getCurrentUser().subscribe(
      (user: any) => {
        this.currentUser = user;
        this.loadingDataToUpload();
      },
      error => {}
    );
  }

  loadingDataToUpload() {
    let status = 'not-synced';
    this.dataValuesProvider
      .getDataValuesByStatus(status, this.currentUser)
      .subscribe(
        (dataValues: any) => {
          this.dataObject.dataValues = dataValues;
          this.trackerCaptureProvider
            .getTrackedEntityInstanceByStatus(status, this.currentUser)
            .subscribe(
              (trackedEntityInstances: any) => {
                this.dataObject.Enrollments = trackedEntityInstances;
                this.eventCaptureFormProvider
                  .getEventsByAttribute(
                    'syncStatus',
                    [status],
                    this.currentUser
                  )
                  .subscribe(
                    (events: any) => {
                      events.forEach((event: any) => {
                        if (
                          event &&
                          event.eventType &&
                          event.eventType == 'event-capture'
                        ) {
                          this.dataObject.events.push(event);
                        } else {
                          this.dataObject.eventsForTracker.push(event);
                        }
                      });
                      this.isLoading = false;
                    },
                    error => {
                      this.isLoading = false;
                      console.log('error : events');
                    }
                  );
              },
              error => {
                this.isLoading = false;
                console.log('error : enrollment');
              }
            );
        },
        error => {
          this.isLoading = false;
          console.log('error : data values');
        }
      );
  }

  updateItemsToUpload() {
    this.itemsToUpload = [];
    Object.keys(this.selectedItems).forEach((key: string) => {
      if (this.selectedItems[key]) {
        this.itemsToUpload.push(key);
      }
    });
  }

  uploadData() {
    let key = 'Uploading selected local data, please wait...';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.isLoading = true;
    this.importSummaries = {};
    let keys = [];
    let completedProcess = 0;
    for (let item of this.itemsToUpload) {
      if (item == 'dataValues') {
        let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(
          this.dataObject['dataValues']
        );
        this.dataValuesProvider
          .uploadDataValues(
            formattedDataValues,
            this.dataObject['dataValues'],
            this.currentUser
          )
          .subscribe(
            importSummaries => {
              keys.push('dataValues');
              this.importSummaries['dataValues'] = importSummaries;
              completedProcess++;
              if (completedProcess == this.itemsToUpload.length) {
                this.isLoading = false;
                this.viewUploadImportSummaries(keys);
              }
            },
            error => {
              console.log('Error ' + JSON.stringify(error));
            }
          );
      } else if (item == 'Enrollments') {
        this.trackerCaptureProvider
          .uploadTrackedEntityInstancesToServer(
            this.dataObject['Enrollments'],
            this.dataObject['Enrollments'],
            this.currentUser
          )
          .subscribe(
            (response: any) => {
              this.importSummaries['trackedEntityInstances'] =
                response.importSummaries;
              keys.push('trackedEntityInstances');
              this.enrollmentsProvider
                .getSavedEnrollmentsByAttribute(
                  'trackedEntityInstance',
                  response.trackedEntityInstanceIds,
                  this.currentUser
                )
                .subscribe(
                  (enrollments: any) => {
                    this.trackerCaptureProvider
                      .uploadEnrollments(enrollments, this.currentUser)
                      .subscribe(
                        () => {
                          this.eventCaptureFormProvider
                            .uploadEventsToSever(
                              this.dataObject['eventsForTracker'],
                              this.currentUser
                            )
                            .subscribe(
                              importSummaries => {
                                this.importSummaries[
                                  'eventsForTracker'
                                ] = importSummaries;
                                keys.push('eventsForTracker');
                                completedProcess++;
                                if (
                                  completedProcess == this.itemsToUpload.length
                                ) {
                                  this.isLoading = false;
                                  this.viewUploadImportSummaries(keys);
                                }
                              },
                              () => {}
                            );
                        },
                        error => {}
                      );
                  },
                  () => {}
                );
            },
            error => {}
          );
      } else if (item == 'eventsForTracker') {
        this.eventCaptureFormProvider
          .uploadEventsToSever(
            this.dataObject['eventsForTracker'],
            this.currentUser
          )
          .subscribe(
            importSummaries => {
              this.importSummaries['eventsForTracker'] = importSummaries;
              keys.push('eventsForTracker');
              completedProcess++;
              if (completedProcess == this.itemsToUpload.length) {
                this.isLoading = false;
                this.viewUploadImportSummaries(keys);
              }
            },
            () => {}
          );
      } else if (item == 'events') {
        this.eventCaptureFormProvider
          .uploadEventsToSever(this.dataObject['events'], this.currentUser)
          .subscribe(
            importSummaries => {
              this.importSummaries['events'] = importSummaries;
              keys.push('events');
              completedProcess++;
              if (completedProcess == this.itemsToUpload.length) {
                this.isLoading = false;
                this.viewUploadImportSummaries(keys);
              }
            },
            () => {}
          );
      }
    }
  }

  viewUploadImportSummaries(keys) {
    if (this.importSummaries) {
      let modal = this.modalCtrl.create('ImportSummariesPage', {
        importSummaries: this.importSummaries,
        keys: keys
      });
      modal.onDidDismiss(() => {
        Object.keys(this.selectedItems).forEach((key: string) => {
          this.selectedItems[key] = false;
        });
        this.dataObject = {
          events: [],
          dataValues: [],
          eventsForTracker: [],
          Enrollments: []
        };
        this.loadingDataToUpload();
      });
      modal.present();
    }
  }

  getValuesToTranslate() {
    return [
      'Aggregate data',
      'Events',
      'Events for tracker',
      'Enrollments',
      'Upload data',
      'Discovering current user information',
      'Uploading selected local data, please wait...'
    ];
  }
}
