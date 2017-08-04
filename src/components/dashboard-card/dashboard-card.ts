import { Component,Input,Output,EventEmitter,OnInit } from '@angular/core';
import {DashboardServiceProvider} from "../../providers/dashboard-service/dashboard-service";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {VisualizerService} from "../../providers/visualizer-service";

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
  @Input() dashboardItemData;
  @Output() dashboardItemAnalyticData = new EventEmitter();

  currentUser : any;
  analyticData : any;
  chartObject : any;
  tableObject : any;
  isVisualizationDataLoaded : boolean = false;
  visualizationType : string;

  constructor(private DashboardService : DashboardServiceProvider,private userProvider : UserProvider,
              private appProvider : AppProvider,
              private visualizationService : VisualizerService) {
  }


  ngOnInit() {
    this.visualizationType = '';
    this.userProvider.getCurrentUser().then((currentUser :any)=>{
      if(currentUser && currentUser.username){
        this.currentUser = currentUser;
        if(this.dashboardItemData){
          this.analyticData = this.dashboardItemData;
          this.initiateVisualization();
        }else{
          if(this.dashboardItem && this.dashboardItem.analyticsUrl){
            this.DashboardService.getAnalyticDataForDashboardItem(this.dashboardItem.analyticsUrl,currentUser).then((analyticData:any)=>{
              this.analyticData = analyticData;
              this.dashboardItemAnalyticData.emit(analyticData);
              this.initiateVisualization();
            },error=>{
              this.isVisualizationDataLoaded = true;
              this.appProvider.setNormalNotification("fail to load data for " + (this.dashboardItem.title) ? this.dashboardItem.title : this.dashboardItem.name);
            });
          }else{
            this.isVisualizationDataLoaded = true;
            this.appProvider.setNormalNotification("There is no dashboard item information");
          }
        }
      }else{
        this.isVisualizationDataLoaded = true;
        this.appProvider.setNormalNotification("Fail to get user information");
      }
    })
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

  drawChart(chartType?:string) {
    this.isVisualizationDataLoaded = false;
    let itemChartType = (this.dashboardItem.type) ? this.dashboardItem.type.toLowerCase() : 'bar';
    let layout: any = {};
    layout['series'] = this.dashboardItem.series ? this.dashboardItem.series : (this.dashboardItem.columns.length > 0) ?this.dashboardItem.columns[0].dimension :  'pe';
    layout['category'] = this.dashboardItem.category ? this.dashboardItem.category :(this.dashboardItem.rows.length > 0)? this.dashboardItem.rows[0].dimension : 'dx';
    this.chartObject = {};
    let chartConfiguration = {
      'type': chartType ? chartType : itemChartType,
      'title': "",
      'show_labels': true,
      'xAxisType': layout.category,
      'yAxisType': layout.series
    };
    this.chartObject = this.visualizationService.drawChart(this.analyticData, chartConfiguration);
    this.chartObject.chart["zoomType"] ="xy";
    this.chartObject.chart["backgroundColor"] = "#F4F4F4";
    this.chartObject["credits"] =  {enabled: false};
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
}
