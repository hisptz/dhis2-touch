import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as _ from 'lodash';
import { toGeoJson, isValidCoordinate, geoJsonOptions } from './GeoJson';
import { clientCluster } from './cluster/clientCluster';
import { serverCluster } from './cluster/serverCluster';
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
import { createEventFeature } from '../utils/layers';
import { timeFormat } from 'd3-time-format';

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
  const {
    eventPointColor,
    eventPointRadius,
    radiusLow,
    eventClustering,
    serverClustering,
    serverSideConfig
  } = layerOptions;
  const { labelFontSize, labelFontStyle } = displaySettings;

  const orgUnits = getOrgUnitsFromRows(dataSelections.rows);
  const period = getPeriodFromFilters(dataSelections.filters);
  const dataFilters = getFiltersFromColumns(dataSelections.columns);
  const { program, filters } = dataSelections;

  const formatTime = date => timeFormat('%Y-%m-%d')(new Date(date));
  const _period = period
    ? getPeriodNameFromId(period.dimensionItem)
    : `${formatTime(startDate)} - ${formatTime(endDate)}`;
  let legend = {
    period: _period,
    filters: dataFilters && getFiltersAsText(dataFilters),
    title: null,
    type: 'event',
    items: null
  };

  const features = toGeoJson(geofeature);
  let geoJsonLayer = L.geoJSON(features);

  if (analyticsData) {
    const color =
      eventPointColor && eventPointColor.charAt(0) !== '#'
        ? '#' + eventPointColor
        : eventPointColor;
    const items = [
      {
        name: 'Event',
        color: eventPointColor || EVENT_COLOR,
        radius: eventPointRadius || EVENT_RADIUS
      }
    ];
    if (serverClustering) {
      const serverSideOpts = {
        pane: id,
        load: serverSideConfig.load,
        popup: serverSideConfig.popup,
        bounds: serverSideConfig.bounds,
        color: color || EVENT_COLOR,
        radius: eventPointRadius || EVENT_RADIUS
      };
      const title = program ? `${program.displayName}` : `Event Layer`;
      legend = {
        ...legend,
        title,
        items
      };
      geoJsonLayer = serverCluster(serverSideOpts);
    } else {
      const names = {
        true: 'Yes',
        false: 'No'
      };
      const { rows, headers, height, metaData, width } = analyticsData;
      headers.forEach(header => (names[header.name] = header.column));
      const data = rows
        .map(row => createEventFeature(headers, names, row, metaData))
        .filter(feature => isValidCoordinate(feature.geometry.coordinates));

      if (Array.isArray(data) && data.length) {
        const title = data[0].name;
        legend = {
          ...legend,
          title,
          items
        };
        const geoJSonOptions = geoJsonOptions(id, eventPointRadius, opacity, eventPointColor);

        geoJsonLayer = L.geoJSON(data, geoJSonOptions);
        // All Clustering is done here;
        if (eventClustering) {
          const clusterOpt = {
            data,
            color: color || EVENT_COLOR,
            radius: eventPointRadius || EVENT_RADIUS,
            pane: id,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false
          };
          const clusterMarker = clientCluster(clusterOpt);
          geoJsonLayer = clusterMarker.addLayers(geoJsonLayer);
        }
      }
    }
    geoJsonLayer.on({
      click: eventLayerEvents().onClick,
      mouseover: eventLayerEvents().mouseover,
      rightClick: eventLayerEvents().onRightClick,
      mouseout: eventLayerEvents().mouseout
    });
  }

  const bounds = geoJsonLayer.getBounds();

  const legendSet = {
    legend,
    layer: id,
    hidden: false,
    cluster: eventClustering,
    opacity
  };

  const optionsToReturn = {
    ...options,
    features,
    geoJsonLayer,
    legendSet
  };
  if (bounds.isValid()) {
    return {
      ...optionsToReturn,
      bounds
    };
  }
  return optionsToReturn;
};

const eventLayerEvents = () => {
  const onClick = evt => {
    const attr = evt.layer.feature.properties;
    const name = evt.layer.feature.name;
    const content = `<table><tbody> <tr>
                      <th>Organisation unit: </th><td>${attr.ouname}</td></tr>
                    <tr><th>Event time: </th>
                      <td>${timeFormat('%Y-%m-%d')(new Date(attr.eventdate))}</td>
                    </tr>
                    <tr><th>Program Stage: </th>
                      <td>${name}</td>
                    </tr>
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
