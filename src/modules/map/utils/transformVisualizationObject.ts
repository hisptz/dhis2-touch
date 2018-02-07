import * as _ from 'lodash';
import { VisualizationObject } from '../models/visualization-object.model';
import { MapConfiguration } from '../models/map-configuration.model';
import { Layer } from '../models/layer.model';

export function transformVisualizationObject(visualizationObject) {
  let visObject = {};
  let geofeatures = {};
  let analytics = {};
  const mapconfig = visualizationObject.details;
  const mapConfiguration: MapConfiguration = _.pick(mapconfig, [
    'id',
    'name',
    'subtitle',
    'latitude',
    'longitude',
    'basemap',
    'zoom'
  ]);

  let layers: Layer[] = [];

  const vizObjLayers = visualizationObject.layers;

  vizObjLayers.forEach(mapview => {
    const settings = mapview.settings;
    const layer = {
      id: settings.id,
      name: settings.name,
      overlay: true,
      visible: true,
      areaRadius: settings.areaRadius,
      displayName: settings.displayName,
      opacity: settings.opacity,
      hidden: settings.hidden,
      type: settings.layer.replace(/\d$/, '') // Replace number in thematic layers
    };

    const layerOptions = _.pick(settings, [
      'eventClustering',
      'eventPointRadius',
      'eventPointColor',
      'radiusHigh',
      'radiusLow'
    ]);

    const legendProperties = _.pick(settings, ['colorLow', 'colorHigh', 'colorScale', 'classes', 'method']);

    const displaySettings = _.pick(settings, [
      'labelFontColor',
      'labelFontSize',
      'labelFontStyle',
      'labelFontWeight',
      'labels',
      'hideTitle',
      'hideSubtitle'
    ]);

    const dataSelections = _.pick(settings, [
      'config',
      'parentLevel',
      'completedOnly',
      'translations',
      'interpretations',
      'program',
      'programStage',
      'columns',
      'rows',
      'filters',
      'aggregationType',
      'organisationUnitGroupSet',
      'startDate',
      'endDate'
    ]);

    const legendSet = settings.legendSet;

    const layerObj = {
      ...layer,
      layerOptions,
      legendProperties,
      displaySettings,
      legendSet,
      dataSelections
    };

    const geoFeature = { [settings.id]: settings.geoFeature };
    const analytic = { [settings.id]: mapview.analytics };
    geofeatures = { ...geofeatures, ...geoFeature };
    analytics = { ...analytics, ...analytic };
    layers = [...layers, layerObj];
  });

  visObject = {
    ...visObject,
    mapConfiguration,
    layers,
    geofeatures,
    analytics
  };

  return {
    visObject
  };
}
