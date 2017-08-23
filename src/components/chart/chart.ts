import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Visualization} from "../../model/visualization";
import {ChartTemplateComponent} from "../chart-template/chart-template";
import {ResourceProvider} from "../../providers/resource/resource";
import * as _ from 'lodash';

/**
 * Generated class for the ChartComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chart',
  templateUrl: 'chart.html'
})
export class ChartComponent implements OnInit{

  @Input() visualizationObject: Visualization;
  @Input() isInFullScreen;
  @Output() onChartTypeUpdate: EventEmitter<string> = new EventEmitter<string>()
  @ViewChild(ChartTemplateComponent)
  chartTemplate: ChartTemplateComponent;
  private _showOptions: boolean;
  private _loaded: boolean;
  private _chartHasError: boolean;
  private _errorMessage: string;
  private _chartObjects: any;

  visualizationOptions : any;

  constructor(private resourceProvider : ResourceProvider,) {
    this._showOptions = false;
    this._loaded = false;
    this._chartHasError = false;
    this._chartObjects = [];
  }

  ngOnInit(){
    this.visualizationOptions = this.resourceProvider.getVisualizationIcons().charts;
    this._loaded = this.visualizationObject.details.loaded;
    this._chartHasError = this.visualizationObject.details.hasError;
    this._errorMessage = this.visualizationObject.details.errorMessage;

    /**
     * Get chart objects
     */
    if (this.visualizationObject.details.loaded) {
      // console.log(this.visualizationObject)
      const newChartObjects  = _.map(this.visualizationObject.layers, (layer) => { return layer.chartObject });
      this._chartObjects =_.filter(newChartObjects, (chartObject) => {
        return chartObject !== undefined
      });
    }
  }

  updateChart(chartType){
    if(this.visualizationObject.details.loaded){
      this.onChartTypeUpdate.emit(chartType);
      //deactivate selected type
      this.visualizationOptions.forEach((visualization : any)=>{
        if(visualization.type == chartType){
          visualization.isDisabled = true;
        }else{
          visualization.isDisabled = false;
        }
      });
    }
  }

  get chartObjects(): any {
    return this._chartObjects;
  }

  set chartObjects(value: any) {
    this._chartObjects = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  get chartHasError(): boolean {
    return this._chartHasError;
  }

  set chartHasError(value: boolean) {
    this._chartHasError = value;
  }

  get loaded(): boolean {
    return this._loaded;
  }

  set loaded(value: boolean) {
    this._loaded = value;
  }


  get showOptions(): boolean {
    return this._showOptions;
  }

  set showOptions(value: boolean) {
    this._showOptions = value;
  }


  download(downloadFormat) {
    if (this.chartTemplate) {
      this.chartTemplate.download(this.visualizationObject.name, downloadFormat);
    }
  }

  getChartError(errorMessage: string) {
    this._chartHasError = true;
    this._errorMessage = errorMessage;
  }

}
