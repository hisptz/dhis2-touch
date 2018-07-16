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

  evaluateProgramRules(programSkipLogicMetadata, dataObject): Observable<any> {
    return new Observable(observer => {
      const { programRules } = programSkipLogicMetadata;
      const { programRulesVariables } = programSkipLogicMetadata;
      const dataValuesObject = this.getDeducedDataValuesForEvaluation(
        dataObject
      );
      console.log('dataValuesObject : ' + JSON.stringify(dataValuesObject));
      programRules.map(programRule => {
        const { condition, programRuleActions } = programRule;
        programRuleActions.map(programRuleAction => {
          if (programRuleAction && programRuleAction.id) {
            const id = programRuleAction.id;
            const action = _.find(programSkipLogicMetadata.programRuleActions, {
              id: id
            });
            if (action && action.id) {
              const {
                programRuleActionType,
                dataElement,
                trackedEntityAttribute,
                content,
                data
              } = action;
              let evalCondition = condition;
              let evalData;
              const actiondataElementAttributeId =
                dataElement && dataElement.id
                  ? dataElement.id
                  : trackedEntityAttribute && trackedEntityAttribute.id
                    ? trackedEntityAttribute.id
                    : '';
              console.log(
                'actiondataElementAttributeId : ' + actiondataElementAttributeId
              );
              console.log(
                'programRuleActionType : ' +
                  JSON.stringify(programRuleActionType)
              );
              console.log('dataElement : ' + JSON.stringify(dataElement));
              console.log(
                'trackedEntityAttribute : ' +
                  JSON.stringify(trackedEntityAttribute)
              );
              console.log('content : ' + JSON.stringify(content));
              console.log('data : ' + JSON.stringify(data));
            }
          }
        });
        console.log('');
        console.log('');
      });
      // console.log('programRules : ' + JSON.stringify(programRules));
      // console.log('programRuleActions : ' + JSON.stringify(programRuleActions));
      // console.log(
      //   'programRulesVariables : ' + JSON.stringify(programRulesVariables)
      // );
      // console.log('dataObject : ' + JSON.stringify(dataObject));
      observer.next({ data: 'data' });
      observer.complete();
    });
  }

  getDeducedDataValuesForEvaluation(dataObject) {
    let dataValuesObject = {};
    Object.keys(dataObject).map(key => {
      const id = key.split('-')[0];
      const dataValue = dataObject[key];
      dataValuesObject[id] = dataValue.value;
    });
    return dataValuesObject;
  }

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
      'id,data,content,programRuleActionType,location,programRule[id],dataElement[id],trackedEntityAttribute[id],programStageSection[id],programStage[id]';
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
      'id,name,displayName,programRuleVariableSourceType,program[id],dataElement[id],trackedEntityAttribute[id],programStageSection[id],programStage[id]';
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
            console.log(JSON.stringify(error));
            observer.error(error);
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

  getgProgramRulesByIds(
    programRulesIds: Array<String>,
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'programRules';
    return new Observable(observer => {
      if (programRulesIds.length == 0) {
        observer.next([]);
        observer.complete();
      } else {
        this.sqlLite
          .getDataFromTableByAttributes(
            resource,
            'id',
            programRulesIds,
            currentUser.currentDatabase
          )
          .subscribe(
            programRules => {
              observer.next(programRules);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      }
    });
  }

  getProgramRuleActionsByIds(
    ProgramRuleActionsIds: Array<String>,
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'programRuleActions';
    return new Observable(observer => {
      if (ProgramRuleActionsIds.length == 0) {
        observer.next([]);
        observer.complete();
      } else {
        this.sqlLite
          .getDataFromTableByAttributes(
            resource,
            'id',
            ProgramRuleActionsIds,
            currentUser.currentDatabase
          )
          .subscribe(
            programRuleActions => {
              observer.next(programRuleActions);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      }
    });
  }

  getProgramRuleVariableByIds(
    programRuleVariableIds: Array<string>,
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'programRuleVariables';
    return new Observable(observer => {
      if (programRuleVariableIds.length == 0) {
      } else {
        this.sqlLite
          .getDataFromTableByAttributes(
            resource,
            'id',
            programRuleVariableIds,
            currentUser.currentDatabase
          )
          .subscribe(
            programRuleVariables => {
              observer.next(programRuleVariables);
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
