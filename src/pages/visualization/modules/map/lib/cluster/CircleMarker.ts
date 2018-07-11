import * as L from 'leaflet';

// Creates a circle marker from a GeoJSON feature
// Used for dots, client and server cluster

export const CircleMarker = L.CircleMarker.extend({
  options: {
    strokeColor: '#fff',
    weight: 0.5,
    radius: 6
  },

  initialize(feature, opts) {
    const options = L.setOptions(this, opts);

    options.fillColor = feature.properties.color || options.color;
    options.fillOpacity = options.opacity;
    options.color = options.strokeColor;

    this._feature = feature;
    this._latlng = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates);
    this._radius = this.options.radius;
  },

  getFeature() {
    return this._feature;
  },

  setOpacity(opacity) {
    this.setStyle({
      opacity,
      fillOpacity: opacity
    });
  }
});

export const circleMarker = (feature, options) => {
  return new CircleMarker(feature, options);
};
