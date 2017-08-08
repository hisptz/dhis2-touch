import { Component, OnInit} from '@angular/core';
import { IonicPage,ViewController } from 'ionic-angular';
import {DashboardServiceProvider} from "../../providers/dashboard-service/dashboard-service";
import {VisualizerService} from "../../providers/visualizer-service";
import {ResourceProvider} from "../../providers/resource/resource";

/**
 * Generated class for the InteractiveDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-interactive-dashboard',
  templateUrl: 'interactive-dashboard.html',
})
export class InteractiveDashboardPage implements OnInit{

  dashboardItem : any;
  dashboardItemData : any;
  analyticData : any;

  chartObject : any;
  tableObject : any;
  isVisualizationDataLoaded : boolean = false;
  visualizationType : string;

  visualizationTitle : string = 'Interactive Dashboard';

  isChartLoading : boolean = false;

  visualizationOptions : any = {
    top : [],
    bottom :  [],
    right : [],
    left : []
  };

  metadataIdentifiers : any;

  constructor(private DashboardServiceProvider : DashboardServiceProvider,
              private ResourceProvider : ResourceProvider,private viewCtrl : ViewController,
              private visualizationService : VisualizerService) {
  }

  ngOnInit(){
    this.isVisualizationDataLoaded = false;
    let data = this.DashboardServiceProvider.getCurrentFullScreenVisualizationData();
    this.analyticData = data.analyticData;
    this.dashboardItemData = data.dashboardItemData;
    this.dashboardItem = data.dashboardItem;
    if(this.dashboardItem.title){
      this.visualizationTitle = this.dashboardItem.title;
    }else if(this.dashboardItem.name){
      this.visualizationTitle = this.dashboardItem.name;
    }
    this.visualizationType = '';
    this.visualizationOptions.right = this.ResourceProvider.getVisualizationIcons().charts;
    this.visualizationOptions.bottom = this.ResourceProvider.getVisualizationIcons().visualizationType;
    this.initiateVisualization();
  }

  initiateVisualization(){
    if((this.dashboardItem.visualizationType == 'CHART') || (this.dashboardItem.visualizationType == 'EVENT_CHART')) {
      this.visualizationType = "chart";
      this.drawChart();
    } else if ((this.dashboardItem.visualizationType == 'TABLE') || (this.dashboardItem.visualizationType == 'EVENT_REPORT') || (this.dashboardItem.visualizationType == 'REPORT_TABLE')) {
      this.visualizationType = "table";
      this.drawTable();
    }else{
      this.visualizationType = 'not supported';
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  drawChart(chartType?:string) {
    this.isVisualizationDataLoaded = false;
    this.isChartLoading = true;
    let itemChartType = (this.dashboardItem.type) ? this.dashboardItem.type.toLowerCase() : 'bar';
    let layout: any = {};
    layout['series'] = this.dashboardItem.series ? this.dashboardItem.series : (this.dashboardItem.columns.length > 0) ?this.dashboardItem.columns[0].dimension :  'pe';
    layout['category'] = this.dashboardItem.category ? this.dashboardItem.category :(this.dashboardItem.rows.length > 0)? this.dashboardItem.rows[0].dimension : 'dx';
    this.chartObject = null;
    let chartConfiguration = {
      'type': chartType ? chartType : itemChartType,
      'title': "",
      'show_labels': true,
      'xAxisType': layout.category,
      'yAxisType': layout.series
    };
    this.chartObject = this.visualizationService.drawChart(this.analyticData, chartConfiguration);
    this.chartObject.chart["zoomType"] ="xy";
    this.chartObject["credits"] =  {enabled: false};
    setTimeout(()=>{
      this.isChartLoading = false;
    },500);

    this.isVisualizationDataLoaded = true;
  }

  drawTable() {
    this.isVisualizationDataLoaded = false;
    let dashboardObject = this.dashboardItem;
    let display_list: boolean = false;
    if(this.dashboardItem.visualizationType == 'EVENT_REPORT'){
      if (dashboardObject.dataType == 'EVENTS') {
        display_list = true;
      }
    }
    let tableConfiguration = {rows: [], columns: [],hide_zeros: true,display_list:display_list};
    //get columns
    if(dashboardObject.hasOwnProperty('columns')) {
      dashboardObject.columns.forEach(colValue => {
        tableConfiguration.columns.push(colValue.dimension);
      });
    } else {
      tableConfiguration.columns = ['co'];
    }
    //get rows
    if(dashboardObject.hasOwnProperty('rows')) {
      dashboardObject.rows.forEach(rowValue => {
        tableConfiguration.rows.push(rowValue.dimension)
      })
    } else {
      tableConfiguration.rows = ['ou', 'dx', 'pe'];
    }
    this.tableObject = this.visualizationService.drawTable(this.analyticData, tableConfiguration);
    this.isVisualizationDataLoaded = true;
  }

  changeVisualization(visualizationType?){
    if(visualizationType == "table"){
      this.drawTable();
    }else if(visualizationType == "chart"){
      this.drawChart();
    }else if(visualizationType == "dictionary"){
      this.metadataIdentifiers = this.DashboardServiceProvider.getDashboardItemMetadataIdentifiers(this.dashboardItem)
    }
    this.visualizationType= visualizationType;
  }


}
