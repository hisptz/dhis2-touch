import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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
    public http: Http,
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
    let url =
      '/api/25/' + this.resource + '.json?paging=false&fields=' + fields;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
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
