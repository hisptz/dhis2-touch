import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { getTileLayer } from '../../constants/tile-layer.constant';
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import * as fromLib from '../../lib';
import { Map, LatLngExpression, control, LatLngBoundsExpression } from 'leaflet';

import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { map, filter, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styles: [
    `:host {
      display: block;
      width: 100%;
      height: 100%;
    }
  }`
  ]
})
export class MapComponent implements OnInit {
  public currentMapLayers$: Observable<Layer[]>;
  public isLoaded$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public visualizationObject$: Observable<VisualizationObject>;
  public visualizationObjectEntities$: Observable<any>;
  public visualizationLegendIsOpen$: Observable<boolean>;
  private mapConfiguration: MapConfiguration;
  private Layers: Layer[] = [];
  private visObject: VisualizationObject;
  public loading: boolean = true;
  public hasError: boolean = false;
  public errorMessage: string;
  public legendIsOpen: boolean = false;
  public mapWidth: any = '100%';
  public map: any = {};
  public centeringLayer: any;
  public mapLegend: any;
  public legendMarginRight = '25px';
  public legendMarginLeft = '200px';
  private cardHeight: string = '490px';
  private itemHeight: string = '91.5vh';
  public subtitle: string = '';
  public pinned: boolean = false;
  public operatingLayers: Array<any> = [];
  public isFullScreen: boolean = false;
  public hideTable: boolean = true;
  public showCenterButton: boolean = false;
  public mapOptions: any;
  public visualizationObject: any;
  public componentId = 'RBoGyrUJDOu';
  public mapHeight: string;
  public displayConfigurations: any = {};
  private _data$ = new BehaviorSubject<any>({});
  private _vizObject$ = new BehaviorSubject<any>({});

  @Input() vizObject: any;
  // @Input()
  // set data(value) {
  //   // set the latest value for _data$ BehaviorSubject
  //   this._data$.next(value);
  // }
  //
  // get data() {
  //   // get the latest value from _data$ BehaviorSubject
  //   return this._data$.getValue();
  // }

  constructor(private store: Store<fromStore.MapState>) {
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.isLoading$ = this.store.select(fromStore.isVisualizationObjectsLoading);
  }

  ngOnInit() {
    this.store.dispatch(new fromStore.AddContectPath());
    if (this.vizObject) {
      this.componentId = this.vizObject.id;
      this.itemHeight = this.vizObject.details.cardHeight;
      this.displayConfigurations = {
        itemHeight: this.vizObject.details.cardHeight,
        mapWidth: '100%'
      };
      this.store.dispatch(new fromStore.InitiealizeVisualizationLegend(this.vizObject.id));
      this.visualizationLegendIsOpen$ = this.store.select(
        fromStore.isVisualizationLegendOpen(this.vizObject.id)
      );
      this.transformVisualizationObject(this.vizObject);
      this.visualizationObject$ = this.store.select(
        fromStore.getCurrentVisualizationObject(this.vizObject.id)
      );
    }
  }

  transhformFavourites(data) {
    const { visObject, Layers } = fromUtils.transformFavourites(data);
    this.visObject = {
      ...this.visObject,
      componentId: this.componentId,
      mapConfiguration: visObject['mapConfiguration'],
      layers: Layers
    };

    if (Layers.length) {
      this.store.dispatch(new fromStore.CreateVisualizationObject(this.visObject));
    }
  }

  transformVisualizationObject(data) {
    // TODO FIND A WAY TO GET GEO FEATURES HERE
    const { visObject } = fromUtils.transformVisualizationObject(data);
    this.visObject = {
      ...this.visObject,
      componentId: this.componentId,
      ...visObject
    };
    this.store.dispatch(new fromStore.AddVisualizationObjectComplete(this.visObject));
  }

  initializeMapContainer() {
    const mapHeight = fromUtils.refineHeight(this.itemHeight);
    const container = fromUtils.prepareMapContainer(
      this.componentId,
      this.itemHeight,
      this.mapWidth,
      this.isFullScreen
    );
    const otherOptions = {
      zoomControl: false,
      scrollWheelZoom: false,
      worldCopyJump: true
    };
    this.map = new Map(container, otherOptions);
  }

  initializeMapBaseLayer(mapConfiguration: MapConfiguration) {
    const center: LatLngExpression = [
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.latitude)),
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.longitude))
    ];
    const zoom = mapConfiguration.zoom;

    const mapTileLayer = getTileLayer(mapConfiguration.basemap);
    const baseMapLayer = fromLib.LayerType[mapTileLayer.type](mapTileLayer);

    this.map.setView(center, zoom, { reset: true });
    // Add baseMap Layer;
    this.map.addLayer(baseMapLayer);
  }

  mapAddControl(mapControl) {
    let newControl = mapControl;

    if (mapControl.type && control[mapControl.type]) {
      newControl = control[mapControl.type](mapControl);
    }
    this.map.addControl(newControl);
  }

  createLayer(optionsLayer, index) {
    const { displaySettings, id, geoJsonLayer, visible } = optionsLayer;
    this.createPane(displaySettings.labels, id, index);
    this.setLayerVisibility(visible, geoJsonLayer);
  }

  createPane(labels, id, index) {
    const zIndex = 600 - index * 10;
    this.map.createPane(id);
    this.map.getPane(id).style.zIndex = zIndex.toString();

    if (labels) {
      const paneLabelId = `${id}-labels`;
      const labelPane = this.map.createPane(paneLabelId);
      this.map.getPane(paneLabelId).style.zIndex = (zIndex + 1).toString();
    }
  }

  onLayerAdd(index, optionsLayer) { }

  setLayerVisibility(isVisible, layer) {
    if (isVisible && this.map.hasLayer(layer) === false) {
      this.map.addLayer(layer);
    } else if (!isVisible && this.map.hasLayer(layer) === true) {
      this.map.removeLayer(layer);
    }
  }

  layerFitBound(bounds: LatLngBoundsExpression) {
    this.map.invalidateSize();
    this.map.fitBounds(bounds);
  }

  zoomIn(event) {
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {
    this.map.eachLayer(layer => console.log(layer.getBounds()));
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.componentId));
  }
}
