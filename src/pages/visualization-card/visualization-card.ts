import { Component ,Input,OnInit} from '@angular/core';
import { ToastController } from 'ionic-angular';
import {Dashboard} from "../../providers/dashboard";
import {VisulizerService} from "../../providers/visulizer.service";
import {User} from "../../providers/user/user";
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


  public currentUser : any;
  public analyticData : any;
  public chartObject : any;
  public tableObject : any;
  public visualizationOptions : any = {
    top : [],
    bottom :  [
      {type: "table", path: "assets/dashboard/table.png"},
      {type: "charts", path: "assets/dashboard/combined.png"}
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

  constructor(public Dashboard : Dashboard,public User : User,
              public toastCtrl:ToastController,
              public visualizationService : VisulizerService) {
  }

  ngOnInit() {
    this.User.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.Dashboard.getAnalyticDataForDashBoardItem(this.dashboardItem.analyticsUrl,user).then((analyticData:any)=>{
        this.analyticData = analyticData;
        this.drawChart();
      },error=>{
        this.setToasterMessage("fail to load data for " + (this.dashboardItem.title) ? this.dashboardItem.title : this.dashboardItem.name);
      });
    })
  }

  ionViewDidLoad() {}

  drawChart(chartType?:string) {
    let itemChartType = (this.dashboardItem.type) ? this.dashboardItem.type.toLowerCase() : 'bar';
    let chartConfiguration = {
      'type': chartType ? chartType : itemChartType,
      'title': "",
      'xAxisType': this.dashboardItem.category ? this.dashboardItem.category : 'pe',
      'yAxisType': this.dashboardItem.series ? this.dashboardItem.series : 'dx'
    };
    this.visualizationSelection.right = chartConfiguration.type;
    this.chartObject = this.visualizationService.drawChart(this.analyticData, chartConfiguration);
    this.chartObject["credits"] =  {enabled: false}
  }

  drawTable() {
    let dashboardObject = this.dashboardItem;
    let tableConfiguration = {rows: [], columns: []};
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
  }

  changeVisualization(visualizationType){
    if(visualizationType == "table"){
      this.drawTable();
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
