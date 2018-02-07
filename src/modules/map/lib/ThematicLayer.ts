import * as L from 'leaflet';
import * as _ from 'lodash';
import {
  getOrgUnitsFromRows,
  getPeriodFromFilters,
  getDataItemsFromColumns
} from '../utils/analytics';
import { getLegendItems, getColorsByRgbInterpolation } from '../utils/classify';
import { toGeoJson } from './GeoJson';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';

export const thematic = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    dataSelections,
    legendProperties,
    legendSet,
    analyticsData
  } = options;
  const { rows, columns, filters } = dataSelections;
  const { radiusLow, radiusHigh } = layerOptions;
  const features = toGeoJson(geofeature);
  const readyToRender = dataSelections.legendSet ? legendSet : true;
  const otherOptions = thematicLayerOptions(options.id, opacity);
  let geoJsonLayer = L.geoJSON(features, otherOptions);
  let legend = null;
  if (analyticsData && analyticsData.rows.length) {
    const valueById = getValueById(analyticsData);
    const valueFeatures = features.filter(({ id }) => valueById[id] !== undefined);
    const orderedValues = getOrderedValues(analyticsData);
    const minValue = orderedValues[0];
    const maxValue = orderedValues[orderedValues.length - 1];
    const valueFrequencyPair = _.countBy(orderedValues);
    const dataItem = getDataItemsFromColumns(columns)[0];
    const name = options.name || dataItem.name;
    legend = legendSet
      ? createLegendFromLegendSet(legendSet, options.displayName, options.type)
      : createLegendFromConfig(orderedValues, legendProperties, options.displayName, options.type);
    const getLegendItem = _.curry(getLegendItemForValue)(legend.items);
    legend['period'] =
      (analyticsData.metaData.dimensions && analyticsData.metaData.dimensions.pe[0]) ||
      analyticsData.metaData.pe[0];

    valueFeatures.forEach(({ id, properties }) => {
      const value = valueById[id];
      const item = getLegendItem(value);

      item.count === undefined ? (item.count = 1) : item.count++;

      properties.value = value;
      properties.label = name;
      properties.color = item && item.color;
      properties.percentage = (valueFrequencyPair[value] / orderedValues.length * 100).toFixed(1);
      properties.radius =
        (value - minValue) / (maxValue - minValue) * (radiusHigh - radiusLow) + radiusLow;
    });
    geoJsonLayer = L.geoJSON(valueFeatures, otherOptions);
    const thematicEvents = thematicLayerEvents(columns, legend);
    geoJsonLayer.on({
      click: thematicEvents.onClick,
      mouseover: thematicEvents.mouseover,
      mouseout: thematicEvents.mouseout
    });
  }
  const bounds = geoJsonLayer.getBounds();
  const _legendSet = {
    layer: options.id,
    legend
  };
  const optionsToReturn = {
    ...options,
    features,
    legendSet: _legendSet,
    geoJsonLayer
  };
  if (bounds.isValid()) {
    return {
      ...optionsToReturn,
      bounds
    };
  }
  return optionsToReturn;
};

// Returns an object mapping org. units and values
const getValueById = data => {
  const { headers, rows } = data;
  const ouIndex = _.findIndex(headers, ['name', 'ou']);
  const valueIndex = _.findIndex(headers, ['name', 'value']);

  return rows.reduce((obj, row) => {
    obj[row[ouIndex]] = parseFloat(row[valueIndex]);
    return obj;
  }, {});
};

// Returns an array of ordered values
const getOrderedValues = data => {
  const { headers, rows } = data;
  const valueIndex = _.findIndex(headers, ['name', 'value']);

  return rows.map(row => parseFloat(row[valueIndex])).sort((a, b) => a - b);
};

const createLegendFromLegendSet = (legendSet, displayName, type) => {
  const { name, legends } = legendSet;
  const pickSome = ['name', 'startValue', 'endValue', 'color'];
  const items = _.sortBy(legends, 'startValues').map(legend => _.pick(legend, pickSome));
  return {
    title: name || displayName,
    type,
    items
  };
};

const createLegendFromConfig = (data, config, displayName, type) => {
  const { method, classes, colorScale, colorLow, colorHigh } = config;
  const items = getLegendItems(data, method, classes);

  console.log('Items::', items);
  let colors;

  // TODO: Unify how we represent a colorScale
  if (Array.isArray(colorScale)) {
    colors = colorScale;
  } else if (_.isString(colorScale)) {
    colors = colorScale.split(',');
  } else {
    colors = getColorsByRgbInterpolation(colorLow, colorHigh, classes);
  }

  return {
    title: displayName,
    type,
    items: items.map((item, index) => ({
      ...item,
      color: colors[index]
    }))
  };
};

// Returns legend item where a value belongs
const getLegendItemForValue = (legendItems, value) => {
  const isLast = index => index === legendItems.length - 1;
  return legendItems.find(
    (item, index) =>
      value >= item.startValue &&
      (value < item.endValue || (isLast(index) && value === item.endValue))
  );
};

export const thematicLayerOptions = (id, opacity) => {
  const style = feature => {
    const pop = feature.properties;
    return {
      color: '#333',
      fillColor: pop.color,
      fillOpacity: opacity,
      opacity,
      weight: 1,
      fill: true,
      stroke: true
    };
  };
  const onEachFeature = (feature, layer) => {};

  const pane = id;

  const pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      pane,
      radius: feature.properties.radius || 6,
      fillColor: feature.properties.color || '#fff',
      color: feature.properties.color || '#333',
      opacity: opacity || 0.8,
      weight: 1,
      fillOpacity: opacity || 0.8
    };
    return new L.CircleMarker(latlng, geojsonMarkerOptions);
  };

  return {
    pane,
    style,
    onEachFeature,
    pointToLayer
  };
};

export const thematicLayerEvents = (columns, legend) => {
  const onClick = evt => {
    const { name, value, percentage } = evt.layer.feature.properties;
    const indicator = columns[0].items[0].name;
    const period = legend.period;
    const content = `<div class="leaflet-popup-orgunit">${name}<br>
                    ${indicator}<br>
                    ${period}: ${value}</div>`;
    // Close any popup if there is one
    evt.layer.closePopup();
    // Bind new popup to the layer
    evt.layer.bindPopup(content);
    // Open the binded popup
    evt.layer.openPopup();
  };

  const onRightClick = evt => {
    L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
  };

  const mouseover = evt => {
    const { name, value, percentage, style } = evt.layer.feature.properties;
    const weight = 3;
    evt.layer.setStyle({ ...style, weight });
    evt.layer.closeTooltip();
    evt.layer
      .bindTooltip(`${name}(${value})(${percentage}%)`, {
        direction: 'auto',
        permanent: false,
        sticky: true,
        interactive: true,
        opacity: 1
      })
      .openTooltip();
  };

  const mouseout = evt => {
    const style = evt.layer.feature.properties.style;
    const weight = 1;
    evt.layer.setStyle({ ...style, weight });
  };

  return {
    onClick,
    onRightClick,
    mouseover,
    mouseout
  };
};
