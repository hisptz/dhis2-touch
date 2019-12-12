/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { getRepository } from 'typeorm';
import { HttpClientService } from './http-client.service';
import { CurrentUser, ValidationRule } from 'src/models';
import { ValidationRuleEntity } from 'src/entites';
import { getUidsFromExpression } from 'src/helpers';

@Injectable({
  providedIn: 'root'
})
export class ValidationRuleService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringValidationRulesFromServer(
    currentUser: CurrentUser
  ): Observable<any> {
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
      this.httpCLientService
        .get(url, true, currentUser)
        .then((response: any) => {
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
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  savingValidationRulesToLocalStorage(validationRules: any[]): Observable<any> {
    return new Observable(observer => {
      const repository = getRepository(ValidationRuleEntity);
      const chunk = 50;
      repository
        .save(validationRules, { chunk })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getValidationRulesByDateElementIds(dataElementIds: string[]) {
    const repository = getRepository(ValidationRuleEntity);
    const validationRules = await repository.find();
    return this.getSanitizedValidationRules(validationRules, dataElementIds);
  }

  getSanitizedValidationRules(
    validationRules: ValidationRule[],
    dataElementIds: string[]
  ) {
    return _.filter(validationRules, (validationRule: ValidationRule) => {
      const { leftSide, rightSide } = validationRule;
      const isLeftSideExpressionValid = this.isDataElementIdsPresentOnExpression(
        leftSide.expression,
        dataElementIds
      );
      const isRightSideExpressionValid = this.isDataElementIdsPresentOnExpression(
        rightSide.expression,
        dataElementIds
      );
      return isLeftSideExpressionValid && isRightSideExpressionValid;
    });
  }

  isDataElementIdsPresentOnExpression(
    expression: string,
    dataElementIds: string[]
  ): boolean {
    let isAllDataElementPresent = true;
    const expressionIds = getUidsFromExpression(expression);
    _.map(
      _.uniq(_.map(expressionIds, expressionId => expressionId.split('.')[0])),
      id => {
        if (_.indexOf(dataElementIds, id) === -1) {
          isAllDataElementPresent = false;
        }
      }
    );
    return isAllDataElementPresent;
  }
}
