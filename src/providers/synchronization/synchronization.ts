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

  startSynchronization(currentUser) {
    const defaultSettings = this.settingsProvider.getDefaultSettings();
    this.settingsProvider.getSettingsForTheApp(currentUser).subscribe(
      (appSettings: any) => {
        const synchronizationSettings =
          appSettings && appSettings.synchronization
            ? appSettings.synchronization
            : defaultSettings.synchronization;
        if (this.subscription) {
          clearInterval(this.subscription);
        }
        console.log('Updating sync process');
        if (synchronizationSettings.isAutoSync) {
          this.subscription = setInterval(() => {
            this.loadingDataToUpload(currentUser);
            console.log('Starting loading data');
          }, synchronizationSettings.time);
        }
      },
      error => {
        console.log;
        JSON.stringify(error);
      }
    );
  }

  loadingDataToUpload(currentUser) {
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
                      events.forEach((event: any) => {
                        if (
                          event &&
                          event.eventType &&
                          event.eventType == 'event-capture'
                        ) {
                          dataObject.events.push(event);
                        } else {
                          dataObject.eventsForTracker.push(event);
                        }
                      });
                      if (this.isThereAnyOfflineData(dataObject)) {
                        console.log('Starting uploading process');
                        this.uploadData(dataObject, currentUser);
                      }
                    },
                    error => {
                      console.log('error : events');
                      console.log(JSON.stringify(error));
                    }
                  );
              },
              error => {
                console.log('error : enrollment');
                console.log(JSON.stringify(error));
              }
            );
        },
        error => {
          console.log('error : data values');
          console.log(JSON.stringify(error));
        }
      );
  }

  isThereAnyOfflineData(dataObject) {
    let result = false;
    for (let item of Object.keys(dataObject)) {
      if (dataObject[item].length > 0) {
        result = true;
      }
    }
    return result;
  }

  uploadData(dataObject, currentUser) {
    for (let item of Object.keys(dataObject)) {
      if (dataObject[item].length > 0 && item == 'dataValues') {
        let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(
          dataObject[item]
        );
        this.dataValuesProvider
          .uploadDataValues(formattedDataValues, dataObject[item], currentUser)
          .subscribe(
            importSummaries => {
              console.log(
                'importSummaries : ' +
                  item +
                  ' : ' +
                  JSON.stringify(importSummaries)
              );
            },
            error => {
              console.log('Error ' + JSON.stringify(error));
            }
          );
      } else if (dataObject[item].length > 0 && item == 'Enrollments') {
        this.trackerCaptureProvider
          .uploadTrackedEntityInstancesToServer(
            dataObject[item],
            dataObject[item],
            currentUser
          )
          .subscribe(
            (response: any) => {
              console.log(
                'importSummaries : ' +
                  item +
                  ' : ' +
                  JSON.stringify(response.importSummaries)
              );
              this.enrollmentsProvider
                .getSavedEnrollmentsByAttribute(
                  'trackedEntityInstance',
                  response.trackedEntityInstanceIds,
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
                                console.log(
                                  'importSummaries : ' +
                                    item +
                                    ' : ' +
                                    JSON.stringify(importSummaries)
                                );
                              },
                              error => {
                                console.log('Error ' + JSON.stringify(error));
                              }
                            );
                        },
                        error => {
                          console.log('Error ' + JSON.stringify(error));
                        }
                      );
                  },
                  error => {
                    console.log('Error ' + JSON.stringify(error));
                  }
                );
            },
            error => {
              console.log('Error ' + JSON.stringify(error));
            }
          );
      } else if (dataObject[item].length > 0 && item == 'eventsForTracker') {
        this.eventCaptureFormProvider
          .uploadEventsToSever(dataObject[item], currentUser)
          .subscribe(
            importSummaries => {
              console.log(
                'importSummaries : ' +
                  item +
                  ' : ' +
                  JSON.stringify(importSummaries)
              );
            },
            error => {
              console.log('Error ' + JSON.stringify(error));
            }
          );
      } else if (dataObject[item].length > 0 && item == 'events') {
        this.eventCaptureFormProvider
          .uploadEventsToSever(dataObject[item], currentUser)
          .subscribe(
            importSummaries => {
              console.log(
                'importSummaries : ' +
                  item +
                  ' : ' +
                  JSON.stringify(importSummaries)
              );
            },
            error => {
              console.log('Error ' + JSON.stringify(error));
            }
          );
      }
    }
  }
}
