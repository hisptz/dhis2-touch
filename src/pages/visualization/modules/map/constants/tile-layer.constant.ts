export const TILE_LAYERS = {
  osmLight: {
    name: 'osmLight',
    type: 'tileLayer',
    label: 'OSM Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    maxZoom: 18,
    attribution: '&copy;<a href="https://carto.com/attribution">cartoDB</a>',
    image: 'assets/img/map-tiles/esri_osm_light.png',
    baseLayer: true,
    visible: true
  },

  googleStreetsBaseMap: {
    name: 'googleStreetsBaseMap',
    type: 'tileLayer',
    label: 'Esri WorldStreetMap',
    maxZoom: 18,
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    image: 'assets/img/map-tiles/esri_street_map.png',
    baseLayer: true,
    visible: true
  },

  googleHybrid: {
    name: 'googleHybrid',
    type: 'tileLayer',
    label: 'Earth Imagery',
    maxZoom: 18,
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    image: 'assets/img/map-tiles/esri_world_imagery.png',
    baseLayer: true,
    visible: true
  },

  OpenMapSurfer: {
    name: 'OpenMapSurfer',
    type: 'tileLayer',
    label: 'Map Surfer',
    maxZoom: 18,
    url: 'https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}',
    attribution: '&copy; giscience',
    image: 'assets/img/map-tiles/opne_surfer.png',
    baseLayer: true,
    visible: true
  },
  DarkMatter: {
    name: 'DarkMatter',
    type: 'tileLayer',
    label: 'OSM Dark',
    maxZoom: 18,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attribution: '&copy; CartoDB',
    image: 'assets/img/map-tiles/dar-osm.png',
    baseLayer: true,
    visible: true
  },
  OpenTopoMap: {
    name: 'OpenTopoMap',
    type: 'tileLayer',
    label: 'Topography Map',
    maxZoom: 18,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; SRTM',
    image: 'assets/img/map-tiles/topo.png',
    baseLayer: true,
    visible: true
  },

  OSMHOT: {
    name: 'OSMHOT',
    type: 'tileLayer',
    label: 'OSM HOT',
    maxZoom: 18,
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OSM',
    image: 'assets/img/map-tiles/osm_hot.png',
    baseLayer: true,
    visible: true
  },

  BlackAndWhite: {
    name: 'BlackAndWhite',
    type: 'tileLayer',
    label: 'OSM Black & White',
    maxZoom: 18,
    url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
    attribution: '&copy; OSM',
    image: 'assets/img/map-tiles/black_and_white.png',
    baseLayer: true,
    visible: true
  },

  StamenToner: {
    name: 'StamenToner',
    type: 'tileLayer',
    label: 'Stamen Toner Background',
    maxZoom: 18,
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    attribution: '&copy; STAMEN',
    image: 'assets/img/map-tiles/stamen-toner.png',
    baseLayer: true,
    visible: true
  }
};

export function getTileLayer(tileLayerId) {
  const tileLayer = TILE_LAYERS[tileLayerId];
  return tileLayer ? tileLayer : TILE_LAYERS['osmLight'];
}
