import * as _ from 'lodash';
import polylabel from 'polylabel';
import * as geojsonArea from '@mapbox/geojson-area';

export const createEventFeature = (headers, names, layerEvent, metaData, eventCoordinateField?) => {
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
    name: metaData.names[properties.ps],
    properties,
    geometry: {
      type: 'Point',
      coordinates: coordinates.map(parseFloat)
    }
  };
};

export const isValidCoordinate = coord =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  coord[0] >= -180 &&
  coord[0] <= 180 &&
  coord[1] >= -90 &&
  coord[1] <= 90;

export const getLabelLatlng = geometry => {
  const coords = geometry.coordinates;
  let biggestRing;

  if (geometry.type === 'Point') {
    return [coords[1], coords[0]];
  } else if (geometry.type === 'Polygon') {
    biggestRing = coords;
  } else if (geometry.type === 'MultiPolygon') {
    biggestRing = coords[0];

    // If more than one polygon, place the label on the polygon with the biggest area
    if (coords.length > 1) {
      let biggestSize = 0;

      coords.forEach(ring => {
        const size = geojsonArea.ring(ring[0]); // Area calculation

        if (size > biggestSize) {
          biggestRing = ring;
          biggestSize = size;
        }
      });
    }
  }

  // Returns pole of inaccessibility, the most distant internal point from the polygon outline
  return polylabel(biggestRing, 2).reverse();
};

export const getBboxBounds = bbox => {
  if (!bbox) {
    return null;
  }
  const extent = bbox.match(/([-\d\.]+)/g);
  return [[extent[1], extent[0]], [extent[3], extent[2]]];
};

export const toGeoJson = data => {
  const header = {};
  const features = [];

  // Convert headers to object for easier lookup
  data.headers.forEach((h, i) => (header[h.name] = i));

  if (Array.isArray(data.rows)) {
    data.rows.forEach(row => {
      const extent = row[header['extent']].match(/([-\d\.]+)/g);
      const coords = row[header['center']].match(/([-\d\.]+)/g);

      // Round to 6 decimals - http://www.jacklmoore.com/notes/rounding-in-javascript/
      coords[0] = Math.round(Number(coords[0] + 'e6')) + 'e-6';
      coords[1] = Math.round(Number(coords[1] + 'e6')) + 'e-6';

      features.push({
        type: 'Feature',
        id: row[header['points']],
        geometry: {
          type: 'Point',
          coordinates: coords
        },
        properties: {
          count: parseInt(row[header['count']], 10),
          bounds: [[extent[1], extent[0]], [extent[3], extent[2]]]
        }
      });
    });
  }

  return features;
};
