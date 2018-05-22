// Boundary layer
import * as L from 'leaflet';
import { toGeoJson, geoJsonOptions } from './GeoJson';
import * as _ from 'lodash';
import { GeoJson } from 'leaflet';
import { Feature, GeometryObject } from 'geojson';

const colors = ['black', 'blue', 'red', 'green', 'yellow'];
const weights = [2, 1, 0.75, 0.5, 0.5];

export function boundary(options) {
  const { geofeature, layerOptions, displaySettings, opacity, id } = options;
  const radiusLow = layerOptions.radiusLow;
  const features = toGeoJson(geofeature);

  if (!features.length) {
    return;
  }
  const levels = _.uniqBy(features, f => f.properties.level)
    .map(f => f.properties.level)
    .sort();
  const levelStyle = levels.reduce(
    (obj, level, index) => ({
      ...obj,
      [level]: {
        color: colors[index],
        fillOpacity: 0,
        weight: levels.length === 1 ? 1 : weights[index],
        stroke: true,
        fill: false
      }
    }),
    {}
  );

  const items = Object.keys(levelStyle).map(key => ({ ...levelStyle[key], name: `level ${key}` }));
  const legend = {
    title: 'Boundary Layer',
    type: 'boundary',
    items
  };

  const legendSet = {
    legend,
    layer: id,
    hidden: false,
    opacity
  };

  features.forEach(feature => {
    feature.properties.style = levelStyle[feature.properties.level];
    feature.properties.labelStyle = {
      fontSize: displaySettings.labelFontSize,
      fontStyle: displaySettings.labelFontStyle,
      fontColor: displaySettings.labelFontColor,
      fontWeight: displaySettings.labelFontWeight,
      paddingTop: feature.geometry.type === 'Point' ? 5 + (radiusLow || 5) + 'px' : '0'
    };
  });

  const geoJSonOptions = geoJsonOptions(id, radiusLow, opacity);
  const geoJsonLayer = L.geoJSON(features, geoJSonOptions);
  geoJsonLayer.on({
    click: boundaryEvents().onClick,
    mouseover: boundaryEvents().mouseover,
    mouseout: boundaryEvents().mouseout
  });
  const bounds = geoJsonLayer.getBounds();
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
}

export const boundaryEvents = () => {
  const onClick = evt => {
    const attr = evt.layer.feature.properties;
    let content = `<div class="leaflet-popup-orgunit"><em>${attr.name}</em>`;

    if (attr.level) {
      content += `<br/>Level: ${attr.level}`;
    }
    if (attr.parentName) {
      content += `<br/>Parent unit: ${attr.parentName}`;
    }
    content += '</div>';
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
    evt.layer.closeTooltip();
    evt.layer
      .bindTooltip(evt.layer.feature.properties.name, {
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
