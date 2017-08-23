import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {HttpClientProvider} from "../http-client/http-client";
import {FavoriteServiceProvider} from "../favorite-service/favorite-service";

/*
  Generated class for the GeoFeatureServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GeoFeatureServiceProvider {

  constructor(public http: HttpClientProvider,private favoriteService: FavoriteServiceProvider) {}

  getGeoFeature(visualizationDetails: any,currentUser) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    // const visualizationFilters = visualizationDetails.visualizationObject.details.filters;
    const visualizationFilters = visualizationDetails.visualizationObject.layers.map(layer => {
      const filterDetails = this.favoriteService.getVisualizationFiltersFromFavorite({favorite: layer.settings});

      let filters = [];
      let newFilter = null;
      if (filterDetails.filters) {
        filters = filterDetails.filters;
        filters.forEach(filter => { newFilter = filter});
      }
      return newFilter;
    });

    const geoFeatureParametersArray = this._getGeoFeatureParametersArray(visualizationFilters.map(filterObject => { return _.find(filterObject.filters, ['name', 'ou'])}));
    return Observable.create(observer => {
      if (geoFeatureParametersArray === []) {
        observer.next(visualizationDetails);
        observer.complete();
      } else {
        Observable.forkJoin(
          geoFeatureParametersArray.map(geoFeatureParam => {
            return geoFeatureParam !== '' ? this.http.get(this._getGeoFeatureUrl(apiRootUrl, geoFeatureParam),currentUser) : Observable.of([])
          })
        )
          .subscribe((geoFeaturesResponse :any) => {

            const newGeoFeaturesResponse: any[] = _.map(geoFeaturesResponse, (geoFeatureObject: any) =>
              geoFeatureObject !== null && geoFeatureObject.data ? JSON.parse(geoFeatureObject.data) : []
            );
            const newGeoFeatures = [];
            visualizationFilters.forEach((filterObject, filterIndex) => {
              newGeoFeatures.push({
                id: filterObject.id,
                content: newGeoFeaturesResponse[filterIndex]
              })
            });
            visualizationDetails.geoFeatures = newGeoFeatures;
            observer.next(visualizationDetails);
            observer.complete();
          }, error => observer.error(error))
      }
    })
  }
  private _getGeoFeatureParametersArray(visualizationOrgUnitArray) {
    return visualizationOrgUnitArray.map(orgUnitObject => { return orgUnitObject && orgUnitObject.value !== '' ? 'ou=ou:' + orgUnitObject.value : ''});
  }

  private _getGeoFeatureUrl(apiRootUrl: string, geoFeatureParams: string) {
    return apiRootUrl + 'geoFeatures.json?' + geoFeatureParams + '&displayProperty=NAME&includeGroupSets=true';
  }

}
