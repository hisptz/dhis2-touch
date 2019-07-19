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
import { DEFAULT_APP_METADATA } from '../../constants';

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
    return new Observable(observer => {
      this.getDataElementByProgramIdsOrDataSetIds(currentUser)
        .then((response: any) => {
          const { dataElements, error } = response;
          if (error && dataElements && dataElements.length === 0) {
            observer.error(error);
          } else {
            observer.next(dataElements);
            observer.complete();
          }
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getDataElementByProgramIdsOrDataSetIds(currentUser: CurrentUser) {
    const dataElementsIds = await this.getDataElementIds(currentUser);
    const fields = `fields=id,name,formName,aggregationType,categoryCombo[id],displayName,description,valueType,optionSet[name,options[name,id,code]]`;
    const resource = 'dataElements';
    const url = `/api/${resource}.json?paging=false&${fields}`;
    const dataElementResponse = [];
    let errorResponse = null;
    if (dataElementsIds && dataElementsIds.length > 0) {
      for (const dataElementArray of _.chunk(dataElementsIds, 500)) {
        const filter = `filter=id:in:[${dataElementArray.join(',')}]`;
        const apiUrl = `${url}&${filter}`;
        try {
          const response: any = await this.HttpClient.get(
            apiUrl,
            true,
            currentUser
          ).toPromise();
          const { dataElements } = response;
          dataElementResponse.push(dataElements);
        } catch (error) {
          errorResponse = error;
        }
      }
    } else {
      try {
        const response: any = await this.HttpClient.get(
          url,
          true,
          currentUser
        ).toPromise();
        const { dataElements } = response;
        dataElementResponse.push(dataElements);
      } catch (error) {
        errorResponse = error;
      }
    }
    return {
      dataElements: _.flattenDeep(dataElementResponse),
      error: errorResponse
    };
  }

  async getDataElementIds(currentUser: CurrentUser) {
    const dataSetMetadata = DEFAULT_APP_METADATA.dataSets;
    const programMetadata = DEFAULT_APP_METADATA.programs;
    const dataElementsIds = [];
    if (
      dataSetMetadata &&
      dataSetMetadata.defaultIds &&
      dataSetMetadata.defaultIds.length > 0
    ) {
      const uids = await this.getDataSetDataElementIds(
        currentUser,
        dataSetMetadata.defaultIds
      );
      dataElementsIds.push(uids);
    }
    if (
      programMetadata &&
      programMetadata.defaultIds &&
      programMetadata.defaultIds.length > 0
    ) {
      const uids = await this.getProgramDataElementIds(
        currentUser,
        programMetadata.defaultIds
      );
      dataElementsIds.push(uids);
    }
    return _.uniq(_.flattenDeep(dataElementsIds));
  }

  async getDataSetDataElementIds(
    currentUser: CurrentUser,
    dataSetIds: string[]
  ) {
    let dataElementIds = [];
    try {
      const filter = `filter=id:in:[${dataSetIds.join(',')}]`;
      const fields = `fields=dataSetElements[dataElement[id]],dataElements[id]`;
      const url = `/api/dataSets.json?paging=false&${fields}&${filter}`;
      const dataSetResponse: any = await this.HttpClient.get(
        url,
        true,
        currentUser
      ).toPromise();
      const { dataSets } = dataSetResponse;
      dataElementIds = _.flattenDeep(
        _.map(dataSets, (dataSet: any) => {
          const { dataSetElements, dataElements } = dataSet;
          return dataElements
            ? _.map(dataElements, (dataElement: any) => dataElement.id)
            : _.map(
                dataSetElements,
                (dataSetElement: any) => dataSetElement.dataElement.id
              );
        })
      );
    } catch (error) {
      console.log(JSON.stringify({ type: 'Get dataset de', error }));
    }
    return dataElementIds;
  }

  async getProgramDataElementIds(
    currentUser: CurrentUser,
    programIds: string[]
  ) {
    let dataElementIds = [];
    try {
      const filter = `filter=id:in:[${programIds.join(',')}]`;
      const fields = `fields=programStages[programStageDataElements[dataElement`;
      const url = `/api/programs.json?paging=false&${fields}&${filter}`;
      const programResponse: any = await this.HttpClient.get(
        url,
        true,
        currentUser
      ).toPromise();
      const { programs } = programResponse;
      dataElementIds = _.flattenDeep(
        _.map(programs, (program: any) => {
          const { programStages } = program;
          return _.map(programStages, (programStage: any) => {
            const { programStageDataElements } = programStage;
            return _.map(
              programStageDataElements,
              (programStageDataElement: any) =>
                programStageDataElement.dataElement.id
            );
          });
        })
      );
    } catch (error) {
      console.log(JSON.stringify({ type: 'Get program de', error }));
    }
    return dataElementIds;
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
