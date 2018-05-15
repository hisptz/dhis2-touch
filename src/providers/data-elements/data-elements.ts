import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';

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
      'id,name,formName,aggregationType,categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]';
    let url = '/api/' + this.resource + '.json?paging=false&fields=' + fields;
    return new Observable(observer => {
      this.HttpClient.get(
        url,
        false,
        currentUser,
        this.resource,
        200
      ).subscribe(
        (response: any) => {
          console.log('Total found : ' + JSON.stringify(response));
          observer.next(response);
        },
        error => {
          observer.error(error);
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
        (dataElements: any) => {
          observer.next(
            this.getSortedListOfDataElements(dataSetDatElements, dataElements)
          );
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
        (dataElements: any) => {
          observer.next(dataElements);
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
   * @param dataSetDatElements
   * @param dataElements
   * @returns {Array}
   */
  getSortedListOfDataElements(dataSetDatElements, dataElements) {
    let sortedDataElements = [];
    let dataElementObject = {};
    dataElements.forEach((dataElement: any) => {
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
    dataSetDatElements.forEach(dataSetDatElement => {
      sortedDataElements.push(dataElementObject[dataSetDatElement.id]);
    });
    return sortedDataElements;
  }
}
