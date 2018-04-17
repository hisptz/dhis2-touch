import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';

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
      let url = '/api/25/' + this.resource + '.json?paging=false&';
      url += fields;
      this.HttpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          observer.next(response);
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

  getIndicatorValues() {
    const dataObject = {
      'J2eDsDShu8s-FoS2ElguZ6D': 2,
      'J2eDsDShu8s-CRk7N9zVu1e': 55,
      'J2eDsDShu8s-sZju15olqw2': 2
    };
    const factor = '45';
    const numerator = '#{J2eDsDShu8s.CRk7N9zVu1e}+#{J2eDsDShu8s.sZju15olqw2}';
    const denominator =
      '#{J2eDsDShu8s.CRk7N9zVu1e}+#{J2eDsDShu8s.sZju15olqw2}+#{J2eDsDShu8s.FoS2ElguZ6D})';
    const expresion = '(' + numerator + '/' + denominator + ')*' + factor;
    const generatedExpresion = this.generateExpresion(expresion, dataObject);
    return generatedExpresion;
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
          value = dataObject[valueKey];
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
      const value = dataObject[key];
      if (!isNaN(value)) {
        sum += parseFloat(new Number(value).toString());
      }
    });
    return sum;
  }
}
