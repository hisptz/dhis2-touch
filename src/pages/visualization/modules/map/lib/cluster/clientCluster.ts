import * as L from 'leaflet';
import { clusterIcon } from './ClusterIcon';
import { circleMarker } from './CircleMarker';
import { scaleLog } from 'd3-scale';

export const ClientCluster = L.MarkerClusterGroup.extend({
  options: {
    maxClusterRadius: 40,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction(cluster) {
      const count = cluster.getChildCount();

      cluster.options.opacity = this.opacity;

      return clusterIcon({
        color: this.color,
        opacity: this.opacity,
        size: this.scale(count),
        count
      });
    },
    domain: [1, 1000],
    range: [16, 40],
    radius: 6 // circle marker radius
  },

  initialize(opts) {
    const options = L.setOptions(this, opts);
    L.MarkerClusterGroup.prototype.initialize.call(this, options);

    if (options.data) {
      this.addData(options.data);
    }
  },

  addData(data) {
    const options = this.options;

    if (data.length) {
      options.domain = [1, data.length];
      options.scale = scaleLog()
        .domain(options.domain)
        .range(options.range)
        .clamp(true);
    }
  },

  setOpacity(opacity) {
    this.options.opacity = opacity;
    this.eachLayer(layer => layer.setStyle({ opacity: opacity, fillOpacity: opacity })); // Circle markers
    this._featureGroup.setStyle({ opacity: opacity, fillOpacity: opacity }); // Cluster markers
  }
});

export const clientCluster = options => {
  return new ClientCluster(options);
};
