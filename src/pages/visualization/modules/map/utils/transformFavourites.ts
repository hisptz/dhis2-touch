import * as _ from 'lodash';
import { VisualizationObject } from '../models/visualization-object.model';
import { MapConfiguration } from '../models/map-configuration.model';
import { Layer } from '../models/layer.model';

export function transformFavourites(visualizationObject) {
  let visObject = {};
  const mapConfiguration: MapConfiguration = _.pick(visualizationObject, [
    'id',
    'name',
    'subtitle',
    'latitude',
    'longitude',
    'basemap',
    'zoom'
  ]);

  const layers: string[] = [];
  let Layers: Layer[] = [];

  visualizationObject.mapViews.forEach(mapview => {
    const layer = {
      id: mapview.id,
      name: mapview.name,
      overlay: true,
      visible: true,
      areaRadius: mapview.areaRadius,
      displayName: mapview.displayName,
      opacity: mapview.opacity,
      hidden: mapview.hidden,
      type: mapview.layer.replace(/\d$/, '') // Replace number in thematic layers
    };

    layers.push(mapview.id);
    const layerOptions = _.pick(mapview, [
      'eventClustering',
      'eventPointRadius',
      'eventPointColor',
      'radiusHigh',
      'radiusLow'
    ]);
    const legendProperties = _.pick(mapview, [
      'colorLow',
      'colorHigh',
      'colorScale',
      'classes',
      'method'
    ]);
    const displaySettings = _.pick(mapview, [
      'labelFontColor',
      'labelFontSize',
      'labelFontStyle',
      'labelFontWeight',
      'labels',
      'hideTitle',
      'hideSubtitle'
    ]);
    const dataSelections = _.pick(mapview, [
      'config',
      'parentLevel',
      'completedOnly',
      'translations',
      'interpretations',
      'program',
      'programStage',
      'legendSet',
      'columns',
      'rows',
      'filters',
      'aggregationType',
      'organisationUnitGroupSet',
      'startDate',
      'endDate'
    ]);
    const layerObj = {
      ...layer,
      layerOptions,
      legendProperties,
      displaySettings,
      dataSelections
    };
    Layers = [...Layers, layerObj];
  });
  visObject = {
    ...visObject,
    mapConfiguration,
    layers
  };
  return {
    visObject,
    Layers
  };
}
