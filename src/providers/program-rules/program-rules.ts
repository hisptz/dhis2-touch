import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CurrentUser } from '../../models/currentUser';

/*
  Generated class for the ProgramRulesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProgramRulesProvider {
  constructor(
    private sqlLite: SqlLiteProvider,
    private httpClientProvider: HttpClientProvider
  ) {}

  downloadingProgramRules(currentUser: CurrentUser): Observable<any> {
    const resource = 'programRules';
    const fields =
      'id,name,displayName,description,condition,program[id],programRuleActions[id]';
    const url = '/api/' + resource + '.json?paging=false&fields=' + fields;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { programRules } = response;
          observer.next(programRules);
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  downloadingProgramRuleActions(currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleActions';
    const fields =
      'id,data,content,programRuleActionType,location,programRule[id]';
    const url = '/api/' + resource + '.json?paging=false&fields=' + fields;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { programRuleActions } = response;
          observer.next(programRuleActions);
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  downloadingProgramRuleVariables(currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleVariables';
    const fields =
      'id,name,displayName,programRuleVariableSourceType,program[id],dataElement[id]';
    const url = '/api/' + resource + '.json?paging=false&fields=' + fields;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { programRuleVariables } = response;
          observer.next(programRuleVariables);
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  savingProgramRules(data, currentUser: CurrentUser): Observable<any> {
    const resource = 'programRules';
    return new Observable(observer => {
      this.sqlLite
        .insertBulkDataOnTable(resource, data, currentUser.currentDatabase)
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error();
          }
        );
    });
  }

  savingProgramRuleActions(data, currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleActions';
    return new Observable(observer => {
      this.sqlLite
        .insertBulkDataOnTable(resource, data, currentUser.currentDatabase)
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error();
          }
        );
    });
  }

  savingProgramRuleVariables(data, currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleVariables';
    return new Observable(observer => {
      this.sqlLite
        .insertBulkDataOnTable(resource, data, currentUser.currentDatabase)
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error();
          }
        );
    });
  }
}
