import { Component,Input, OnInit } from '@angular/core';
import {Visualization} from "../../model/visualization";
import 'leaflet';
import 'leaflet.markercluster';
import {MapVisualizationServiceProvider} from "../../providers/map-visualization-service/map-visualization-service";
import {TileLayers} from "../../constants/tile-layers";
declare var L;
import * as _ from 'lodash';


/**
 * Generated class for the MapTemplateComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'map-template',
  templateUrl: 'map-template.html'
})
export class MapTemplateComponent implements OnInit{

  @Input() visualizationObject: Visualization;
  @Input() mapHeight: string;
  loading: boolean = true;
  hasError: boolean = false;
  errorMessage: string;
  legendIsOpen: boolean = false;
  mapWidth: any = '100%';
  map: any = {};
  centeringLayer: any;
  mapLegend: any;

  subtitle: string = '';
  pinned: boolean = false;
  operatingLayers: Array<any> = [];
  isFullScreen: boolean = false;
  hideTable: boolean = true;
  mapTable: any = {headers: [], rows: []};

  layerIcon : string;

  constructor(private mapVisualizationService: MapVisualizationServiceProvider,
              private tileLayers: TileLayers) {
  }

  ngOnInit(){
    this.layerIcon = 'assets/images/layers.png';
    if (this.visualizationObject.details.loaded) {
      if (!this.visualizationObject.details.hasError) {
        setTimeout(() => {
          this.visualizationObject = this.getSubtitle(this.visualizationObject);
          this.mapHeight = this.refineHeight(this.mapHeight);
          this.drawMap(this.visualizationObject, this.visualizationObject.details.updateAvailable);
        }, 10);
      } else {
        this.hasError = true;
        this.errorMessage = this.visualizationObject.details.errorMessage;
      }
    }
  }


  drawMap(visualizationObject: Visualization, prioritizeFilter?: boolean) {
    const mapObject = this.mapVisualizationService.drawMap(L, visualizationObject, prioritizeFilter);
    const container = this.prepareMapContainer(mapObject.id, this.mapHeight, this.mapWidth, this.isFullScreen);
    this.map = L.map(container, mapObject.options);
    this.centeringLayer = mapObject.centeringLayer;
    this.mapLegend = mapObject.mapLegend;
    this.operatingLayers = mapObject.operatingLayers;
    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.control.scale({position: 'bottomleft', metric: true, updateWhenIdle: true}).addTo(this.map);
    this.updateOnLayerLoad(mapObject);
    this.isFullScreen = visualizationObject.details.showFullScreen;
    if (this.isFullScreen === true){
      this.map.scrollWheelZoom.enable();
    }
  }

  recenterMap(map, layer) {
    if (layer instanceof L.LayerGroup) {
      if (layer.getLayers().length === 2) {
        layer = layer.getLayers()[0];
      }
    }
    const bounds = Array.isArray(layer) ? new L.LatLngBounds(layer) : layer.getBounds();
    if (this._checkIfValidCoordinate(bounds)) {
      try {
        map.fitBounds(bounds);
      } catch (e) {
        console.log('INVALID COORDINATE');
      }
    } else {
      this.hasError = true;
      this.errorMessage = 'Invalid organisation unit boundaries found!';
    }
  }

  updateOnLayerLoad(mapObject) {
    if (Array.isArray(this.centeringLayer)) {
      this.loading = false;
      setTimeout(() => {
        this.map.invalidateSize({pan: true});
        this.recenterMap(this.map, mapObject.centeringLayer);
      }, 10);
    } else {
      if (this.map.hasLayer(this.centeringLayer)) {
        this.loading = false;
        setTimeout(() => {
          this.map.invalidateSize({pan: true});
          this.recenterMap(this.map, mapObject.centeringLayer);
        }, 10);

      }
    }
  }

  getSubtitle(visualizationObject) {
    const layers = visualizationObject.layers;
    layers.forEach(layer => {
      if (layer.settings.subtitle) {
        visualizationObject['subtitle'] = layer.settings.subtitle;
      }
    });
    return visualizationObject;
  }

  private _checkIfValidCoordinate(bounds) {
    const boundLength = Object.getOwnPropertyNames(bounds).length;
    if (boundLength > 0) {
      return true;
    } else {
      return false;
    }
  }

  prepareMapContainer(mapObjectId, height, width, isFullscreen) {
    const parentElement = document.getElementById('map-view-port-' + mapObjectId);
    const mapContainer = document.getElementById(mapObjectId + '-child-view-port');
    if (mapContainer) {
      mapContainer.parentNode.removeChild(mapContainer);
    }
    const div = document.createElement('div');
    div.setAttribute('id', mapObjectId + '-child-view-port');
    if (isFullscreen) {
      width = '100%';
    }
    div.style.width = width;
    div.style.height = height;
    if (parentElement) {
      parentElement.appendChild(div);
    }
    return mapObjectId + '-child-view-port';
  }

  toggleLegendContainerView() {
    if (this.legendIsOpen || !this.legendIsOpen) {
      this.legendIsOpen = true;
    }
  }

  changeMapTileLayer(event) {
    if (event.active) {
      this.visualizationObject.details.mapConfiguration.basemap = event.name;
    } else {
      this.visualizationObject.details.mapConfiguration.basemap = null;
    }
    this.drawMap(this.visualizationObject);
  }

  updateMapLayers(event) {
    let layerActedUpon: any = null;
    this.operatingLayers.forEach(layer => {
      if (layer.hasOwnProperty(event.layer.name) || layer.hasOwnProperty(event.layer.id)) {
        layerActedUpon = layer[event.layer.name] ? layer[event.layer.name] : layer[event.layer.id];
      }
    });
    if (event.layer.hasOwnProperty('url')) {
      layerActedUpon = this.mapVisualizationService.prepareTileLayer(L, this.tileLayers.getTileLayer(event.layer.name));
    }
    if (layerActedUpon) {
      if (event.action === 'HIDE') {
        layerActedUpon.removeFrom(this.map);
        this.map.removeLayer(layerActedUpon);
      }
      if (event.action === 'SHOW') {
        this.map.addLayer(layerActedUpon);
      }
    }
  }

  stickyMapLegend(event) {
    this.pinned = event;
  }

  downloadMapAsFiles(event) {
    const fileFormat = event.format;
    let data = event.data;
    if (fileFormat === 'image') {
      data = this.map.getContainer();
    }
    this.mapVisualizationService.downLoadMapAsFiles(fileFormat, data);
  }

  closeMapLegend(flag) {
    if (flag === 'leave' && !this.pinned) {
      this.legendIsOpen = false;
    }
    if (!flag) {
      this.pinned = false;
      this.legendIsOpen = false;
    }
  }

  dragAndDropHandler(event) {
    const newVisualizationObject = this.visualizationObject;
    const layers = newVisualizationObject.layers;
    newVisualizationObject.layers = this.sortLayers(layers, event);
    this.drawMap(this.visualizationObject);
  }

  clickedOutSideLegend(event) {
  }

  sortLayers(layers, eventLayers) {
    const newLayers = [];
    const testlayers = [];
    eventLayers.forEach((event, eventIndex) => {
      layers.forEach((layer, layerIndex) => {
        if (event.id === layer.settings.id) {
          newLayers[eventIndex] = layer;
          testlayers.push(layer.settings.name)
        }
      })
    });
    return newLayers;
  }

  drawMapDataTable(event) {
    this.hideTable = false;
    this.mapTable.headers = this.prepareTableHeaders(event.layers);
    this.mapTable.rows = this.prepareTableRows(event.layers);
  }

  addNewLayer() {
    // this.layerSelectionForm = true;
  }

  refineHeight(mapHeight) {
    let height = '';
    if (mapHeight.indexOf('vh') >= 0) {
      const splitMap = mapHeight.split('vh');
      height = ((+splitMap[0]) + 2) + 'vh';
    }
    if (mapHeight.indexOf('px') >= 0) {
      const splitMap = mapHeight.split('px');
      height = ((+splitMap[0]) - 10) + 'px';
    }
    return height;
  }

  hideDataTable() {
    this.hideTable = true;
  }

  prepareTableHeaders(layers) {
    const headers: any = [];
    layers.forEach((layer, index) => {
      if (layer.analytics && layer.analytics.hasOwnProperty('headers')) {
        headers.push(layer.settings.name + '$' + index);
      }
    });
    return headers;
  }

  prepareTableRows(layers) {
    const rowArray = {};
    layers.forEach((layer, index) => {
      const rows = [];
      if (layer.analytics && layer.analytics.hasOwnProperty('headers')) {
        const headers = layer.analytics.headers;
        const names = layer.analytics.metaData.names;
        const indexOU = _.findIndex(layer.analytics.headers, ['name', 'ou']);
        const indexVal = _.findIndex(layer.analytics.headers, ['name', 'value']);
        layer.analytics.rows.forEach(row => {
          const columns = [];
          columns.push(names[row[indexOU]]);
          columns.push(row[indexVal]);
          rows.push(columns);
        });
        rowArray[layer.settings.name + '$' + index] = rows;
      }
    });
    return rowArray;
  }

}
