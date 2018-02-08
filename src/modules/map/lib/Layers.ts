import L from 'leaflet';
// List of fuctions to create diferent Layers
import { boundary } from './BoundaryLayer';
import { tileLayer } from './TileLayer';
import { event } from './EventLayer';
import { thematic } from './ThematicLayer';
import { facility } from './FacilityLayer';
import { external } from './ExternalLayer';
import { earthEngine } from './EarthEngineLayer';
import { Layer } from '../models/layer.model';
import { VisualizationObject } from '../models/visualization-object.model';

export const LayerType = {
  boundary,
  tileLayer,
  event,
  thematic,
  facility,
  external,
  earthEngine
};

export const Layers = (layers, geofeatures, analytics, organizationGroupSet, legendSets) => {
  const optionLayers = layers.map(layer => {
    let newLayer: Layer;

    if (geofeatures) {
      const geofeature = geofeatures[layer.id];
      const pane = layer.id;
      newLayer = {
        ...newLayer,
        ...layer,
        pane,
        geofeature
      };
    }
    if (analytics) {
      const analyticsData = analytics[layer.id];
      newLayer = {
        ...newLayer,
        analyticsData
      };
    }
    if (organizationGroupSet) {
      const orgUnitGroupSet = organizationGroupSet[layer.id];
      newLayer = {
        ...newLayer,
        orgUnitGroupSet
      };
    }
    if (legendSets) {
      const legendSet = legendSets[layer.id];
      newLayer = {
        ...newLayer,
        legendSet
      };
    }
    return LayerType[newLayer.type](newLayer);
  });
  return optionLayers;
};

export const GetOverLayLayers = (visualizationObject: VisualizationObject) => {
  const { mapConfiguration, layers, geofeatures, analytics, orgUnitGroupSet, legendSets } = visualizationObject;

  // Work with Layers separately;
  return Layers(layers, geofeatures, analytics, orgUnitGroupSet, legendSets);
};

// This is the hack which wont matter since we are using Bounds to fit the map afterwards.
export const _convertLatitudeLongitude = coordinate => {
  if (Math.abs(parseInt(coordinate, 10)) > 100000) {
    return (parseFloat(coordinate) / 100000).toFixed(6);
  }
  return parseFloat(coordinate).toFixed(6);
};
