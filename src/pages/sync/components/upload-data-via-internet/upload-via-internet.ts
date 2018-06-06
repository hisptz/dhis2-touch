import { Component, OnInit } from '@angular/core';
import { UserProvider } from '../../../../providers/user/user';
import { ModalController } from 'ionic-angular';
import { DataValuesProvider } from '../../../../providers/data-values/data-values';
import { TrackerCaptureProvider } from '../../../../providers/tracker-capture/tracker-capture';
import { EnrollmentsProvider } from '../../../../providers/enrollments/enrollments';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';
import { SynchronizationProvider } from '../../../../providers/synchronization/synchronization';

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
    private appTranslation: AppTranslationProvider,
    private synchronizationProvider: SynchronizationProvider
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
    this.synchronizationProvider.getDataForUpload(this.currentUser).subscribe(
      dataObject => {
        this.dataObject = dataObject;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        console.log('error : ' + JSON.stringify(error));
      }
    );
  }

  updateItemsToUpload() {
    this.itemsToUpload = [];
    Object.keys(this.selectedItems).map((key: string) => {
      if (this.selectedItems[key]) {
        this.itemsToUpload.push(key);
      }
    });
  }

  uploadData() {
    const key = 'Uploading selected local data, please wait...';
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
