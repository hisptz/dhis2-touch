import { Component, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges, SimpleChange, Input, AfterViewInit } from '@angular/core';
import { VisualizationObject } from '../../models/visualization-object.model';
import { Store } from '@ngrx/store';
import { getTileLayer } from '../../constants/tile-layer.constant';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import { interval } from 'rxjs/observable/interval';
import * as fromStore from '../../store';
import * as fromLib from '../../lib';
import * as fromUtils from '../../utils';
import * as L from 'leaflet';
import * as _ from 'lodash';

@Component({
  selector: 'app-map-visualizer',
  templateUrl: './map-visualizer.component.html',
  styles: [
    `:host {
      display: block;
      width: 100%;
      height: 100%;
    }
  }`
  ]
})
export class MapVisualizerComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() visualizationObject: VisualizationObject;
  @Input() displayConfigurations: any;
  @Input() visualizationLegendIsOpen: boolean;
  @Input() isDataTableOpen: boolean;
  @Input() baselayerLegend: any;
  @Input() currentLegendSets: any;

  private leafletLayers: any = {};
  private layersBounds;
  private basemap: any;
  private _baseLayerLegend;
  private _currentLegendSets;

  public mapHasGeofeatures: boolean = true;
  public mapHasDataAnalytics: boolean = true;
  public fullScreen: boolean;
  public map: any;

  constructor(private store: Store<fromStore.MapState>) {}
  ngOnChanges(changes: SimpleChanges) {
    const { visualizationObject, displayConfigurations, baselayerLegend, currentLegendSets } = changes;
    this.createMap();
    if (currentLegendSets && currentLegendSets.currentValue) {
      this._currentLegendSets = currentLegendSets.currentValue;
    }
    if (baselayerLegend && baselayerLegend.currentValue) {
      this._baseLayerLegend = baselayerLegend.currentValue;
    }

    if (
      visualizationObject &&
      !visualizationObject.isFirstChange() &&
      visualizationObject.previousValue !== visualizationObject.currentValue
    ) {
      this.redrawMapOndataChange(visualizationObject.currentValue);
      this.legendsAndBaseLayer();
    }

    if ((currentLegendSets || baselayerLegend) && this.map) {
      this.legendsAndBaseLayer();
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeMapContainer();
    interval(2)
      .take(1)
      .subscribe(() => {
        this.initialMapDraw(this.visualizationObject);
        this.legendsAndBaseLayer();
      });
  }

  zoomIn(event) {
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {
    this.map.fitBounds(this.layersBounds);
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.visualizationObject.componentId));
  }

  createMap() {
    const { geofeatures, analytics, layers } = this.visualizationObject;
    const allGeofeatures = Object.keys(geofeatures).map(key => {
      return geofeatures[key];
    });
    const allDataAnalytics = Object.keys(analytics).filter(
      key => (analytics[key] && analytics[key].rows && analytics[key].rows.length > 0) || (analytics[key] && analytics[key].count)
    );
    if (![].concat.apply([], allGeofeatures).length) {
      this.mapHasGeofeatures = false;
    }
    if (!allDataAnalytics.length) {
      this.mapHasDataAnalytics = false;
    }

    layers.map(layer => {
      if (layer.type === 'event') {
        const headers = analytics[layer.id] && analytics[layer.id].headers;
        if (_.find(headers, { name: 'latitude' })) {
          this.mapHasGeofeatures = true;
        }
        if (layer.layerOptions.serverClustering) {
          this.mapHasGeofeatures = true;
        }
      } else if (layer.type === 'facility') {
        const { dataSelections } = layer;
        const { organisationUnitGroupSet } = dataSelections;
        if (Object.keys(organisationUnitGroupSet)) {
          this.mapHasDataAnalytics = true;
        }
      } else if (layer.type === 'earthEngine') {
        this.mapHasDataAnalytics = true;
        // Boundary layer do not have data.
      } else if (layer.type === 'boundary') {
        this.mapHasDataAnalytics = true;
      }
    });
  }

  initializeMapContainer() {
    const { itemHeight, mapWidth } = this.displayConfigurations;
    const { mapConfiguration, componentId } = this.visualizationObject;
    const fullScreen = (mapConfiguration && mapConfiguration.fullScreen) || itemHeight === '100vh';
    this.fullScreen = fullScreen;
    const container = fromUtils.prepareMapContainer(componentId, itemHeight, mapWidth, false);
    const otherOptions = {
      zoomControl: false,
      maxZoom: 12,
      fadeAnimation: false,
      scrollWheelZoom: fullScreen,
      worldCopyJump: true
    };
    this.map = L.map(container, otherOptions);
    if (fullScreen) {
      this.store.dispatch(new fromStore.FullScreenOpenVisualizationLegend(componentId));
    }
    this.map.scrollWheelZoom.disable();
  }

  initialMapDraw(visualizationObject: VisualizationObject) {
    const { mapConfiguration } = visualizationObject;
    const { overlayLayers, layersBounds, legendSets } = this.prepareLegendAndLayers(visualizationObject);
    this.drawBaseAndOverLayLayers(mapConfiguration, overlayLayers, layersBounds);
    if (Object.keys(legendSets).length) {
      this._currentLegendSets = legendSets;
      this.store.dispatch(new fromStore.AddLegendSet({ [this.visualizationObject.componentId]: legendSets }));
    }
  }

  layerFitBound(bounds: L.LatLngBoundsExpression) {
    this.map.fitBounds(bounds);
  }

  createPane(labels, id, index, areaRadius) {
    const zIndex = 600 - index * 10;
    this.map.createPane(id);
    this.map.getPane(id).style.zIndex = zIndex.toString();

    if (labels) {
      const paneLabelId = `${id}-labels`;
      const labelPane = this.map.createPane(paneLabelId);
      this.map.getPane(paneLabelId).style.zIndex = (zIndex + 1).toString();
    }
    if (areaRadius) {
      const areaID = `${id}-area`;
      const areaPane = this.map.createPane(areaID);
      this.map.getPane(areaID).style.zIndex = (zIndex - 1).toString();
    }
  }

  initializeMapConfiguration(mapConfiguration: MapConfiguration) {
    const { latitude, longitude, zoom } = mapConfiguration;
    let center: L.LatLngExpression = [
      Number(fromLib._convertLatitudeLongitude(latitude)),
      Number(fromLib._convertLatitudeLongitude(longitude))
    ];
    if (!latitude && !longitude) {
      center = [6.489, 21.885];
    }
    const _zoom = zoom || 6;

    this.map.setView(center, _zoom, { reset: true });
  }

  createLayer(optionsLayer, index) {
    if (optionsLayer) {
      const { displaySettings, id, geoJsonLayer, visible, type, areaRadius } = optionsLayer;
      this.createPane(displaySettings.labels, id, index, areaRadius);
      this.setLayerVisibility(visible, geoJsonLayer);
    }
  }

  setLayerVisibility(isVisible, layer) {
    if (isVisible && this.map.hasLayer(layer) === false) {
      this.map.addLayer(layer);
    } else if (!isVisible && this.map.hasLayer(layer) === true) {
      this.map.removeLayer(layer);
    }
  }

  createBaseLayer(basemap?: string) {
    const mapTileLayer = getTileLayer(basemap);
    const baseMapLayer = fromLib.LayerType[mapTileLayer.type](mapTileLayer);
    return baseMapLayer;
  }

  drawBaseAndOverLayLayers(mapConfiguration, overlayLayers, layersBounds) {
    this.initializeMapConfiguration(mapConfiguration);

    this.basemap = this.createBaseLayer(mapConfiguration.basemap);

    const name = mapConfiguration.basemap || 'osmLight';
    const opacity = 1;
    const changedBaseLayer = false;
    const hidden = false;
    const { componentId } = this.visualizationObject;
    const payload = { [componentId]: { name, opacity, changedBaseLayer, hidden } };
    this._baseLayerLegend = { name, opacity, changedBaseLayer, hidden };
    this.store.dispatch(new fromStore.AddBaseLayer(payload));

    overlayLayers.map((layer, index) => {
      this.createLayer(layer, index);
    });

    if (layersBounds.length) {
      this.layersBounds = layersBounds;
      this.layerFitBound(layersBounds);
    }
  }

  prepareLegendAndLayers(visualizationObject: VisualizationObject) {
    const overlayLayers = fromLib.GetOverLayLayers(visualizationObject);
    const layersBounds = [];
    let legendSets = {};
    overlayLayers.map((layer, index) => {
      if (layer) {
        const { bounds, legendSet, geoJsonLayer, id } = layer;
        if (bounds) {
          layersBounds.push(bounds);
        }
        if (legendSet && legendSet.legend) {
          const legendEntity = { [id]: legendSet };
          legendSets = { ...legendSets, ...legendEntity };
        }
        const layermap = { [id]: geoJsonLayer };
        this.leafletLayers = { ...this.leafletLayers, ...layermap };
      }
    });

    return {
      overlayLayers,
      layersBounds,
      legendSets
    };
  }

  legendsAndBaseLayer() {
    if (this._baseLayerLegend) {
      const { name, opacity, changedBaseLayer, hidden } = this._baseLayerLegend;
      if (changedBaseLayer) {
        const baseMapLayer = this.createBaseLayer(name);
        this.setLayerVisibility(false, this.basemap);
        this.basemap = baseMapLayer;
      }
      const visible = !hidden;
      this.setLayerVisibility(visible, this.basemap);
      this.basemap.setOpacity(opacity);
    }
    if (this._currentLegendSets && Object.keys(this._currentLegendSets).length) {
      Object.keys(this._currentLegendSets).map(key => {
        const legendSet = this._currentLegendSets[key];
        const { opacity, layer, hidden, legend, cluster } = legendSet;
        const tileLayer = legend.type === 'external' || cluster || legend.type === 'earthEngine';
        const leafletlayer = this.leafletLayers[layer];
        // Check if there is that layer otherwise errors when resizing;
        if (leafletlayer && !tileLayer) {
          leafletlayer.setStyle({
            opacity,
            fillOpacity: opacity
          });
        }
        if (tileLayer) {
          // leafletlayer.setOpacity(opacity);
        }
        const visible = !hidden;
        if (leafletlayer) {
          this.setLayerVisibility(visible, leafletlayer);
        }
      });
    }
  }

  redrawMapOndataChange(visualizationObject: VisualizationObject) {
    Object.keys(this.leafletLayers).map(key => this.map.removeLayer(this.leafletLayers[key]));
    const { mapConfiguration } = visualizationObject;
    const { overlayLayers, layersBounds, legendSets } = this.prepareLegendAndLayers(visualizationObject);
    overlayLayers.map((layer, index) => {
      this.createLayer(layer, index);
    });

    if (Object.keys(legendSets).length) {
      this._currentLegendSets = legendSets;
      this.store.dispatch(new fromStore.AddLegendSet({ [visualizationObject.componentId]: legendSets }));
    }

    if (layersBounds.length) {
      this.layersBounds = layersBounds;
      this.layerFitBound(layersBounds);
    }
  }
}
