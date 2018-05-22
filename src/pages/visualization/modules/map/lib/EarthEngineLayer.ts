import { datasets } from '../constants/earthengine.constant';
import { tileLayer } from './TileLayer';
import { earthEngineHelper } from './earthEngine/EarthEngineHelper';

export const earthEngine = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    id,
    dataSelections,
    legendProperties,
    analyticsData
  } = options;

  const { config } = dataSelections;

  const layerConfig = JSON.parse(config);
  const dataSet = datasets[layerConfig.id];

  const { accessToken } = layerOptions.earthEngineConfig;

  let earthLayer = {
    ...layerConfig,
    ...dataSet,
    accessToken
  };

  // Create legend items from params
  if (earthLayer.legend && !earthLayer.legend.items && earthLayer.params) {
    const items = createLegend(earthLayer.params);
    const legend = {
      ...earthLayer.legend,
      type: 'earthEngine',
      items
    };
    earthLayer = {
      ...earthLayer,
      legend,
      methods: 2,
      opacity,
      unit: legend.unit
    };
  }

  const geoJsonLayer = earthEngineHelper(earthLayer);
  const legendSet = {
    layer: options.id,
    title: dataSet.title,
    opacity,
    hidden: false,
    legend: earthLayer.legend
  };

  return {
    ...options,
    legendSet,
    geoJsonLayer
  };
};

export const createLegend = params => {
  const min = params.min;
  const max = params.max;
  const palette = params.palette.split(',');
  const step = (params.max - min) / (palette.length - (min > 0 ? 2 : 1));

  let from = min;
  let to = Math.round(min + step);

  return palette.map((color, index) => {
    const item = {
      color: color
    };

    if (index === 0 && min > 0) {
      // Less than min
      item['name'] = '< ' + min;
      to = min;
    } else if (from < max) {
      item['name'] = from + ' - ' + to;
    } else {
      // Higher than max
      item['name'] = '> ' + from;
    }

    from = to;
    to = Math.round(min + step * (index + (min > 0 ? 1 : 2)));

    return item;
  });
};
