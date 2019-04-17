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
import * as _ from 'lodash';
import { CurrentUser, ValidationRule } from '../../models';

@Injectable()
export class ValidationRulesProvider {
  constructor(
    private sqlLite: SqlLiteProvider,
    private httpClientProvider: HttpClientProvider
  ) {}

  discoveringValidationRulesFromServer(
    currentUser: CurrentUser
  ): Observable<ValidationRule[]> {
    const fields = `id,displayName,importance,description,periodType,operator,skipFormValidation,leftSide[*],rightSide[*]`;
    const resource = `validationRules`;
    const url = `/api/${resource}.json?paging=false&fields=${fields}`;
    const validOperators = [
      'equal_to',
      'not_equal_to',
      'greater_than',
      'greater_than_or_equal_to',
      'less_than',
      'less_than_or_equal_to'
    ];
    const validationOperatorMapper = {
      equal_to: '==',
      not_equal_to: '!=',
      greater_than: '>',
      greater_than_or_equal_to: '>=',
      less_than: '<',
      less_than_or_equal_to: '<='
    };
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { validationRules } = response;
          const sanitizedValidationRules = _.map(
            _.filter(validationRules, (validationRule: ValidationRule) => {
              return _.indexOf(validOperators, validationRule.operator) > -1;
            }),
            (validationRule: ValidationRule) => {
              const { operator } = validationRule;
              const expressionOperator =
                validationOperatorMapper && validationOperatorMapper[operator]
                  ? validationOperatorMapper[operator]
                  : operator;
              return { ...validationRule, operator: expressionOperator };
            }
          );
          observer.next(sanitizedValidationRules);
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  savingValidationRules(
    validationRules: ValidationRule[],
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'validationRules';
    return new Observable(observer => {
      if (validationRules.length === 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            validationRules,
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

  discoveringValidationRulesByEntryFormFields(
    entryFormSections: any[],
    currentUser: CurrentUser
  ): Observable<ValidationRule[]> {
    const resource = 'validationRules';
    const dataElementIds = _.flattenDeep(
      _.map(
        _.map(entryFormSections, entrySection => entrySection.dataElements),
        (dataElement: any) => dataElement.id
      )
    );
    console.log(JSON.stringify({ dataElementIds }));
    return new Observable(observer => {
      this.sqlLite
        .getAllDataFromTable(resource, currentUser.currentDatabase)
        .subscribe(
          (validationRules: ValidationRule[]) => {
            observer.next(validationRules);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
