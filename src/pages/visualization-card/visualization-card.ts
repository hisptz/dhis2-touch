import { Component ,Input,Output, EventEmitter,OnInit} from '@angular/core';
import { ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {VisualizerService} from "../../providers/visualizer-service";
import {DashboardService} from "../../providers/dashboard-service";
/*
  Generated class for the VisualizationCard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-visualization-card',
  templateUrl: 'visualization-card.html'
})
export class VisualizationCardPage implements OnInit{

  @Input() dashboardItem;
  @Input() dashboardItemData;
  @Output() dashboardItemAnalyticData = new EventEmitter();


  public currentUser : any;
  public analyticData : any;
  public chartObject : any;
  public tableObject : any;
  public isVisualizationDataLoaded : boolean = false;
  public visualizationOptions : any = {
    top : [],
    bottom :  [
      {type: "table", path: "assets/dashboard/table.png"},
      {type: "charts", path: "assets/dashboard/combined.png"},
      {type: "dictionary", path: "assets/dashboard/dictionary.png"}
    ],
    right : [
      {type: "line", path: "assets/dashboard/line.png",isDisabled : false},
      {type: "bar", path: "assets/dashboard/column.png",isDisabled : false},
      {type: "column", path: "assets/dashboard/bar.png",isDisabled : false},
      {type: "stacked_column", path: "assets/dashboard/column-stacked.png",isDisabled : false},
      {type: "stacked_bar", path: "assets/dashboard/bar-stacked.png",isDisabled : false},
      {type: "combined", path: "assets/dashboard/combined.png",isDisabled : false},
      {type: "area", path: "assets/dashboard/area.png",isDisabled : false},
      {type: "pie", path: "assets/dashboard/pie.png",isDisabled : false},
    ],
    left : []
  };
  public visualizationSelection : any = {
    top : {},bottom : "charts",right : "",left : ""
  };


  public metadataIdentifiers: string;

  //visualizationType

  constructor(public DashboardService : DashboardService,public User : User,
              public toastCtrl:ToastController,
              public visualizationService : VisualizerService) {
  }

  ngOnInit() {
    this.User.getCurrentUser().then((user)=>{
      this.currentUser = user;
      if(this.dashboardItemData){
        this.analyticData = this.dashboardItemData;
        this.initiateVisualization();
      }else{
        this.DashboardService.getAnalyticDataForDashboardItem(this.dashboardItem.analyticsUrl,user).then((analyticData:any)=>{
          this.analyticData = analyticData;
          this.dashboardItemAnalyticData.emit(analyticData);
          this.initiateVisualization();
        },error=>{
          this.isVisualizationDataLoaded = true;
          this.setToasterMessage("fail to load data for " + (this.dashboardItem.title) ? this.dashboardItem.title : this.dashboardItem.name);
        });
      }
    })
  }

  initiateVisualization(){
    if((this.dashboardItem.visualizationType == 'CHART') || (this.dashboardItem.visualizationType == 'EVENT_CHART')) {
      this.drawChart();
    } else if ((this.dashboardItem.visualizationType == 'TABLE') || (this.dashboardItem.visualizationType == 'EVENT_REPORT') || (this.dashboardItem.visualizationType == 'REPORT_TABLE')) {
      this.visualizationSelection.bottom = "table";
      this.drawTable();
    }
  }

  ionViewDidLoad() {}

  drawChart(chartType?:string) {
    this.isVisualizationDataLoaded = false;
    let itemChartType = (this.dashboardItem.type) ? this.dashboardItem.type.toLowerCase() : 'bar';
    let layout: any = {};
    layout['series'] = this.dashboardItem.series ? this.dashboardItem.series : (this.dashboardItem.columns.length > 0) ?this.dashboardItem.columns[0].dimension :  'pe';
    layout['category'] = this.dashboardItem.category ? this.dashboardItem.category :(this.dashboardItem.rows.length > 0)? this.dashboardItem.rows[0].dimension : 'dx';


    let chartConfiguration = {
      'type': chartType ? chartType : itemChartType,
      'title': "",
      'show_labels': true,
      'xAxisType': layout.category,
      'yAxisType': layout.series
    };
    this.visualizationSelection.right = chartConfiguration.type;
    this.chartObject = this.visualizationService.drawChart(this.analyticData, chartConfiguration);
    this.chartObject.chart["zoomType"] ="xy";
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

  changeVisualization(visualizationType?){
    if(visualizationType == "table"){
      this.drawTable();
    }else if(visualizationType == "charts"){
      this.drawChart();
    }else if(visualizationType == "dictionary"){
      this.metadataIdentifiers = this.DashboardService.getDashboardItemMetadataIdentifiers(this.dashboardItem)
    }
    this.visualizationSelection.bottom = visualizationType;
  }


  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



}
