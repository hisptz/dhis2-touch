import * as L from 'leaflet';
import { tileLayer } from './TileLayer';

export const external = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    dataSelections,
    legendProperties,
    analyticsData
  } = options;

  const { config } = dataSelections;
  const layerConfiguration = JSON.parse(config);
  const { name, url, attribution } = layerConfiguration;
  const tileOptions = { name, url, label: name, attribution };
  const geoJsonLayer = tileLayer(tileOptions);
  return {
    ...options,
    geoJsonLayer
  };
};
