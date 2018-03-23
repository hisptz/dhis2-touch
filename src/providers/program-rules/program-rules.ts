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

  // programRules programRuleActions programRuleVariables

  downloadingProgramRules(currentUser: CurrentUser): Observable<any> {
    const resource = 'programRules';
    const fields =
      'id,name,displayName,description,condition,program[id],programRuleActions[id]';
    return new Observable(observer => {});
  }

  downloadingProgramRuleActions(currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleActions';
    const fields =
      'id,data,content,programRuleActionType,location,programRule[id]';
    return new Observable(observer => {});
  }

  downloadingProgramRuleVariables(currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleVariables';
    const fields =
      'id,name,displayName,programRuleVariableSourceType,program[id],dataElement[id]';
    return new Observable(observer => {});
  }

  savingProgramRules(data, currentUser: CurrentUser): Observable<any> {
    const resource = 'programRules';
    return new Observable(observer => {});
  }

  savingProgramRuleActions(data, currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleActions';
    return new Observable(observer => {});
  }

  savingProgramRuleVariables(data, currentUser: CurrentUser): Observable<any> {
    const resource = 'programRuleVariables';
    return new Observable(observer => {});
  }
}
