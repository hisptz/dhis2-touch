import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the OrgUnitGroupSetServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrgUnitGroupSetServiceProvider {

  constructor(public http: HttpClientProvider) {}

  getGroupSet(visualizationDetails: any,currentUser) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    const visualizationLayers = visualizationDetails.visualizationObject.layers;
    const groupSetArray = visualizationLayers.map(layer => {return layer.settings.organisationUnitGroupSet});
    return Observable.create(observer => {
      Observable.forkJoin(
        groupSetArray.map(groupSet => {
          return groupSet ? this.http.get(this._getGroupSetUrl(apiRootUrl, groupSet.id),currentUser) : Observable.of(null)
        })
      ).subscribe((legendSets:any) => {
        legendSets = JSON.parse(legendSets);
        visualizationDetails.groupSets = legendSets;
        observer.next(visualizationDetails);
        observer.complete();
      }, error => observer.error(error));
    })
  }
  private _getGroupSetUrl(apiRootUrl, groupSetId) {
    return apiRootUrl + 'organisationUnitGroupSets/' + groupSetId + '.json?fields=id,name,organisationUnitGroups[id,code,name,shortName,displayName,dimensionItem,symbol,organisationUnits[id,code,name,shortName]]';
  }

}
