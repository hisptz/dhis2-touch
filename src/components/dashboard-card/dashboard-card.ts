import { Component,Input,Output,EventEmitter,OnInit } from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {VisualizationObjectServiceProvider} from '../../providers/visualization-object-service/visualization-object-service';
import {FavoriteServiceProvider} from '../../providers/favorite-service/favorite-service';
import {AnalyticsServiceProvider} from '../../providers/analytics-service/analytics-service';
import {Observable} from 'rxjs/Observable';
import {ChartServiceProvider} from '../../providers/chart-service/chart-service';
import {TableServiceProvider} from '../../providers/table-service/table-service';
import {MapServiceProvider} from '../../providers/map-service/map-service';
import {GeoFeatureServiceProvider} from '../../providers/geo-feature-service/geo-feature-service';
import {ResourceProvider} from "../../providers/resource/resource";
import * as _ from 'lodash';

/**
 * Generated class for the DashboardCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'dashboard-card',
  templateUrl: 'dashboard-card.html'
})
export class DashboardCardComponent implements OnInit{

  @Input() dashboardItem;
  @Input() dashboardId;
  @Input() dashBoardCardClass;
  @Input() isInFullScreen;
  @Output() loadInFullScreen = new EventEmitter();

  currentUser : any;
  visualizationObject: any;
  isVisualizationDataLoaded: boolean;
  visualizationType: string;

  visualizationOptions : any;
  zoomIcon : string;
  filterIcon : string;

  constructor(private userProvider : UserProvider,
              private visualizationObjectService: VisualizationObjectServiceProvider,
              private favoriteService: FavoriteServiceProvider,
              private analyticsService: AnalyticsServiceProvider,
              private chartService: ChartServiceProvider,
              private tableService: TableServiceProvider,
              private mapService: MapServiceProvider,
              private resourceProvider : ResourceProvider,
              private geoFeatureService: GeoFeatureServiceProvider
              ) {

  }


  ngOnInit() {
    this.zoomIcon = 'assets/dashboard/full-screen.png';
    this.filterIcon = 'assets/dashboard/filter.png';
    this.visualizationOptions = this.resourceProvider.getVisualizationIcons().visualizationType;

    this.userProvider.getCurrentUser().then((currentUser :any)=>{
      this.currentUser = currentUser;
      const initialVisualizationObject = this.visualizationObjectService.loadInitialVisualizationObject(
        {
          dashboardItem: this.dashboardItem,
          dashboardId: this.dashboardId,
          currentUser: currentUser
        }
      );

      this.visualizationObject = initialVisualizationObject;
      this.isVisualizationDataLoaded = initialVisualizationObject.details.loaded;
      this.visualizationType = initialVisualizationObject.details.currentVisualization;

      //todo double check why layers are reset after call get favorites
      if (initialVisualizationObject.type === 'USERS' || initialVisualizationObject.type === 'REPORTS' || initialVisualizationObject.type === 'RESOURCES' || initialVisualizationObject.type === 'APP') {
        this.visualizationObject.details.loaded = true;
        this.isVisualizationDataLoaded = this.visualizationObject.details.loaded;
      }else{
        this.favoriteService.getFavorite({
            visualizationObject: initialVisualizationObject,
            apiRootUrl: '/api/25/'
          },
          currentUser
        ).subscribe(favoriteResult => {
          if (favoriteResult) {
            /**
             * Extend visualization object with favorite
             * @type {any}
             */
            const visualizationObjectWithFavorite = this.extendVisualizationWithFavorite(
              initialVisualizationObject,
              favoriteResult.favorite,
              favoriteResult.error);

            const visualizationFilterResults = this.favoriteService.getVisualizationFiltersFromFavorite(favoriteResult);

            /**
             * Extend visualization object with filters
             */
            const visualizatiobObjectWithFilters = this.extendVisualizationObjectWithFilters(
              visualizationObjectWithFavorite,
              visualizationFilterResults.filters);

            const visualizationDetailsWithFiltersAndLayout = this.favoriteService.getVisualizationLayoutFromFavorite(
              visualizationFilterResults
            );

            /**
             * Extend visualization object with layouts
             */
            const visualizationObjectWithLayout = this.extendVisualizationObjectWithLayout(
              visualizatiobObjectWithFilters,
              visualizationDetailsWithFiltersAndLayout.layouts
            );

            if (visualizationDetailsWithFiltersAndLayout) {
              this.analyticsService.getAnalytics(
                visualizationDetailsWithFiltersAndLayout,
                currentUser
              ).subscribe(visualizationWithAnalytics => {

                /**
                 * Extend visualization object with analytics
                 */
                const visualizationObjectWithAnalytics = this.extendVisualizationWithAnalytics(
                  visualizationObjectWithLayout,
                  visualizationWithAnalytics.analytics
                )

                this.extendVisualizationObjectWithDrawingObjects(
                  visualizationObjectWithAnalytics, currentUser
                ).subscribe((visualizatioObject: any) => {
                  this.visualizationObject = visualizatioObject;
                  this.isVisualizationDataLoaded = visualizatioObject.details.loaded;
                })
              })
            }

          }

        })
      }


    })
  }

  updateVisualizationType(visualizationType){

    //@todo logic to update visualization, instance chart, map and table

    //deactivate selected type
    this.visualizationOptions.forEach((visualization : any)=>{
      if(visualization.type == visualizationType){
        visualization.isDisabled = true;
      }else{
        visualization.isDisabled = false;
      }
    });

    this.visualizationType = visualizationType;
    this.visualizationObject.details.loaded = false;
    this.isVisualizationDataLoaded = false;
    this.visualizationObject.details.currentVisualization = visualizationType;

    this.extendVisualizationObjectWithDrawingObjects(this.visualizationObject, this.currentUser)
      .subscribe((newVisualizationObject: any) => {
        this.visualizationObject = _.assign({}, newVisualizationObject);
        this.isVisualizationDataLoaded = newVisualizationObject.details.loaded;
      })
  }

  loadFullScreenDashboard(){
    let data = {
      dashboardItem : this.dashboardItem,
      dashboardId : this.dashboardId
    };
    this.loadInFullScreen.emit(data);
  }

  updateVisualizationWithNewChartType(chartType) {
    this.visualizationObject.details.loaded = false;
    this.isVisualizationDataLoaded = false;
    this.extendVisualizationObjectWithDrawingObjects(this.visualizationObject, this.currentUser, chartType)
      .subscribe((newVisualizationObject: any) => {
        setTimeout(()=>{
          this.visualizationObject = _.assign({}, newVisualizationObject);
          this.isVisualizationDataLoaded = newVisualizationObject.details.loaded;
        },70);
      })
  }

  extendVisualizationObjectWithLayout(visualizationObject: any, layouts: any) {
    const newVisualizationObject = _.clone(visualizationObject);
    const newVisualizationDetails = _.clone(newVisualizationObject.details);

    newVisualizationDetails.layouts = layouts;

    newVisualizationObject.details = _.assign({}, newVisualizationDetails);

    return newVisualizationObject;
  }

  extendVisualizationObjectWithFilters(visualizationObject: any, filters: any) {
    const newVisualizationObject = _.clone(visualizationObject);
    const newVisualizationDetails = _.clone(newVisualizationObject.details);

    newVisualizationDetails.filters = filters;

    newVisualizationObject.details = _.assign({}, newVisualizationDetails);

    return newVisualizationObject;
  }

  extendVisualizationWithFavorite(visualizationObject, favoriteObject, favoriteError) {
    const currentVisualizationObject: any = _.clone(visualizationObject);
    if (!favoriteError) {
      /**
       * Update visualization settings with favorite if no error
       */
      currentVisualizationObject.layers = this.mapFavoriteToLayerSettings(favoriteObject);

      if (favoriteObject) {
        /**
         * Also get map configuration if current visualization is map
         */
        if (currentVisualizationObject.details.currentVisualization === 'MAP') {
          currentVisualizationObject.details.basemap = favoriteObject.basemap;
          currentVisualizationObject.details.zoom = favoriteObject.zoom;
          currentVisualizationObject.details.latitude = favoriteObject.latitude;
          currentVisualizationObject.details.longitude = favoriteObject.longitude;
        }
      }
    } else {
      /**
       * Get error message
       */
      currentVisualizationObject.details.errorMessage = favoriteError;
      currentVisualizationObject.details.hasError = true;
      currentVisualizationObject.details.loaded = true;
    }

    return currentVisualizationObject;
  }

  mapFavoriteToLayerSettings(favoriteObject: any) {
    if (favoriteObject.mapViews) {
      return _.map(favoriteObject.mapViews, (view: any) => {
        return {settings: view}
      });
    }
    return [{settings: favoriteObject}];
  }

  extendVisualizationWithAnalytics(visualizationObject: any, loadedAnalytics: any[]) {
    const newVisualizationObject: any = _.clone(visualizationObject);
    /**
     * Update visualization layer with analytics
     */
    newVisualizationObject.layers = _.map(newVisualizationObject.layers, (layer: any) => {
      const newLayer = _.clone(layer);
      const newSettings = newLayer ? newLayer.settings : null;
      const analyticsObject = _.find(loadedAnalytics, ['id', newSettings !== null ? newSettings.id : '']);
      if (analyticsObject) {
        newLayer.analytics = Object.assign({}, analyticsObject.content);
      }
      return newLayer;
    });

    /**
     * Make a copy of layers for later use
     */
    newVisualizationObject.operatingLayers = _.assign([], newVisualizationObject.layers);

    return newVisualizationObject;
  }

  extendVisualizationObjectWithDrawingObjects(currentVisualizationObject: any, currentUser: any, chartType?: string) {
    const currentVisualization: string = currentVisualizationObject.details.currentVisualization;
    const newVisualizationObject = _.clone(currentVisualizationObject);

    /**
     * Take original copy of layers
     */
    newVisualizationObject.layers = _.assign([], newVisualizationObject.operatingLayers);

    return Observable.create(observer => {
      if (currentVisualization === 'CHART') {
        const mergeVisualizationObject = this.visualizationObjectService.mergeVisualizationObject(newVisualizationObject);


        /**
         * Update visualization layers with chart configuration
         */
        const visualizationObjectLayersWithChartConfiguration = _.map(mergeVisualizationObject.layers, (layer, layerIndex) => {
          const newLayer = _.clone(layer);
          const newSettings = _.clone(layer.settings);

          /**
           * Updated settings with new chart type if any
           */
          if (chartType) {
            newSettings.type = chartType;
          }

          newSettings.chartConfiguration = _.assign({}, this.chartService.getChartConfiguration1(
            newSettings,
            mergeVisualizationObject.id + '_' + layerIndex,
            mergeVisualizationObject.details.layouts
          ));
          newLayer.settings = _.assign({}, newSettings);
          return newLayer;
        });

        /**
         * Update visualization layers with chart object
         */
        const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithChartConfiguration, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.chartObject = _.assign({}, this.chartService.getChartObject(newLayer.analytics, newLayer.settings.chartConfiguration));
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);

        const settings =  _.map(newVisualizationObject.layers, (layer: any) => layer.settings);
        newVisualizationObject.details.loaded = true;
        newVisualizationObject.details.chartType = chartType ? chartType :
          settings && settings.length > 0 ? _.lowerCase(settings[0].type) : '';

        observer.next(newVisualizationObject);
        observer.complete();

      } else if (currentVisualization === 'TABLE') {
        const mergeVisualizationObject = this.visualizationObjectService.mergeVisualizationObject(newVisualizationObject);

        /**
         * Update visualization layers with table configuration
         */
        const visualizationObjectLayersWithTableConfiguration = _.map(mergeVisualizationObject.layers, (layer, layerIndex) => {
          const newLayer = _.clone(layer);
          const newSettings = _.clone(layer.settings);
          newSettings.tableConfiguration = _.assign({}, this.tableService.getTableConfiguration1(
            newSettings,
            mergeVisualizationObject.details.layouts,
            mergeVisualizationObject.type
          ));
          newLayer.settings = _.assign({}, newSettings);
          return newLayer;
        });

        /**
         * Update visualization layers with table object
         */
        const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithTableConfiguration, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.tableObject = _.assign({}, this.tableService.getTableObject(newLayer.analytics,newLayer.settings, newLayer.settings.tableConfiguration));
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);
        newVisualizationObject.details.loaded = true;
        observer.next(newVisualizationObject);
        observer.complete();
      } else if (currentVisualization === 'MAP') {
        const splitedVisualizationObject = newVisualizationObject.details.type !== 'MAP' ?
          this.visualizationObjectService.splitVisualizationObject(newVisualizationObject) :
          _.clone(newVisualizationObject);


        const newVisualizationDetails = _.clone(splitedVisualizationObject.details);

        /**
         * Update with map configuration
         */
        newVisualizationDetails.mapConfiguration = _.assign({}, this.mapService.getMapConfiguration(splitedVisualizationObject));


        /**
         * Update with geo features
         */
        this.geoFeatureService.getGeoFeature({
          apiRootUrl: '/api/25/',
          visualizationObject: splitedVisualizationObject
        }, currentUser).subscribe((geoFeatureResponse: any) => {

          if (geoFeatureResponse.geoFeatures) {
            splitedVisualizationObject.layers = _.map(splitedVisualizationObject.layers, (layer: any) => {
              const newLayer = _.clone(layer);
              const newSettings = _.clone(layer.settings);
              const availableGeoFeatureObject: any = _.find(geoFeatureResponse.geoFeatures, ['id', newSettings.id]);

              if (availableGeoFeatureObject) {
                if (availableGeoFeatureObject.content.length === 0) {
                  // newVisualizationDetails.hasError = true;
                  // newVisualizationDetails.errorMessage = 'Coordinates for displaying a map are missing';
                } else {
                  newSettings.geoFeature = _.assign([], availableGeoFeatureObject.content);
                }
              }
              newLayer.settings = _.assign({}, newSettings);

              return newLayer;
            });
          }

          newVisualizationDetails.loaded = true;
          splitedVisualizationObject.details = _.assign({}, newVisualizationDetails);
          observer.next(splitedVisualizationObject);
          observer.complete();
        })
      } else {
        newVisualizationObject.details.loaded = true;
        observer.next(newVisualizationObject);
        observer.complete();
      }
    })
  }


}
