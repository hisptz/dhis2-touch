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
import { HttpClientProvider } from '../http-client/http-client';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { CurrentUser, DataStore } from '../../models';

/*
  Generated class for the DataStoreManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataStoreManagerProvider {
  resource: string;

  constructor(
    private httpCLientProvider: HttpClientProvider,
    private sqlLiteProvider: SqlLiteProvider
  ) {
    this.resource = 'dataStore';
  }

  getDataStoreFromServer(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      this.getDataStoreNameSpacesFromServer(currentUser).subscribe(
        nameSpacesKeysObject => {
          let nameSpaceKeys = [];
          let dataStoreData: DataStore[] = [];
          Object.keys(nameSpacesKeysObject).map(nameSpace => {
            nameSpacesKeysObject[nameSpace].map(key => {
              nameSpaceKeys = [...nameSpaceKeys, { nameSpace, key }];
            });
          });
          if (nameSpaceKeys.length == 0) {
            observer.next(dataStoreData);
            observer.complete();
          } else {
            for (const nameSpaceKey of nameSpaceKeys) {
              const { nameSpace, key } = nameSpaceKey;
              const id = `${nameSpace}_${key}`;
              const status = 'synced';
              this.getDataStoreByNameSpaceAndKeyFromServer(
                nameSpace,
                key,
                currentUser
              ).subscribe(
                data => {
                  dataStoreData = [
                    ...dataStoreData,
                    { id, key, nameSpace, data, status }
                  ];
                  if (dataStoreData.length === nameSpaceKeys.length) {
                    observer.next(dataStoreData);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                }
              );
            }
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getDataStoreNameSpacesFromServer(currentUser: CurrentUser): Observable<any> {
    const url = `/api/${this.resource}`;
    const nameSpacesKeysObject = {};
    return new Observable(observer => {
      this.httpCLientProvider.get(url, true, currentUser).subscribe(
        (nameSpaces: string[]) => {
          if (nameSpaces.length === 0) {
            observer.next(nameSpacesKeysObject);
            observer.complete();
          } else {
            for (const nameSpace of nameSpaces) {
              this.getDataStoreNameSpaceKeysFromServer(
                nameSpace,
                currentUser
              ).subscribe(
                keys => {
                  nameSpacesKeysObject[nameSpace] = keys;
                  if (
                    Object.keys(nameSpacesKeysObject).length ===
                    nameSpaces.length
                  ) {
                    observer.next(nameSpacesKeysObject);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                }
              );
            }
          }
        },
        () => {
          observer.next(nameSpacesKeysObject);
          observer.complete();
        }
      );
    });
  }

  getDataStoreNameSpaceKeysFromServer(
    nameSpace: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/api/${this.resource}/${nameSpace}`;
    return new Observable(observer => {
      this.httpCLientProvider.get(url, true, currentUser).subscribe(
        (keys: string[]) => {
          observer.next(keys);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getDataStoreByNameSpaceAndKeyFromServer(
    nameSpace: string,
    key: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/api/${this.resource}/${nameSpace}/${key}`;
    return new Observable(observer => {
      this.httpCLientProvider.get(url, true, currentUser).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  saveDataStoreDataFromServer(
    data: DataStore[],
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      if (data.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLiteProvider
          .insertBulkDataOnTable(
            this.resource,
            data,
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
      }
    });
  }

  uploadDataStoreToTheServer(data: DataStore[], currentUser: CurrentUser) {
    const unSyncedData = _.filter(data, (dataStore: DataStore) => {
      return dataStore.status === 'not-synced';
    });
    let failed = 0;
    let succeess = 0;
    const errorMessages = [];
    const successIds = [];
    const status = 'synced';
    return new Observable(observer => {
      if (unSyncedData && unSyncedData.length > 0) {
        _.map(unSyncedData, (dataStore: DataStore) => {
          const { id, data, key, nameSpace } = dataStore;
          const url = `/api/${this.resource}/${nameSpace}/${key}`;
          this.httpCLientProvider.post(url, data, currentUser).subscribe(
            () => {},
            error => {
              console.log(JSON.stringify({ error }));
              this.httpCLientProvider.put(url, data, currentUser).subscribe(
                () => {
                  succeess++;
                  successIds.push(id);
                  if (succeess + failed === unSyncedData.length) {
                    this.updateDataStoreByStatus(
                      successIds,
                      status,
                      unSyncedData,
                      currentUser
                    ).subscribe(
                      () => {
                        observer.next({
                          succeess,
                          failed,
                          errorMessages,
                          successIds
                        });
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                  }
                },
                error => {
                  failed++;
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
                  } else if (
                    error &&
                    error.response &&
                    error.response.conflicts
                  ) {
                    error.response.conflicts.map((conflict: any) => {
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
                  if (succeess + failed === unSyncedData.length) {
                    this.updateDataStoreByStatus(
                      successIds,
                      status,
                      unSyncedData,
                      currentUser
                    ).subscribe(
                      () => {
                        observer.next({
                          succeess,
                          failed,
                          errorMessages,
                          successIds
                        });
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                  }
                }
              );
            }
          );
        });
      } else {
        observer.next({ failed, succeess, errorMessages });
        observer.complete();
      }
    });
  }

  updateDataStoreByStatus(
    dataStoreIds: string[],
    status: string,
    dataStores: DataStore[],
    currentUser: CurrentUser
  ): Observable<any> {
    const data = _.map(
      _.filter(dataStores, (dataStore: DataStore) => {
        const { id } = dataStore;
        return _.indexOf(dataStoreIds, id) > -1;
      }),
      (dataStore: DataStore) => {
        return { ...dataStore, status: status };
      }
    );
    return new Observable(observer => {
      if (data && data.length > 0) {
        this.saveDataStoreDataFromServer(data, currentUser).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  getAllSavedDataStoreData(currentUser: CurrentUser): Observable<DataStore[]> {
    return new Observable(observer => {
      this.sqlLiteProvider
        .getAllDataFromTable(this.resource, currentUser.currentDatabase)
        .subscribe(
          (data: DataStore[]) => {
            observer.next(data);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
