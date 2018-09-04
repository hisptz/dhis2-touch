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

/*
  Generated class for the IndicatorsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class IndicatorsProvider {
  resource: string;

  constructor(
    private sqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'indicators';
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadingIndicatorsFromServer(currentUser): Observable<any> {
    return new Observable(observer => {
      let fields =
        'fields=id,name,denominatorDescription,numeratorDescription,numerator,denominator,indicatorType[:all]';
      let url = '/api/' + this.resource + '.json?paging=false&';
      url += fields;
      this.HttpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          const { indicators } = response;
          observer.next(indicators);
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
   * @param indicators
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingIndicatorsFromServer(indicators, currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .insertBulkDataOnTable(
          this.resource,
          indicators,
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
    });
  }

  /**
   *
   * @param indicatorIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getIndicatorsByIds(indicatorIds, currentUser): Observable<any> {
    let attributeKey = 'id';
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resource,
          attributeKey,
          indicatorIds,
          currentUser.currentDatabase
        )
        .subscribe(
          (indicators: any) => {
            observer.next(indicators);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getIndicatorValues(indicators, dataObject) {
    let indicatorToValue = {};
    indicators.map((indicator: any) => {
      const { id } = indicator;
      const { numerator } = indicator;
      const { denominator } = indicator;
      const { indicatorType } = indicator;
      const expresion =
        '(' +
        numerator +
        '/' +
        denominator +
        ')*' +
        (indicatorType && indicatorType.factor ? indicatorType.factor : 1);
      let value = 0;
      const generatedExpresion = this.generateExpresion(expresion, dataObject);
      try {
        value = eval(generatedExpresion);
        if (isNaN(value)) {
          indicatorToValue[id] = '-';
        } else {
          indicatorToValue[id] = Math.round(value);
        }
      } catch (e) {
        console.log('Fail to evaluate : ' + generatedExpresion);
      }
    });
    return { indicators: indicators, indicatorToValue: indicatorToValue };
  }

  generateExpresion(expression, dataObject) {
    const formulaPattern = /#\{.+?\}/g;
    const separator = '.';
    const matcher = expression.match(formulaPattern);
    matcher.map(match => {
      const operand = match.replace(/[#\{\}]/g, '');
      const isTotal = operand.indexOf(separator) == -1;
      let value = 0;
      if (isTotal) {
        value = this.getDataElementTotalValue(operand, dataObject);
      } else {
        const valueKey = operand.replace('.', '-');
        if (dataObject[valueKey]) {
          value = dataObject[valueKey].value;
        }
      }
      expression = expression.replace(match, value);
    });
    return expression;
  }

  getDataElementTotalValue(dataElementId, dataObject) {
    let sum = 0;
    const pattern = dataElementId + '-';
    const matchedKeys = _.filter(Object.keys(dataObject), key => {
      return key.indexOf(pattern) > -1;
    });
    matchedKeys.map(key => {
      const value = dataObject[key].value;
      if (!isNaN(value)) {
        sum += parseFloat(new Number(value).toString());
      }
    });
    return sum;
  }
}
