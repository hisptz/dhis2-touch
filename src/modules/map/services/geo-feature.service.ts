import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/observable/throw';

import { GeoFeature } from '../models/geo-feature.model';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class GeoFeatureService {
  constructor(private httpClient: HttpClient) {}

  getGeoFeaturesArray(params) {
    const requests = params.map(param => {
      const url = `../../../api/geoFeatures.json?${param}`;
      return this.httpClient.get(url);
    });

    return combineLatest(requests);
  }

  getGeoFeatures(param): Observable<GeoFeature[]> {
    const url = `../../../api/geoFeatures.json?${param}`;
    return this.httpClient
      .get(url)
      .pipe(map(res => res), catchError((error: any) => Observable.throw(error.json())));
  }
}
