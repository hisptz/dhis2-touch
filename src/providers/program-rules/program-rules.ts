import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CurrentUser } from '../../models/currentUser';

const ASSIGN = 'ASSIGN';
const HIDE_FIELD = 'HIDEFIELD';
const HIDE_PROGRAMSTAGE = 'HIDEPROGRAMSTAGE';
const HIDE_SECTION = 'HIDESECTION';
const SHOW_ERROR = 'SHOWERROR';
const SHOW_WARNING = 'SHOWWARNING';
const ERROR_ON_COMPLETE = 'ERRORONCOMPLETE';
const WARNING_ON_COMPLETE = 'WARNINGONCOMPLETE';
const SET_MANDATORY_FIELD = 'SETMANDATORYFIELD';
const DISPLAY_KEY_VALUE_PAIR = 'DISPLAYKEYVALUEPAIR';
const DISPLAY_TEXT = 'DISPLAYTEXT';

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

  getProgramRulesEvaluations(
    programSkipLogicMetadata,
    dataObject
  ): Observable<any> {
    return new Observable(observer => {
      let programRulesEvaluations = {
        hiddenFields: {},
        hiddenSections: {},
        hiddenProgramStages: {}
      };
      let hasDataToAssign = false;
      const { programRules } = programSkipLogicMetadata;
      const { programRulesVariables } = programSkipLogicMetadata;
      const dataValuesObject = this.getDeducedDataValuesForEvaluation(
        dataObject
      );
      if (programRules) {
        programRules.map(programRule => {
          const { condition, programRuleActions } = programRule;
          programRuleActions.map(programRuleAction => {
            if (programRuleAction && programRuleAction.id) {
              const id = programRuleAction.id;
              const action = _.find(
                programSkipLogicMetadata.programRuleActions,
                {
                  id: id
                }
              );
              if (action && action.id) {
                const {
                  programRuleActionType,
                  dataElement,
                  trackedEntityAttribute,
                  programStageSection,
                  programStage,
                  content,
                  location,
                  data
                } = action;
                let evalCondition = condition;
                let evalData;
                if (programRulesVariables) {
                  programRulesVariables.map(programRulesVariable => {
                    const ruleVariableDataElementAttributeId =
                      programRulesVariable &&
                      programRulesVariable.dataElement &&
                      programRulesVariable.dataElement.id
                        ? programRulesVariable.dataElement.id
                        : programRulesVariable &&
                          programRulesVariable.trackedEntityAttribute &&
                          programRulesVariable.trackedEntityAttribute.id
                          ? programRulesVariable.trackedEntityAttribute.id
                          : '';

                    if (evalCondition.includes(programRulesVariable.name)) {
                      let value = "''";
                      if (
                        dataValuesObject &&
                        dataValuesObject.hasOwnProperty(
                          ruleVariableDataElementAttributeId
                        )
                      ) {
                        if (
                          isNaN(
                            dataValuesObject[ruleVariableDataElementAttributeId]
                          )
                        ) {
                          value =
                            "'" +
                            dataValuesObject[
                              ruleVariableDataElementAttributeId
                            ] +
                            "'";
                        } else if (
                          dataValuesObject[
                            ruleVariableDataElementAttributeId
                          ] !== ''
                        ) {
                          value =
                            dataValuesObject[
                              ruleVariableDataElementAttributeId
                            ];
                        }
                      }
                      evalCondition = evalCondition
                        .split('#{' + programRulesVariable.name + '}')
                        .join(`${value}`);
                    }
                    if (data && data.includes(programRulesVariable.name)) {
                      evalData = data.split('==')[1];
                    }
                  });

                  if (evalCondition !== condition) {
                    try {
                      const evaluated = eval(`(${evalCondition})`);
                      if (evaluated) {
                        if (programRuleActionType === HIDE_FIELD) {
                          const actionDataElementAttributeId =
                            dataElement && dataElement.id
                              ? dataElement.id
                              : trackedEntityAttribute &&
                                trackedEntityAttribute.id
                                ? trackedEntityAttribute.id
                                : '';

                          programRulesEvaluations.hiddenFields[
                            actionDataElementAttributeId
                          ] = true;
                        } else if (programRuleActionType === HIDE_SECTION) {
                          const sectionId =
                            programStageSection && programStageSection.id
                              ? programStageSection.id
                              : '';
                          programRulesEvaluations.hiddenSections[
                            sectionId
                          ] = true;
                        } else if (
                          programRuleActionType === HIDE_PROGRAMSTAGE
                        ) {
                          const programStageId =
                            programStage && programStage.id
                              ? programStage.id
                              : '';
                          programRulesEvaluations.hiddenProgramStages[
                            programStageId
                          ] = true;
                        }
                      }
                    } catch (error) {
                      console.log('error : ' + JSON.stringify(error));
                      console.log('evalCondition : ' + evalCondition);
                      console.log('condition : ' + condition);
                    }
                  }
                }
              }
            }
          });
        });
      }

      observer.next({
        data: programRulesEvaluations,
        hasDataToAssign: hasDataToAssign
      });
      observer.complete();
    });
  }

  getDeducedDataValuesForEvaluation(dataObject) {
    let dataValuesObject = {};
    if (dataObject) {
      Object.keys(dataObject).map(key => {
        const id = key.split('-')[0];
        const dataValue = dataObject[key];
        dataValuesObject[id] = dataValue.value;
      });
    }
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
