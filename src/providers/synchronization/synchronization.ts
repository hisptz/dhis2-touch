import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';
import { DataValuesProvider } from '../data-values/data-values';
import { TrackerCaptureProvider } from '../tracker-capture/tracker-capture';
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { EventCaptureFormProvider } from '../event-capture-form/event-capture-form';
import * as _ from 'lodash';
import { AppTranslationProvider } from '../app-translation/app-translation';
import { AppProvider } from '../app/app';
import { SettingsProvider } from '../settings/settings';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the SynchronizationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SynchronizationProvider {
  subscription: any;

  constructor(
    private dataValuesProvider: DataValuesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private user: UserProvider,
    private appTranslation: AppTranslationProvider,
    private appProvider: AppProvider,
    private settingsProvider: SettingsProvider
  ) {}

  stopSynchronization() {
    if (this.subscription) {
      clearInterval(this.subscription);
    }
  }

  startSynchronization(currentUser) {
    const defaultSettings = this.settingsProvider.getDefaultSettings();
    this.settingsProvider.getSettingsForTheApp(currentUser).subscribe(
      (appSettings: any) => {
        const synchronizationSettings =
          appSettings && appSettings.synchronization
            ? appSettings.synchronization
            : defaultSettings.synchronization;
        this.stopSynchronization();
        if (synchronizationSettings.isAutoSync) {
          this.subscription = setInterval(() => {
            this.getDataForUpload(currentUser).subscribe(
              dataObject => {
                this.uploadingDataToTheServer(
                  dataObject,
                  currentUser
                ).subscribe(
                  response => {
                    const { isCompleted } = response;
                    const { importSummaries } = response;
                    const { percentage } = response;
                    if (isCompleted) {
                      let message = '';
                      Object.keys(importSummaries).map(key => {
                        let newKey = key.charAt(0).toUpperCase() + key.slice(1);
                        newKey = newKey.replace(/([A-Z])/g, ' $1').trim();
                        const { success } = importSummaries[key];
                        if (success) {
                          message += newKey + ' ' + success + ', ';
                        }
                      });
                      if (message != '') {
                        message += 'has been successfully imported ';
                        this.appProvider.setTopNotification(message);
                      }
                    }
                  },
                  error => {}
                );
              },
              error => {}
            );
          }, 4000);
        }
      },
      error => {
        console.log;
        JSON.stringify(error);
      }
    );
  }

  uploadingDataToTheServer(dataObject, currentUser): Observable<any> {
    return new Observable(observer => {
      let completedProcess = 0;
      const dataItems = Object.keys(dataObject);
      const response = {
        percentage: '',
        importSummaries: {},
        isCompleted: false
      };
      for (let item of dataItems) {
        const percentage =
          ((dataItems.indexOf(item) + 1) / dataItems.length) * 100;
        response.percentage = percentage.toFixed(1);
        if (dataObject[item].length > 0) {
          if (item == 'dataValues') {
            let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(
              dataObject[item]
            );
            this.dataValuesProvider
              .uploadDataValues(
                formattedDataValues,
                dataObject[item],
                currentUser
              )
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  observer.next(response);
                  if (dataItems.length == completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading dataValues ' + JSON.stringify(error)
                  );
                }
              );
          } else if (item == 'events') {
            this.eventCaptureFormProvider
              .uploadEventsToSever(dataObject[item], currentUser)
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  observer.next(response);
                  if (dataItems.length == completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading events ' + JSON.stringify(error)
                  );
                }
              );
          } else if (
            item == 'eventsForTracker' &&
            dataObject['Enrollments'] &&
            dataObject['Enrollments'].length === 0
          ) {
            this.eventCaptureFormProvider
              .uploadEventsToSever(dataObject[item], currentUser)
              .subscribe(
                importSummaries => {
                  completedProcess++;
                  response.importSummaries[item] = importSummaries;
                  observer.next(response);
                  if (dataItems.length == completedProcess) {
                    response.isCompleted = true;
                    observer.next(response);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uploading tracker event ' + JSON.stringify(error)
                  );
                }
              );
          } else if (item == 'Enrollments') {
            this.trackerCaptureProvider
              .uploadTrackedEntityInstancesToServer(
                dataObject[item],
                dataObject[item],
                currentUser
              )
              .subscribe(
                (responseData: any) => {
                  completedProcess++;
                  response.importSummaries[item] = responseData.importSummaries;
                  observer.next(response);
                  this.enrollmentsProvider
                    .getSavedEnrollmentsByAttribute(
                      'trackedEntityInstance',
                      responseData.trackedEntityInstanceIds,
                      currentUser
                    )
                    .subscribe(
                      (enrollments: any) => {
                        this.trackerCaptureProvider
                          .uploadEnrollments(enrollments, currentUser)
                          .subscribe(
                            () => {
                              this.eventCaptureFormProvider
                                .uploadEventsToSever(
                                  dataObject['eventsForTracker'],
                                  currentUser
                                )
                                .subscribe(
                                  importSummaries => {
                                    completedProcess++;
                                    const percentage =
                                      ((dataItems.indexOf(item) + 2) /
                                        dataItems.length) *
                                      100;
                                    response.percentage = percentage.toFixed(1);
                                    response.importSummaries[
                                      'eventsForTracker'
                                    ] = importSummaries;
                                    observer.next(response);
                                    if (dataItems.length == completedProcess) {
                                      response.isCompleted = true;
                                      observer.next(response);
                                      observer.complete();
                                    }
                                  },
                                  error => {
                                    observer.error(error);
                                    console.log(
                                      'Error on uploading tracker event ' +
                                        JSON.stringify(error)
                                    );
                                  }
                                );
                            },
                            error => {
                              observer.error(error);
                              console.log(
                                'Error on uploading enrollments ' +
                                  JSON.stringify(error)
                              );
                            }
                          );
                      },
                      error => {
                        observer.error(error);
                        console.log(
                          'Error on saving enrollments by attributes' +
                            JSON.stringify(error)
                        );
                      }
                    );
                },
                error => {
                  observer.error(error);
                  console.log(
                    'Error on uloading tracked entities ' +
                      JSON.stringify(error)
                  );
                }
              );
          }
        } else {
          completedProcess++;
          observer.next(response);
          if (dataItems.length == completedProcess) {
            response.isCompleted = true;
            observer.next(response);
            observer.complete();
          }
        }
      }
    });
  }

  getDataForUpload(currentUser): Observable<any> {
    return new Observable(observer => {
      const status = 'not-synced';
      let dataObject = {
        events: [],
        dataValues: [],
        eventsForTracker: [],
        Enrollments: []
      };
      this.dataValuesProvider
        .getDataValuesByStatus(status, currentUser)
        .subscribe(
          (dataValues: any) => {
            dataObject.dataValues = dataValues;
            this.trackerCaptureProvider
              .getTrackedEntityInstanceByStatus(status, currentUser)
              .subscribe(
                (trackedEntityInstances: any) => {
                  dataObject.Enrollments = trackedEntityInstances;
                  this.eventCaptureFormProvider
                    .getEventsByAttribute('syncStatus', [status], currentUser)
                    .subscribe(
                      (events: any) => {
                        dataObject.events = _.filter(events, {
                          eventType: 'event-capture'
                        });
                        dataObject.eventsForTracker = _.filter(events, {
                          eventType: 'tracker-capture'
                        });
                        observer.next(dataObject);
                        observer.complete();
                      },
                      error => {
                        console.log('error : events');
                        console.log(JSON.stringify(error));
                        observer.error(error);
                      }
                    );
                },
                error => {
                  console.log('error : enrollment');
                  console.log(JSON.stringify(error));
                  observer.error(error);
                }
              );
          },
          error => {
            console.log('error : data values');
            console.log(JSON.stringify(error));
            observer.error(error);
          }
        );
    });
  }
}
