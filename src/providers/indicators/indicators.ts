import {Injectable} from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the IndicatorsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class IndicatorsProvider {

  resource: string;

  constructor(private sqlLite: SqlLiteProvider, private HttpClient: HttpClientProvider) {
    this.resource = "indicators";
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadingIndicatorsFromServer(currentUser): Observable<any> {
    return new Observable(observer => {
      let fields = "fields=id,name,denominatorDescription,numeratorDescription,numerator,denominator,indicatorType[:all]";
      let url = "/api/25/" + this.resource + ".json?paging=false&";
      url += fields;
      this.HttpClient.get(url, true, currentUser).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
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
      this.sqlLite.insertBulkDataOnTable(this.resource, indicators, currentUser.currentDatabase).subscribe(() => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param indicatorIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getIndicatorsByIds(indicatorIds, currentUser): Observable<any> {
    let attributeKey = "id";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(this.resource, attributeKey, indicatorIds, currentUser.currentDatabase).subscribe((indicators: any) => {
        observer.next(indicators);
        observer.complete();
      }, error => {
        observer.error(error)
      })
    });
  }

}
