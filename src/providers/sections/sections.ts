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
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_APP_METADATA } from '../../constants';

/*
  Generated class for the SectionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SectionsProvider {
  resource: string;

  constructor(
    private SqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'sections';
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadSectionsFromServer(currentUser): Observable<any> {
    const fields =
      'fields=id,name,code,description,sortOrder,indicators[id],dataElements[id]';
    const dataSetMetadata = DEFAULT_APP_METADATA['dataSets']
      ? DEFAULT_APP_METADATA['dataSets']
      : undefined;
    const { defaultIds } = dataSetMetadata;
    const filter =
      defaultIds && defaultIds.length > 0
        ? `filter=dataSet.id:in:[${defaultIds.join(',')}]`
        : ``;
    const url = `/api/${this.resource}.json?paging=false&${fields}&${filter}`;
    const pageSize = defaultIds && defaultIds.length > 0 ? 10 : 15;
    return new Observable(observer => {
      this.HttpClient.get(
        url,
        true,
        currentUser,
        this.resource,
        pageSize
      ).subscribe(
        (response: any) => {
          const sections = response[this.resource];
          observer.next(sections);
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
   * @param sectionIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSectionByIds(sectionIds, currentUser): Observable<any> {
    let attributeKey = 'id';
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        this.resource,
        attributeKey,
        sectionIds,
        currentUser.currentDatabase
      ).subscribe(
        (sections: any) => {
          let count = 0;
          sections.forEach((section: any) => {
            this.getSectionDataElements(section.id, currentUser).subscribe(
              (sectionDataElements: any) => {
                section['dataElementIds'] = sectionDataElements;
                count++;
                if (count == sections.length) {
                  observer.next(sections);
                  observer.complete();
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

  /**
   *
   * @param sectionId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSectionDataElements(sectionId, currentUser): Observable<any> {
    let attributeKey = 'id';
    let attributeArray = [sectionId];
    let sectionDataElements = [];
    const resource = 'sectionDataElements';
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        resource,
        attributeKey,
        attributeArray,
        currentUser.currentDatabase
      ).subscribe(
        (sectionDataElementsResponse: any) => {
          if (
            sectionDataElementsResponse &&
            sectionDataElementsResponse.length > 0
          ) {
            let counter = 0;
            sectionDataElementsResponse[0].dataElementIds.map(
              (dataElementId: string) => {
                sectionDataElements = _.concat(sectionDataElements, {
                  id: dataElementId,
                  sortOrder: counter
                });
                counter++;
              }
            );
          }
          observer.next(sectionDataElements);
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
   * @param sections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveSectionsFromServer(sections, currentUser): Observable<any> {
    return new Observable(observer => {
      if (sections.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          this.resource,
          sections,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            this.saveSectionDataElements(sections, currentUser).subscribe(
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
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveSectionDataElements(sections, currentUser): Observable<any> {
    let sectionDataElements = [];
    const resource = 'sectionDataElements';
    sections.map((section: any) => {
      if (section.dataElements && section.dataElements.length > 0) {
        sectionDataElements = _.concat(sectionDataElements, {
          id: section.id,
          dataElementIds: _.map(section.dataElements, (dataElement: any) => {
            return dataElement.id;
          })
        });
      }
    });
    return new Observable(observer => {
      if (sectionDataElements.length == 0) {
        this.saveSectionIndicators(sections, currentUser).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          sectionDataElements,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            this.saveSectionIndicators(sections, currentUser).subscribe(
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
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveSectionIndicators(sections, currentUser): Observable<any> {
    let sectionIndicators = [];
    const resource = 'sectionIndicators';
    sections.map((section: any) => {
      if (section.indicators && section.indicators.length > 0) {
        sectionIndicators = _.concat(sectionIndicators, {
          id: section.id,
          indicatorIds: _.map(section.indicators, (indicator: any) => {
            return indicator.id;
          })
        });
      }
    });
    return new Observable(observer => {
      if (sectionIndicators.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          sectionIndicators,
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
}
