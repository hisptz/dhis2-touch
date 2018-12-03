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
    return new Observable(observer => {
      this.httpCLientProvider.get(url, true, currentUser).subscribe(
        (nameSpaces: string[]) => {
          const nameSpacesKeysObject = {};
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
        error => {
          observer.error(error);
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

  getSavedDataStoreData(): Observable<any> {
    return new Observable(observer => {});
  }
}
