import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class AnalyticsService {
  constructor(private httpClient: HttpClient) {}

  getMapAnalytics(dimension: string[], filters: string[]): Observable<any> {
    const url = [].concat.apply([], [dimension, filters]).join('&');
    return this.httpClient
      .get(`../../../api/analytics.json?${url}&displayProperty=NAME`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  getAnalytics(dimensions: string): Observable<any> {
    return this.httpClient
      .get(`../../../api/analytics.json?${dimensions}&displayProperty=NAME`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  getEventsAnalytics(dimensions: string): Observable<any> {
    return this.httpClient
      .get(`../../../api/analytics${dimensions}&coordinatesOnly=true`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
