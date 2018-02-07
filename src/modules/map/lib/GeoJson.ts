import * as _ from 'lodash';
import * as L from 'leaflet';

export const isValidCoordinate = coord =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  coord[0] >= -180 &&
  coord[0] <= 180 &&
  coord[1] >= -90 &&
  coord[1] <= 90;

export const toGeoJson = organisationUnits =>
  _.sortBy(organisationUnits, 'le')
    .map(ou => {
      const coord = JSON.parse(ou.co);
      let gpid = '';
      let gppg = '';
      let type = 'Point';

      if (ou.ty === 2) {
        type = 'Polygon';
        if (ou.co.substring(0, 4) === '[[[[') {
          type = 'MultiPolygon';
        }
      }

      // Grand parent
      if (_.isString(ou.pg) && ou.pg.length) {
        const ids = _.compact(ou.pg.split('/'));

        // Grand parent id
        if (ids.length >= 2) {
          gpid = ids[ids.length - 2];
        }

        // Grand parent parent graph
        if (ids.length > 2) {
          gppg = '/' + ids.slice(0, ids.length - 2).join('/');
        }
      }

      return {
        type: 'Feature',
        id: ou.id,
        geometry: {
          type: type,
          coordinates: coord
        },
        properties: {
          id: ou.id,
          name: ou.na,
          hasCoordinatesDown: ou.hcd,
          hasCoordinatesUp: ou.hcu,
          level: ou.le,
          grandParentParentGraph: gppg,
          grandParentId: gpid,
          parentGraph: ou.pg,
          parentId: ou.pi,
          parentName: ou.pn
        }
      };
    })
    .filter(({ geometry }) => Array.isArray(geometry.coordinates) && geometry.coordinates.length);

export const geoJsonOptions = (id, radiusLow, opacity, color?) => {
  const style = feature => {
    const pop = feature.properties;
    if (pop.style) {
      return pop.style;
    }
  };

  const onEachFeature = (feature, layer) => {};

  const pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      radius: radiusLow ? radiusLow : 5,
      opacity: opacity ? opacity : 0.8,
      fillOpacity: opacity ? opacity : 0.8,
      fillColor: color ? color : '#333'
    };
    return new L.CircleMarker(latlng, geojsonMarkerOptions);
  };

  return {
    pane: id,
    style,
    onEachFeature,
    pointToLayer
  };
};
