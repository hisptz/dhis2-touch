import * as L from 'leaflet';
import { toGeoJson, isValidCoordinate, geoJsonOptions } from './GeoJson';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';
import {
  getOrgUnitsFromRows,
  getPeriodFromFilters,
  getDataItemsFromColumns
} from '../utils/analytics';
import * as _ from 'lodash';

export const facility = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    areaRadius,
    dataSelections,
    legendProperties,
    analyticsData,
    orgUnitGroupSet
  } = options;
  const { rows, columns, filters, organisationUnitGroupSet } = dataSelections;
  const orgUnits = getOrgUnitsFromRows(rows);
  const { radiusLow, radiusHigh } = layerOptions;

  let features = toGeoJson(geofeature);
  const geoOptions = geoJsonOptions(options.id, radiusLow, opacity);
  let geoJsonLayer = L.geoJSON(features, geoOptions);
  const contextPath = localStorage.getItem('contextPath');
  let legend = null;

  if (orgUnitGroupSet) {
    const groupSetId = organisationUnitGroupSet.id;
    const { organisationUnitGroups } = orgUnitGroupSet;
    const facilities = parseFacilities(geofeature, groupSetId);
    const groupSet = parseGroupSet(organisationUnitGroups);

    features = facilities.map(data => {
      const id = data.dimensions[groupSetId];
      return toFacilityGeoJson(data, groupSet[id], contextPath);
    });

    const otherOptions = facilityGeoJsonOptions(options.id, displaySettings, areaRadius, opacity);

    geoJsonLayer = L.geoJSON(features, otherOptions);
    legend = {
      title: 'Facilities',
      type: 'facility',
      items: Object.keys(groupSet).map(id => ({
        image: `${contextPath}/images/orgunitgroup/${groupSet[id].symbol}`,
        name: groupSet[id].name
      }))
    };
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

const parseFacilities = (facilities, groupSetId) =>
  facilities.filter(
    data =>
      data.ty === 1 &&
      _.isPlainObject(data.dimensions) &&
      data.dimensions[groupSetId] &&
      isValidCoordinate(JSON.parse(data.co))
  );

const toFacilityGeoJson = (data, group, contextPath) => ({
  type: 'Feature',
  id: data.id,
  properties: {
    id: data.id,
    name: data.na,
    label: `${data.na} (${group.name})`,
    icon: {
      iconUrl: `${contextPath}/images/orgunitgroup/${group.symbol}`,
      iconSize: [16, 16]
    }
  },
  geometry: {
    type: 'Point',
    coordinates: JSON.parse(data.co)
  }
});

const parseGroupSet = organisationUnitGroups =>
  organisationUnitGroups.reduce((symbols = {}, group, index) => {
    // Easier lookup of unit group symbols
    const symbol = group.symbol || 21 + index + '.png'; // Default symbol 21-25 are coloured circles
    return {
      ...symbols,
      [group.id]: {
        ...group,
        symbol
      }
    };
  }, {});

export const facilityGeoJsonOptions = (id, displaySettings, areaRadius, opacity) => {
  const {
    labelFontStyle,
    labelFontSize,
    labelFontColor,
    labelFontWeight,
    labels
  } = displaySettings;
  const onEachFeature = (feature, layer) => {
    if (labels) {
      feature.properties.label = feature.properties.name;
      feature.properties.labelStyle = {
        fontSize: labelFontSize,
        fontStyle: labelFontStyle,
        fontColor: labelFontColor,
        fontWeight: labelFontWeight,
        paddingTop: '10px'
      };
    }
  };
  const pane = id;
  const pointToLayer = (feature, latlng) => {
    const iconProperty = 'icon';
    const markerOptions = L.extend({}, { riseOnHover: true });
    const { labelStyle } = feature.properties;
    const title = L.Util.template('{name}', feature.properties);
    const icon = L.icon({
      ...feature.properties.icon
    });

    // NOTE: include pane to every Marker to make it them in different pane.
    const marker = new L.marker(latlng, {
      ...markerOptions,
      icon,
      iconProperty,
      title,
      labelStyle,
      pane
    });

    if (areaRadius) {
      const geojsonMarkerOptions = {
        radius: 6,
        weight: 0.5,
        strokeColor: '#fff',
        pane
      };
      const circle = new L.CircleMarker(latlng, geojsonMarkerOptions);
      const featureGroup = new L.featureGroup([circle, marker], { pane });
      featureGroup.on(featureGroupEvents);
      return featureGroup;
    }

    return marker;
  };

  const setOpacity = op => {
    this.eachLayer(layer => {
      layer.setOpacity(op);
    });
  };

  return {
    pane,
    onEachFeature,
    pointToLayer,
    setOpacity
  };
};

const featureGroupEvents = {
  mouseover: evt => {
    evt.layer.closeTooltip();
    const name = evt.target.feature.properties.name;
    evt.layer
      .bindTooltip(name, {
        direction: 'auto',
        permanent: false,
        sticky: true,
        interactive: true,
        opacity: 1
      })
      .openTooltip();
  },
  click: evt => {
    const attr = evt.target.feature.properties;
    let content = `<div class="leaflet-popup-orgunit">${attr.name}`;

    if (_.isPlainObject(attr.dimensions)) {
      content += `<br/>Groups: ${Object.keys(attr.dimensions)
        .map(id => attr.dimensions[id])
        .join(', ')}`;
    }

    if (attr.pn) {
      content += `<br/>Parent unit: ${attr.pn}`;
    }

    content += '</div>';

    evt.layer.closePopup();
    // Bind new popup to the layer
    evt.layer.bindPopup(content);
    // Open the binded popup
    evt.layer.openPopup();
  }
};
