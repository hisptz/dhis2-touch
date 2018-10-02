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
import 'rxjs/add/operator/map';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/*
  Generated class for the ProgramStageSectionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProgramStageSectionsProvider {
  public resource: string;

  constructor(
    private sqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'programStageSections';
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadProgramsStageSectionsFromServer(currentUser): Observable<any> {
    let fields =
      'id,name,displayName,sortOrder,programStage[id],attributeValues[value,attribute[name]],translations[*],programStageDataElements[dataElement[id]],dataElements[id]';
    let url = '/api/' + this.resource + '.json?paging=false&fields=' + fields;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { programStageSections } = response;
          observer.next(programStageSections);
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param programsStageSections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveProgramsStageSectionsFromServer(
    programsStageSections,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      if (programsStageSections.length == 0) {
        observer.next();
        observer.complete();
      } else {
        programsStageSections = this.getPreparedProgramStageSectionForSaving(
          programsStageSections
        );
        this.sqlLite
          .insertBulkDataOnTable(
            this.resource,
            programsStageSections,
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

  /**
   *
   * @param programsStageSections
   * @returns {any}
   */
  getPreparedProgramStageSectionForSaving(programsStageSections) {
    programsStageSections.map((programsStageSection: any) => {
      if (
        programsStageSection.programStage &&
        programsStageSection.programStage.id
      ) {
        programsStageSection['programStageId'] =
          programsStageSection.programStage.id;
      }
      if (programsStageSection.programStageDataElements) {
        programsStageSection['dataElements'] = _.map(
          programsStageSection.programStageDataElements,
          (programStageDataElement: any) => {
            return { id: programStageDataElement.dataElement.id };
          }
        );
        delete programsStageSection.programStageDataElements;
      }
    });
    return programsStageSections;
  }

  /**
   *
   * @param programStageSectionIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getProgramStageSectionsByIds(
    programStageSectionIds,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      if (programStageSectionIds.length == 0) {
        observer.next([]);
        observer.complete();
      } else {
        this.sqlLite
          .getDataFromTableByAttributes(
            this.resource,
            'id',
            programStageSectionIds,
            currentUser.currentDatabase
          )
          .subscribe(
            (programStageSections: any) => {
              observer.next(programStageSections);
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
