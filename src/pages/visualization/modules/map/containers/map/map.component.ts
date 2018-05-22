import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import { Map, LatLngExpression, control, LatLngBoundsExpression } from 'leaflet';
import { VisualizationLayer } from '../../../../models/visualization-layer.model';
import { VisualizationConfig } from '../../../../models/visualization-config.model';
import { VisualizationUiConfig } from '../../../../models/visualization-ui-config.model';
import { getSplitedVisualizationLayers } from '../../../../helpers/get-splited-visualization-layers.helper';

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
  public isLoaded$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public visualizationObject$: Observable<VisualizationObject>;
  public visualizationLegendIsOpen$: Observable<boolean>;
  private mapConfiguration: MapConfiguration;
  private visObject: VisualizationObject;
  public loading: boolean = true;
  public mapWidth: any = '100%';
  public map: any = {};
  public subtitle: string = '';
  public visualizationObject: any;
  public mapHeight: string;
  public displayConfigurations: any = {};

  @Input() vizObject: any;
  @Input() id: string;
  @Input() visualizationLayers: VisualizationLayer[];
  @Input() visualizationConfig: VisualizationConfig;
  @Input() visualizationUiConfig: VisualizationUiConfig;

  constructor(private store: Store<fromStore.MapState>) {
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.isLoading$ = this.store.select(fromStore.isVisualizationObjectsLoading);
    this.store.dispatch(new fromStore.LoadAllLegendSet());
    this.store.dispatch(new fromStore.AddContectPath());
  }

  ngOnInit() {
    this.displayConfigurations = {
      itemHeight: this.visualizationUiConfig.height,
      mapWidth: '100%'
    };
    this.store.dispatch(new fromStore.InitiealizeVisualizationLegend(this.id));
    this.visualizationLegendIsOpen$ = this.store.select(
      fromStore.isVisualizationLegendOpen(this.id)
    );
    this.transformVisualizationObject(this.visualizationConfig,this.visualizationUiConfig, this.visualizationLayers);
    this.visualizationObject$ = this.store.select(
      fromStore.getCurrentVisualizationObject(this.id)
    );
  }

  transhformFavourites(data) {
    const { visObject, Layers } = fromUtils.transformFavourites(data);
    this.visObject = {
      ...this.visObject,
      componentId: this.id,
      mapConfiguration: visObject['mapConfiguration'],
      layers: Layers
    };

    if (Layers.length) {
      this.store.dispatch(new fromStore.CreateVisualizationObject(this.visObject));
    }
  }

  transformVisualizationObject(visualizationConfig: VisualizationConfig, visualizationUiConfig: VisualizationUiConfig, visualizationLayers: VisualizationLayer[]) {
    // TODO FIND A WAY TO GET GEO FEATURES HERE
    const { visObject } = fromUtils.transformVisualizationObject(
      visualizationConfig,
      visualizationUiConfig,
      getSplitedVisualizationLayers(visualizationConfig.type, visualizationLayers)
    );
    this.visObject = {
      ...this.visObject,
      componentId: this.id,
      ...visObject
    };

    this.store.dispatch(new fromStore.AddVisualizationObjectComplete(this.visObject));
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.id));
  }
}
