import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';
import { DataValuesProvider } from '../data-values/data-values';
import { TrackerCaptureProvider } from '../tracker-capture/tracker-capture';
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { EventCaptureFormProvider } from '../event-capture-form/event-capture-form';
import * as _ from 'lodash';
/*
  Generated class for the SynchronizationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SynchronizationProvider {
  constructor(
    private dataValuesProvider: DataValuesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private user: UserProvider
  ) {}

  startSynchronization(currentUser) {
    setInterval(() => {
      console.log('Starting sync');
      this.loadingDataToUpload(currentUser);
    }, 10000);
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
                      //upload data
                      this.uploadData(dataObject, currentUser);
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

  uploadData(dataObject, currentUser) {
    for (let item of Object.keys(dataObject)) {
      console.log('item : ' + item + dataObject[item].length);
      if (dataObject[item].length > 0 && item == 'dataValues') {
        let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(
          dataObject['dataValues']
        );
        this.dataValuesProvider
          .uploadDataValues(
            formattedDataValues,
            dataObject['dataValues'],
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
      } else if (dataObject[item].length > 0 && item == 'Enrollments') {
        this.trackerCaptureProvider
          .uploadTrackedEntityInstancesToServer(
            dataObject['Enrollments'],
            dataObject['Enrollments'],
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
          .uploadEventsToSever(dataObject['eventsForTracker'], currentUser)
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
          .uploadEventsToSever(dataObject['events'], currentUser)
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
