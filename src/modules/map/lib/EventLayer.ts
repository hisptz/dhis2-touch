import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as _ from 'lodash';
import { toGeoJson, isValidCoordinate, geoJsonOptions } from './GeoJson';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';
import { EVENT_COLOR, EVENT_RADIUS } from '../constants/layer.constant';
import {
  getOrgUnitsFromRows,
  getFiltersFromColumns,
  getFiltersAsText,
  getPeriodFromFilters,
  getPeriodNameFromId
} from '../utils/analytics';

export const event = options => {
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

  const { startDate, endDate } = dataSelections;
  const { eventPointColor, eventPointRadius, radiusLow, eventClustering } = layerOptions;
  const { labelFontSize, labelFontStyle } = displaySettings;

  const orgUnits = getOrgUnitsFromRows(dataSelections.rows);
  const period = getPeriodFromFilters(dataSelections.filters);
  const dataFilters = getFiltersFromColumns(dataSelections.columns);

  let legend = {
    period: period ? getPeriodNameFromId(period.id) : `${startDate} - ${endDate}`,
    filters: dataFilters && getFiltersAsText(dataFilters),
    items: null
  };
  const features = toGeoJson(geofeature);
  let geoJsonLayer = L.geoJSON(features);

  if (analyticsData) {
    const names = {
      true: 'Yes',
      false: 'No'
    };
    const { rows, headers, height, metaData, width } = analyticsData;
    headers.forEach(header => (names[header.name] = header.column));
    const data = rows
      .map(row => createEventFeature(headers, names, row))
      .filter(feature => isValidCoordinate(feature.geometry.coordinates));

    if (Array.isArray(data) && data.length) {
      const items = [
        {
          name: 'Event',
          color: eventPointColor || EVENT_COLOR,
          radius: eventPointRadius || EVENT_RADIUS
        }
      ];
      legend = {
        ...legend,
        items
      };
      const clusterOptions = {
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        iconCreateFunction: cluster => {
          return _iconCreateFunction(
            cluster,
            eventPointColor,
            opacity,
            labelFontStyle,
            labelFontSize
          );
        }
      };
      const geoJSonOptions = geoJsonOptions(id, eventPointRadius, opacity, eventPointColor);

      geoJsonLayer = L.geoJSON(data, geoJSonOptions);
      // All Clustering is done here;
      if (eventClustering) {
        const markers = new L.markerClusterGroup(clusterOptions);
        geoJsonLayer = markers.addLayers(geoJsonLayer);
      }
      geoJsonLayer.on({
        click: eventLayerEvents().onClick,
        mouseover: eventLayerEvents().mouseover,
        rightClick: eventLayerEvents().onRightClick,
        mouseout: eventLayerEvents().mouseout
      });
    }
  }

  const bounds = geoJsonLayer.getBounds();
  const optionsToReturn = {
    ...options,
    features,
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

const createEventFeature = (headers, names, layerEvent, eventCoordinateField?) => {
  const properties = layerEvent.reduce(
    (props, value, i) => ({
      ...props,
      [headers[i].name]: names[value] || value
    }),
    {}
  );

  // properties style
  properties.style = {
    color: '#fff',
    weight: 1,
    stroke: true,
    fill: true
  };

  let coordinates;

  if (eventCoordinateField) {
    // If coordinate field other than event location
    const eventCoord = properties[eventCoordinateField];

    if (Array.isArray(eventCoord)) {
      coordinates = eventCoord;
    } else if (_.isString(eventCoord) && !_.isEmpty(eventCoord)) {
      coordinates = JSON.parse(eventCoord);
    } else {
      coordinates = [];
    }
  } else {
    // Use event location
    coordinates = [properties.longitude, properties.latitude]; // Event location
  }

  return {
    type: 'Feature',
    id: properties.psi,
    properties,
    geometry: {
      type: 'Point',
      coordinates: coordinates.map(parseFloat)
    }
  };
};

const eventLayerEvents = () => {
  const onClick = evt => {
    const attr = evt.layer.feature.properties;
    const content = `<table><tbody> <tr>
                    <th>Organisation unit: </th><td>${attr.ouname}</td></tr>
                    <tr><th>Event time: </th><td>${attr.eventdate}</td></tr>
                    <tr>
                      <th>Event location: </th>
                      <td>${attr.latitude}, ${attr.longitude}</td>
                    </tr></tbody></table>`;
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
    const style = evt.layer.feature.properties.style;
    const weight = 3;
    evt.layer.setStyle({ ...style, weight });
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

const _iconCreateFunction = (cluster, eventPointColor, opacity, labelFontStyle, labelFontSize) => {
  const count = cluster.getChildCount();
  const iconSize = _calculateClusterSize(count);
  const htmlContent = _createClusterIcon(
    iconSize,
    cluster,
    eventPointColor,
    opacity,
    labelFontStyle,
    labelFontSize
  );
  return L.divIcon({
    html: htmlContent,
    className: 'leaflet-cluster-icon',
    iconSize: new L.Point(iconSize[0], iconSize[1])
  });
};

const _calculateClusterSize = count => {
  return count < 10
    ? [16, 16]
    : count >= 10 && count <= 40 ? [20, 20] : count > 40 && count < 100 ? [30, 30] : [40, 40];
};

function _calculateMarginTop(iconSize: any) {
  const size = iconSize[0];
  return size === 30 ? 5 : size === 20 ? 2 : 10;
}

function _writeInKNumberSystem(childCount: any): any {
  return childCount >= 1000 ? (childCount = (childCount / 1000).toFixed(1) + 'k') : childCount;
}

function _createClusterIcon(
  iconSize,
  cluster,
  eventPointColor,
  opacity,
  labelFontStyle,
  labelFontSize
) {
  const marginTop = _calculateMarginTop(iconSize);
  const height = iconSize[0];
  const width = iconSize[1];
  const htmlContent =
    '<div style="' +
    'color:#ffffff;text-align:center;' +
    'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.65);' +
    'opacity:' +
    opacity +
    ';' +
    'background-color:' +
    _eventColor(eventPointColor) +
    ';' +
    'height:' +
    height +
    'px;width:' +
    width +
    'px;' +
    'font-style:' +
    labelFontStyle +
    ';' +
    'font-size:' +
    labelFontSize +
    ';' +
    'border-radius:' +
    iconSize[0] +
    'px;">' +
    '<span style="line-height:' +
    width +
    'px;">' +
    _writeInKNumberSystem(parseInt(cluster.getChildCount(), 10)) +
    '</span>' +
    '</div>';
  return htmlContent;
}

function _eventColor(color) {
  return '#' + color;
}
