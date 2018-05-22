import * as L from 'leaflet';
import { tileLayer } from './TileLayer';
import { TILE_LAYERS } from '../constants/tile-layer.constant';

export const external = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    id,
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
  const namesMapping = {
    'Dark basemap': 'DarkMatter'
  };
  const tilelayer = namesMapping[name.trim()] || 'DarkMatter';
  const image = TILE_LAYERS[tilelayer].image;
  const legend = {
    title: name.trim(),
    type: 'external',
    items: [{ name, url, image }]
  };

  const legendSet = {
    legend,
    layer: id,
    hidden: false,
    opacity
  };
  return {
    ...options,
    geoJsonLayer,
    legendSet
  };
};
