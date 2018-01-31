import {Visualization} from '../../models/visualization';

export function getMapConfiguration(visualizationObject: Visualization): any {
  return {
    id: visualizationObject.id,
    name: visualizationObject.name,
    subtitle: visualizationObject.subtitle,
    basemap: visualizationObject.details.basemap && visualizationObject.details.basemap ? visualizationObject.details.basemap : 'osmlight',
    zoom: visualizationObject.details.zoom ? visualizationObject.details.zoom : 0,
    latitude: visualizationObject.details.latitude ? visualizationObject.details.latitude : 0,
    longitude: visualizationObject.details.longitude ? visualizationObject.details.longitude : 0
  };
}
