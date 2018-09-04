import {
  AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { VisualizationState } from '../../store/reducers';
import { Observable } from 'rxjs/Observable';
import { Visualization } from '../../models/visualization.model';
import {
  getCurrentVisualizationProgress,
  getVisualizationObjectById
} from '../../store/selectors/visualization-object.selectors';
import {
  InitializeVisualizationObjectAction,
  UpdateVisualizationObjectAction
} from '../../store/actions/visualization-object.actions';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { getCurrentVisualizationObjectLayers } from '../../store/selectors/visualization-layer.selectors';
import { getCurrentVisualizationUiConfig } from '../../store/selectors/visualization-ui-configuration.selectors';
import { Subject } from 'rxjs/Subject';
import { VisualizationInputs } from '../../models/visualization-inputs.model';
import { VisualizationProgress } from '../../models/visualization-progress.model';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { getCurrentVisualizationConfig } from '../../store/selectors/visualization-configuration.selectors';
import {
  ShowOrHideVisualizationBodyAction,
  ToggleFullScreenAction
} from '../../store/actions/visualization-ui-configuration.actions';
import {
  UpdateVisualizationConfigurationAction
} from '../../store/actions/visualization-configuration.actions';
import { NavController } from 'ionic-angular';
import { LoadVisualizationAnalyticsAction } from '../../store/actions/visualization-layer.actions';

@Component({
  selector: 'app-visualization-card',
  templateUrl: 'visualization-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizationCard implements OnInit, OnChanges, AfterViewInit {

  @Input() id: string;
  @Input() type: string;
  // TODO find generic way for handling full screen
  @Input() fullScreen: boolean;
  @Input() visualizationLayers: VisualizationLayer[];
  @Output() fullScreenLeave: EventEmitter<any> = new EventEmitter<any>();
  private _visualizationInputs$: Subject<VisualizationInputs> = new Subject();
  visualizationObject$: Observable<Visualization>;
  visualizationLayers$: Observable<VisualizationLayer[]>;
  visualizationUiConfig$: Observable<VisualizationUiConfig>;
  visualizationProgress$: Observable<VisualizationProgress>;
  visualizationConfig$: Observable<VisualizationConfig>;

  constructor(private store: Store<VisualizationState>, public navCtrl: NavController) {
    this._visualizationInputs$.asObservable().
      subscribe((visualizationInputs) => {
        if (visualizationInputs) {
          // initialize visualization object
          this.store.dispatch(new InitializeVisualizationObjectAction(visualizationInputs.id));

          // Get selectors
          this.visualizationObject$ = this.store.select(getVisualizationObjectById(visualizationInputs.id));
          this.visualizationLayers$ = this.store.select(getCurrentVisualizationObjectLayers(visualizationInputs.id));
          this.visualizationUiConfig$ =
            this.store.select(getCurrentVisualizationUiConfig(visualizationInputs.id));
          this.visualizationProgress$ = this.store.select(getCurrentVisualizationProgress(visualizationInputs.id));
          this.visualizationConfig$ = this.store.select(getCurrentVisualizationConfig(visualizationInputs.id));
        }
      });
  }

  ngOnChanges() {
    this._visualizationInputs$.next({id: this.id, type: this.type, visualizationLayers: this.visualizationLayers});
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  onToggleVisualizationBody(uiConfig) {
    this.store.dispatch(new ShowOrHideVisualizationBodyAction(uiConfig.id, {showBody: uiConfig.showBody}));
  }

  onVisualizationTypeChange(visualizationTypeObject) {
    this.store.dispatch(
      new UpdateVisualizationConfigurationAction(visualizationTypeObject.id,
        {currentType: visualizationTypeObject.type}));
  }

  onFullScreenAction(event: {fullScreen: boolean, uiConfigId: string}) {
    this.store.dispatch(new ToggleFullScreenAction(event.uiConfigId));

    if (event.fullScreen) {
      this.fullScreenLeave.emit(null);
    } else {
      this.navCtrl.push('VisualizationItemPage', {id: this.id, uiConfigId: event.uiConfigId});
    }
  }

  onVisualizationLayerUpdate(visualizationLayer: VisualizationLayer) {
    this.store.dispatch(
      new UpdateVisualizationObjectAction(this.id, {
        progress: {
          statusCode: 200,
          statusText: 'OK',
          percent: 50,
          message: 'Favorite information has been loaded'
        }
      })
    );

    this.store.dispatch(new LoadVisualizationAnalyticsAction(this.id, [visualizationLayer]));
  }

}
