import { MapConfiguration } from './map-configuration.model';
import { GeoFeature } from './geo-feature.model';
import { Layer } from './layer.model';

export interface VisualizationObject {
  mapConfiguration: MapConfiguration;
  componentId?: string;
  layers?: Layer[];
  geofeatures?: { [id: number]: GeoFeature[] };
  analytics?: any;
  orgUnitGroupSet?: any;
  legendSets?: any;
}
