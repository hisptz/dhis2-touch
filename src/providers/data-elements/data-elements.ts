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
 */
import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models';
import * as _ from 'lodash';

/*
  Generated class for the DataElementsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataElementsProvider {
  resource: string;

  constructor(
    private SqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'dataElements';
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadDataElementsFromServer(currentUser): Observable<any> {
    let fields =
      'id,name,formName,aggregationType,categoryCombo[id],displayName,description,valueType,optionSet[name,options[name,id,code]]';
    let url = '/api/' + this.resource + '.json?fields=' + fields;
    return new Observable(observer => {
      this.HttpClient.get(
        url,
        false,
        currentUser,
        this.resource,
        200
      ).subscribe(
        (response: any) => {
          const { dataElements } = response;
          observer.next(dataElements);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  downloadDataElementCatogoryCombos(currentUser: CurrentUser): Observable<any> {
    const resource = 'categoryCombos';
    const fields = 'id,name,categoryOptionCombos[id,name]';
    const url = `/api/${resource}.json?paging=false&fields=${fields}`;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { categoryCombos } = response;
          observer.next(categoryCombos);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  saveDataElementCatogoryCombos(
    categoryCombos,
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'categoryCombos';
    return new Observable(observer => {
      if (categoryCombos.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          categoryCombos,
          currentUser.currentDatabase
        ).subscribe(
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

  getDataElementCatogoryCombos(currentUser: CurrentUser): Observable<any> {
    const resource = 'categoryCombos';
    return new Observable(observer => {
      this.SqlLite.getAllDataFromTable(
        resource,
        currentUser.currentDatabase
      ).subscribe(
        categoryCombos => {
          observer.next(categoryCombos);
          observer.complete();
        },
        () => {
          observer.next([]);
          observer.complete();
        }
      );
    });
  }

  /**
   *
   * @param dataElements
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataElementsFromServer(dataElements, currentUser): Observable<any> {
    return new Observable(observer => {
      if (dataElements.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          this.resource,
          dataElements,
          currentUser.currentDatabase
        ).subscribe(
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

  /**
   *
   * @param dataSetDatElements
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataElementsByIdsForDataEntry(
    dataSetDatElements,
    currentUser
  ): Observable<any> {
    let attributeKey = 'id';
    let dataElementIds = [];
    dataSetDatElements.forEach((dataSetDatElement: any) => {
      dataElementIds.push(dataSetDatElement.id);
    });
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        this.resource,
        attributeKey,
        dataElementIds,
        currentUser.currentDatabase
      ).subscribe(
        (dataElementsResponse: any) => {
          this.getDataElementsWithCategoryCombos(
            dataElementsResponse,
            currentUser
          ).subscribe(dataElements => {
            observer.next(
              this.getSortedListOfDataElements(dataSetDatElements, dataElements)
            );
            observer.complete();
          });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataElementIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataElementsByIdsForEvents(dataElementIds, currentUser): Observable<any> {
    let attributeKey = 'id';
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        this.resource,
        attributeKey,
        dataElementIds,
        currentUser.currentDatabase
      ).subscribe(
        (dataElementsResponse: any) => {
          this.getDataElementsWithCategoryCombos(
            dataElementsResponse,
            currentUser
          ).subscribe(dataElements => {
            observer.next(dataElements);
            observer.complete();
          });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getDataElementsWithCategoryCombos(
    dataElements,
    currentUser: CurrentUser
  ): Observable<any> {
    let formattedDataElements = [];
    return new Observable(observer => {
      this.getDataElementCatogoryCombos(currentUser).subscribe(
        (categoryCombosResponse: any) => {
          if (categoryCombosResponse && categoryCombosResponse.length > 0) {
            const categoryCombosObject = _.keyBy(categoryCombosResponse, 'id');
            formattedDataElements = _.flatMapDeep(
              _.map(dataElements, dataElement => {
                if (
                  dataElement &&
                  dataElement.categoryCombo &&
                  dataElement.categoryCombo.id
                ) {
                  const id = dataElement.categoryCombo.id;
                  if (categoryCombosObject && categoryCombosObject[id]) {
                    const categoryCombo = categoryCombosObject[id];
                    return { ...dataElement, categoryCombo };
                  } else {
                    return dataElement;
                  }
                } else {
                  return dataElement;
                }
              })
            );
          } else {
            formattedDataElements = _.flatMapDeep([
              ...formattedDataElements,
              dataElements
            ]);
          }
          observer.next(formattedDataElements);
          observer.complete();
        }
      );
    });
  }

  /**
   *
   * @param dataSetDatElements
   * @param dataElements
   * @returns {Array}
   */
  getSortedListOfDataElements(dataSetDatElements, dataElements) {
    let sortedDataElements = [];
    let dataElementObject = {};
    dataElements.map((dataElement: any) => {
      dataElementObject[dataElement.id] = dataElement;
    });
    dataSetDatElements.sort((a, b) => {
      if (a.sortOrder > b.sortOrder) {
        return 1;
      }
      if (a.sortOrder < b.sortOrder) {
        return -1;
      }
      return 0;
    });
    dataSetDatElements.map(dataSetDatElement => {
      sortedDataElements.push(dataElementObject[dataSetDatElement.id]);
    });
    return sortedDataElements;
  }
}
