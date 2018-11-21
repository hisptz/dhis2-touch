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
import { Injectable } from '@angular/core';
import { ProgramsProvider } from '../programs/programs';
import { OrganisationUnitsProvider } from '../organisation-units/organisation-units';
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { TrackedEntityAttributeValuesProvider } from '../tracked-entity-attribute-values/tracked-entity-attribute-values';
import { TrackedEntityInstancesProvider } from '../tracked-entity-instances/tracked-entity-instances';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the TrackerCaptureProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackerCaptureProvider {
  constructor(
    private programsProvider: ProgramsProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private sqlLite: SqlLiteProvider,
    private trackedEntityInstancesProvider: TrackedEntityInstancesProvider,
    private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
    private httpClientProvider: HttpClientProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider
  ) {}

  /**
   *
   * @param trackedEntityInstancesId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityInstance(
    trackedEntityInstancesId,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.trackedEntityInstancesProvider
        .getTrackedEntityInstancesByAttribute(
          'trackedEntityInstance',
          [trackedEntityInstancesId],
          currentUser
        )
        .subscribe(
          (trackedEntityInstances: any) => {
            this.trackedEntityAttributeValuesProvider
              .getTrackedEntityAttributeValues(
                [trackedEntityInstancesId],
                currentUser
              )
              .subscribe(
                (attributeValues: any) => {
                  let attributeValuesObject = {};
                  if (attributeValues && attributeValues.length > 0) {
                    attributeValues.forEach((attributeValue: any) => {
                      delete attributeValue.id;
                      if (
                        !attributeValuesObject[
                          attributeValue.trackedEntityInstance
                        ]
                      ) {
                        attributeValuesObject[
                          attributeValue.trackedEntityInstance
                        ] = [];
                      }
                      attributeValuesObject[
                        attributeValue.trackedEntityInstance
                      ].push(attributeValue);
                    });
                    trackedEntityInstances.forEach(
                      (trackedEntityInstanceObject: any) => {
                        if (
                          attributeValuesObject[
                            trackedEntityInstanceObject.trackedEntityInstance
                          ]
                        ) {
                          trackedEntityInstanceObject['attributes'] =
                            attributeValuesObject[
                              trackedEntityInstanceObject.trackedEntityInstance
                            ];
                        } else {
                          trackedEntityInstanceObject['attributes'] = [];
                        }
                      }
                    );
                    observer.next(trackedEntityInstances[0]);
                    observer.complete();
                  }
                },
                error => {
                  observer.error({ message: error });
                }
              );
          },
          error => {
            observer.error({ message: error });
          }
        );
    });
  }

  /**
   *
   * @param status
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityInstanceByStatus(status, currentUser): Observable<any> {
    return new Observable(observer => {
      this.trackedEntityInstancesProvider
        .getTrackedEntityInstancesByAttribute(
          'syncStatus',
          [status],
          currentUser
        )
        .subscribe(
          (trackedEntityInstances: any) => {
            if (trackedEntityInstances && trackedEntityInstances.length > 0) {
              let trackedEntityInstancesIds = [];
              trackedEntityInstances.forEach((trackedEntityInstance: any) => {
                trackedEntityInstancesIds.push(trackedEntityInstance.id);
              });
              this.trackedEntityAttributeValuesProvider
                .getTrackedEntityAttributeValues(
                  trackedEntityInstancesIds,
                  currentUser
                )
                .subscribe(
                  (attributeValues: any) => {
                    let attributeValuesObject = {};
                    if (attributeValues && attributeValues.length > 0) {
                      attributeValues.forEach((attributeValue: any) => {
                        delete attributeValue.id;
                        if (
                          !attributeValuesObject[
                            attributeValue.trackedEntityInstance
                          ]
                        ) {
                          attributeValuesObject[
                            attributeValue.trackedEntityInstance
                          ] = [];
                        }
                        attributeValuesObject[
                          attributeValue.trackedEntityInstance
                        ].push(attributeValue);
                      });
                      trackedEntityInstances.forEach(
                        (trackedEntityInstanceObject: any) => {
                          if (
                            attributeValuesObject[
                              trackedEntityInstanceObject.trackedEntityInstance
                            ]
                          ) {
                            trackedEntityInstanceObject['attributes'] =
                              attributeValuesObject[
                                trackedEntityInstanceObject.trackedEntityInstance
                              ];
                          } else {
                            trackedEntityInstanceObject['attributes'] = [];
                          }
                        }
                      );
                    }
                    observer.next(trackedEntityInstances);
                    observer.complete();
                  },
                  error => {
                    observer.error({ message: error });
                  }
                );
            } else {
              observer.next([]);
              observer.complete();
            }
          },
          error => {
            observer.error({ message: error });
          }
        );
    });
  }

  getTrackedEntityRegistrationDesignForm(
    programId,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.programsProvider
        .getTrackerRegistrationForm(programId, currentUser)
        .subscribe(
          form => {
            observer.next(form);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityRegistration(programId, currentUser): Observable<any> {
    let programTrackedEntityAttributes = [];
    let programTrackedEntityAttributeIds = [];
    return new Observable(observer => {
      this.programsProvider
        .getProgramProgramTrackedEntityAttributes(programId, currentUser)
        .subscribe(
          (programTrackedEntityAttributesResponse: any) => {
            if (
              programTrackedEntityAttributesResponse &&
              programTrackedEntityAttributesResponse.length > 0
            ) {
              programTrackedEntityAttributesResponse.forEach(
                (programTrackedEntityAttribute: any) => {
                  if (programTrackedEntityAttribute.id.split('-').length > 1) {
                    programTrackedEntityAttribute.id = programTrackedEntityAttribute.id.split(
                      '-'
                    )[1];
                    programTrackedEntityAttributeIds.push(
                      programTrackedEntityAttribute.id
                    );
                    delete programTrackedEntityAttribute.programId;
                    programTrackedEntityAttribute.mandatory = JSON.parse(
                      programTrackedEntityAttribute.mandatory
                    );
                    programTrackedEntityAttribute.displayInList = JSON.parse(
                      programTrackedEntityAttribute.displayInList
                    );
                    programTrackedEntityAttribute.externalAccess = JSON.parse(
                      programTrackedEntityAttribute.externalAccess
                    );
                    programTrackedEntityAttributes.push(
                      programTrackedEntityAttribute
                    );
                  }
                }
              );

              programTrackedEntityAttributes.sort((a, b) => {
                return parseInt(a.sortOrder) - parseInt(b.sortOrder);
              });
              this.programsProvider
                .getTrackedEntityAttributes(
                  programTrackedEntityAttributeIds,
                  currentUser
                )
                .subscribe(
                  (trackedEntityAttributes: any) => {
                    programTrackedEntityAttributes = this.getMergedProgramTrackedEntityAttributesWithTrackedEntityAttributes(
                      programTrackedEntityAttributes,
                      trackedEntityAttributes
                    );
                    observer.next(programTrackedEntityAttributes);
                    observer.complete();
                  },
                  error => {
                    observer.error(error);
                  }
                );
            } else {
              observer.next(programTrackedEntityAttributes);
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param trackedEntityInstances
   * @param copiedTrackedEntityInstances
   * @param currentUser
   * @returns {Observable<any>}
   */
  uploadTrackedEntityInstancesToServer(
    trackedEntityInstances,
    copiedTrackedEntityInstances,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      let url = '/api/trackedEntityInstances';
      let trackedEntityInstanceIds = [];
      let success = 0,
        fail = 0;
      let errorMessages = [];
      trackedEntityInstances.forEach((trackedEntityInstance: any, index) => {
        delete trackedEntityInstance.id;
        delete trackedEntityInstance.orgUnitName;
        delete trackedEntityInstance.syncStatus;
        delete trackedEntityInstance.deleted;
        trackedEntityInstance.attributes.forEach((attribute: any) => {
          delete attribute.trackedEntityInstance;
          delete attribute.id;
        });
        this.httpClientProvider
          .post(url, trackedEntityInstance, currentUser)
          .subscribe(
            (response: any) => {
              trackedEntityInstanceIds.push(
                copiedTrackedEntityInstances[parseInt(index)]
                  .trackedEntityInstance
              );
              success++;
              if (success + fail == copiedTrackedEntityInstances.length) {
                this.trackedEntityInstancesProvider
                  .getTrackedEntityInstancesByAttribute(
                    'trackedEntityInstance',
                    trackedEntityInstanceIds,
                    currentUser
                  )
                  .subscribe(
                    (trackedEntityInstances: any) => {
                      this.trackedEntityInstancesProvider
                        .updateSavedTrackedEntityInstancesByStatus(
                          trackedEntityInstances,
                          currentUser,
                          'synced'
                        )
                        .subscribe(
                          () => {
                            observer.next({
                              trackedEntityInstanceIds: trackedEntityInstanceIds,
                              importSummaries: {
                                success: success,
                                fail: fail,
                                errorMessages: errorMessages
                              }
                            });
                            observer.complete();
                          },
                          error => {
                            observer.error({ message: error });
                          }
                        );
                    },
                    error => {
                      observer.error({ message: error });
                    }
                  );
              }
            },
            error => {
              fail++;
              if (
                error &&
                error.response &&
                error.response.importSummaries &&
                error.response.importSummaries.length > 0 &&
                error.response.importSummaries[0].description
              ) {
                let message = error.response.importSummaries[0].description;
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              } else if (error && error.response && error.response.conflicts) {
                error.response.conflicts.forEach((conflict: any) => {
                  let message = JSON.stringify(conflict);
                  if (errorMessages.indexOf(message) == -1) {
                    errorMessages.push(message);
                  }
                });
              } else if (error && error.httpStatusCode == 500) {
                let message = error.message;
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              } else if (
                error &&
                error.response &&
                error.response.description
              ) {
                let message = error.response.description;
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              } else {
                let message = JSON.stringify(error);
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              }
              if (success + fail == copiedTrackedEntityInstances.length) {
                this.trackedEntityInstancesProvider
                  .getTrackedEntityInstancesByAttribute(
                    'trackedEntityInstance',
                    trackedEntityInstanceIds,
                    currentUser
                  )
                  .subscribe(
                    (trackedEntityInstances: any) => {
                      this.trackedEntityInstancesProvider
                        .updateSavedTrackedEntityInstancesByStatus(
                          trackedEntityInstances,
                          currentUser,
                          'synced'
                        )
                        .subscribe(
                          () => {
                            observer.next({
                              trackedEntityInstanceIds: trackedEntityInstanceIds,
                              importSummaries: {
                                success: success,
                                fail: fail,
                                errorMessages: errorMessages
                              }
                            });
                            observer.complete();
                          },
                          error => {
                            observer.error({ message: error });
                          }
                        );
                    },
                    error => {
                      observer.error({ message: error });
                    }
                  );
              }
            }
          );
      });
    });
  }

  /**
   *
   * @param enrollments
   * @param currentUser
   * @returns {Observable<any>}
   */
  uploadEnrollments(enrollments, currentUser): Observable<any> {
    return new Observable(observer => {
      let success = 0,
        fail = 0;
      let url = '/api/enrollments';
      let enrollmentIds = [];
      if (enrollments && enrollments.length == 0) {
        observer.next();
        observer.complete();
      } else {
        enrollments.forEach((enrollment: any) => {
          enrollmentIds.push(enrollment.id);
          delete enrollment.syncStatus;
          delete enrollment.id;
          delete enrollment.events;
          this.httpClientProvider.post(url, enrollment, currentUser).subscribe(
            () => {
              success++;
              if (success + fail == enrollments.length) {
                this.enrollmentsProvider
                  .getSavedEnrollmentsByAttribute(
                    'id',
                    enrollmentIds,
                    currentUser
                  )
                  .subscribe(
                    (enrollments: any) => {
                      this.enrollmentsProvider
                        .updateEnrollmentsByStatus(
                          enrollments,
                          currentUser,
                          'synced'
                        )
                        .subscribe(
                          () => {
                            observer.next();
                            observer.complete();
                          },
                          error => {
                            observer.error(error);
                          }
                        );
                    },
                    error => {
                      observer.error(error);
                    }
                  );
              }
            },
            error => {
              fail++;
              if (success + fail == enrollments.length) {
                this.enrollmentsProvider
                  .getSavedEnrollmentsByAttribute(
                    'id',
                    enrollmentIds,
                    currentUser
                  )
                  .subscribe(
                    (enrollments: any) => {
                      this.enrollmentsProvider
                        .updateEnrollmentsByStatus(
                          enrollments,
                          currentUser,
                          'synced'
                        )
                        .subscribe(
                          () => {
                            observer.next();
                            observer.complete();
                          },
                          error => {
                            observer.error(error);
                          }
                        );
                    },
                    error => {
                      observer.error(error);
                    }
                  );
              }
            }
          );
        });
      }
    });
  }

  /**
   *
   * @param incidentDate
   * @param enrollmentDate
   * @param currentUser
   * @param trackedEntityInstance
   * @param syncStatus
   * @returns {Observable<any>}
   */
  saveTrackedEntityRegistration(
    incidentDate,
    enrollmentDate,
    currentUser,
    trackedEntityInstance,
    coordinate,
    syncStatus?
  ): Observable<any> {
    return new Observable(observer => {
      const currentProgram = this.programsProvider.lastSelectedProgram;
      const currentOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      if (!syncStatus) {
        syncStatus = 'not-synced';
      }
      if (
        currentOrgUnit &&
        currentOrgUnit.id &&
        currentProgram &&
        currentProgram.id &&
        currentProgram.trackedEntity
      ) {
        const trackedEntityId = currentProgram.trackedEntity.id;
        let payLoads = [];
        payLoads.push({
          resource: 'trackedEntityInstances',
          payLoad: this.trackedEntityInstancesProvider.getTrackedEntityInstancesPayLoad(
            trackedEntityId,
            currentOrgUnit.id,
            currentOrgUnit.name,
            syncStatus,
            trackedEntityInstance
          )
        });
        let payLoadsData = this.enrollmentsProvider.getEnrollmentsPayLoad(
          trackedEntityId,
          currentOrgUnit.id,
          currentOrgUnit.name,
          currentProgram.id,
          enrollmentDate,
          incidentDate,
          trackedEntityInstance,
          syncStatus
        );
        payLoadsData.forEach((payLoad: any) => {
          payLoad.coordinate = coordinate;
        });
        payLoads.push({
          resource: 'enrollments',
          payLoad: payLoadsData
        });
        let counter = 0;
        payLoads.forEach((payLoadObject: any) => {
          this.sqlLite
            .insertBulkDataOnTable(
              payLoadObject.resource,
              payLoadObject.payLoad,
              currentUser.currentDatabase
            )
            .subscribe(
              () => {
                counter++;
                if (counter == payLoads.length) {
                  observer.next();
                  observer.complete();
                }
              },
              error => {
                observer.error({ message: error });
              }
            );
        });
      } else {
        observer.error({ message: 'Failed to set OU and program' });
      }
    });
  }

  /**
   *
   * @param attributeToDisplay
   * @param trackedEntityInstances
   * @returns {Observable<any>}
   */
  getTableFormatResult(
    attributeToDisplay,
    trackedEntityInstances
  ): Observable<any> {
    let table = { headers: [], rows: [] };
    Object.keys(attributeToDisplay).forEach(key => {
      table.headers.push(attributeToDisplay[key]);
    });
    let mapperArray = this.getAttributesMapperForDisplay(trackedEntityInstances)
      .mapper;
    let trackedEntityInstancesIds = this.getAttributesMapperForDisplay(
      trackedEntityInstances
    ).trackedEntityInstancesIds;
    mapperArray.forEach((attributeMapper: any) => {
      let row = [];
      Object.keys(attributeToDisplay).forEach(key => {
        if (attributeMapper[key]) {
          row.push(attributeMapper[key]);
        } else {
          row.push('');
        }
      });
      table.rows.push(row);
    });
    return new Observable(observer => {
      observer.next({
        table: table,
        trackedEntityInstancesIds: trackedEntityInstancesIds
      });
      observer.complete();
    });
  }

  /**
   *
   * @param trackedEntityInstances
   * @returns {{mapper: Array; trackedEntityInstancesIds: Array}}
   */
  getAttributesMapperForDisplay(trackedEntityInstances) {
    let mapper = [];
    let trackedEntityInstancesIds = [];
    trackedEntityInstances.map((trackedEntityInstance: any) => {
      let attributeMapper = {};
      if (trackedEntityInstance.attributes) {
        trackedEntityInstance.attributes.map((attributeObject: any) => {
          attributeMapper[attributeObject.attribute] = attributeObject.value;
        });
      }
      mapper.push(attributeMapper);
      trackedEntityInstancesIds.push(trackedEntityInstance.id);
    });
    return {
      mapper: mapper,
      trackedEntityInstancesIds: trackedEntityInstancesIds
    };
  }

  /**
   *
   * @param programTrackedEntityAttributes
   * @param trackedEntityAttributes
   * @returns {Array}
   */
  getMergedProgramTrackedEntityAttributesWithTrackedEntityAttributes(
    programTrackedEntityAttributes,
    trackedEntityAttributes
  ) {
    let trackedEntityAttributesObject = {};
    let mergedResults = [];
    if (trackedEntityAttributes && trackedEntityAttributes.length > 0) {
      trackedEntityAttributes.forEach((object: any) => {
        trackedEntityAttributesObject[object.programTrackedEntityAttributeId] =
          object.trackedEntityAttribute;
      });
    }
    programTrackedEntityAttributes.forEach(
      (programTrackedEntityAttribute: any) => {
        if (trackedEntityAttributesObject[programTrackedEntityAttribute.id]) {
          programTrackedEntityAttribute['trackedEntityAttribute'] =
            trackedEntityAttributesObject[programTrackedEntityAttribute.id];
          mergedResults.push(programTrackedEntityAttribute);
        }
      }
    );
    return mergedResults;
  }

  /**
   *
   * @param programId
   * @param orgUnitId
   * @param currentUser
   * @returns {Observable<any>}
   */
  loadTrackedEntityInstancesList(
    programId,
    orgUnitId,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.enrollmentsProvider
        .getSavedEnrollments(orgUnitId, programId, currentUser)
        .subscribe(
          (enrollments: any) => {
            let trackedEntityInstanceIds = [];
            enrollments.forEach((enrollment: any) => {
              trackedEntityInstanceIds.push(enrollment.trackedEntityInstance);
            });
            this.trackedEntityInstancesProvider
              .getTrackedEntityInstancesByAttribute(
                'trackedEntityInstance',
                trackedEntityInstanceIds,
                currentUser
              )
              .subscribe(
                (trackedEntityInstances: any) => {
                  this.trackedEntityAttributeValuesProvider
                    .getTrackedEntityAttributeValues(
                      trackedEntityInstanceIds,
                      currentUser
                    )
                    .subscribe(
                      (attributeValues: any) => {
                        let attributeValuesObject = {};
                        if (attributeValues && attributeValues.length > 0) {
                          attributeValues.forEach((attributeValue: any) => {
                            delete attributeValue.id;
                            if (
                              !attributeValuesObject[
                                attributeValue.trackedEntityInstance
                              ]
                            ) {
                              attributeValuesObject[
                                attributeValue.trackedEntityInstance
                              ] = [];
                            }
                            attributeValuesObject[
                              attributeValue.trackedEntityInstance
                            ].push(attributeValue);
                          });
                          trackedEntityInstances.forEach(
                            (trackedEntityInstanceObject: any) => {
                              if (
                                attributeValuesObject[
                                  trackedEntityInstanceObject
                                    .trackedEntityInstance
                                ]
                              ) {
                                trackedEntityInstanceObject['attributes'] =
                                  attributeValuesObject[
                                    trackedEntityInstanceObject.trackedEntityInstance
                                  ];
                              } else {
                                trackedEntityInstanceObject['attributes'] = [];
                              }
                            }
                          );
                        }
                        observer.next(trackedEntityInstances.reverse());
                        observer.complete();
                      },
                      error => {
                        observer.error({ message: error });
                      }
                    );
                },
                error => {
                  observer.error({ message: error });
                }
              );
          },
          error => {
            observer.error({ message: error });
          }
        );
    });
  }

  /**
   *
   * @param trackedEntityInstanceId
   * @param currentUser
   * @returns {Observable<any>}
   */
  deleteTrackedEntityInstance(
    trackedEntityInstanceId,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .deleteFromTableByAttribute(
          'trackedEntityInstances',
          'trackedEntityInstance',
          trackedEntityInstanceId,
          currentUser.currentDatabase
        )
        .subscribe(
          () => {
            this.sqlLite
              .deleteFromTableByAttribute(
                'trackedEntityAttributeValues',
                'trackedEntityInstance',
                trackedEntityInstanceId,
                currentUser.currentDatabase
              )
              .subscribe(
                () => {
                  this.sqlLite
                    .deleteFromTableByAttribute(
                      'enrollments',
                      'trackedEntityInstance',
                      trackedEntityInstanceId,
                      currentUser.currentDatabase
                    )
                    .subscribe(
                      () => {
                        this.sqlLite
                          .deleteFromTableByAttribute(
                            'events',
                            'trackedEntityInstance',
                            trackedEntityInstanceId,
                            currentUser.currentDatabase
                          )
                          .subscribe(
                            () => {
                              observer.next();
                              observer.complete();
                            },
                            error => {
                              observer.error(error);
                            }
                          );
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                },
                error => {
                  observer.error(error);
                }
              );
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  deleteAllTrackedEntityInstances(currentUser): Observable<any> {
    return new Observable(observer => {
      this.trackedEntityInstancesProvider
        .getAllTrackedEntityInstances(currentUser)
        .subscribe(
          (trackedEntityInstances: any) => {
            let counter = 0;
            trackedEntityInstances.forEach((trackedEntityInstance: any) => {
              this.sqlLite
                .deleteFromTableByAttribute(
                  'events',
                  'trackedEntityInstance',
                  trackedEntityInstance.id,
                  currentUser.currentDatabase
                )
                .subscribe(
                  () => {
                    counter++;
                    if (counter == trackedEntityInstances.length) {
                      this.sqlLite
                        .dropTable(
                          'trackedEntityInstances',
                          currentUser.currentDatabase
                        )
                        .subscribe(
                          () => {
                            this.sqlLite
                              .dropTable(
                                'enrollments',
                                currentUser.currentDatabase
                              )
                              .subscribe(
                                () => {
                                  this.sqlLite
                                    .dropTable(
                                      'trackedEntityAttributeValues',
                                      currentUser.currentDatabase
                                    )
                                    .subscribe(
                                      () => {
                                        observer.next();
                                        observer.complete();
                                      },
                                      error => {
                                        observer.error(error);
                                      }
                                    );
                                },
                                error => {
                                  observer.error(error);
                                }
                              );
                          },
                          error => {
                            observer.error(error);
                          }
                        );
                    }
                  },
                  error => {
                    observer.error(error);
                  }
                );
            });
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
