import { Injectable } from '@angular/core';
import {MapConfiguration} from '../../model/map-configuration';
import {Visualization} from '../../model/visualization';
import {MapVisualizationServiceProvider} from "../map-visualization-service/map-visualization-service";

/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MapServiceProvider {

  constructor(private mapVisualizationService : MapVisualizationServiceProvider) {}


  public getMapConfiguration(visualizationObject: Visualization): MapConfiguration {
    return {
      id: visualizationObject.id,
      name: visualizationObject.name,
      subtitle: visualizationObject.subtitle,
      basemap: visualizationObject.details.hasOwnProperty('basemap') && visualizationObject.details.basemap ? visualizationObject.details.basemap : 'osmlight',
      zoom: visualizationObject.details.hasOwnProperty('zoom') ? visualizationObject.details.zoom : 0,
      latitude: visualizationObject.details.hasOwnProperty('latitude') ? visualizationObject.details.latitude : 0,
      longitude: visualizationObject.details.hasOwnProperty('longitude') ? visualizationObject.details.longitude : 0
    };
  }

  getMapObject(visualizationDetails) {
    return null;
    //return this.mapVisualizationService.drawMap(visualizationDetails.leafletObject, visualizationDetails.visualizationObject);
  }
}
