import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { catchError, map } from "rxjs/operators";
import { forkJoin } from "rxjs/observable/forkJoin";
import "rxjs/add/observable/throw";

import { GeoFeature } from "../models/geo-feature.model";
import { combineLatest } from "rxjs/observable/combineLatest";
import { HttpClientProvider } from "../../../providers/http-client/http-client";

@Injectable()
export class GeoFeatureService {
  constructor(private httpClient: HttpClientProvider) {}

  getGeoFeaturesArray(params) {
    const requests = params.map(param => {
      const url = `geoFeatures.json?${param}`;
      return this.httpClient.get(url, true);
    });

    return combineLatest(requests);
  }

  getGeoFeatures(param): Observable<GeoFeature[]> {
    const url = `geoFeatures.json?${param}`;
    return this.httpClient
      .get(url, true)
      .pipe(
        map(res => res),
        catchError((error: any) => Observable.throw(error))
      );
  }
}
