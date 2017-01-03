import { Component } from '@angular/core';
import { ToastController,NavParams } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {Dashboard} from "../../providers/dashboard";
import {User} from "../../providers/user/user";
import {ChartVisualizer} from "../../providers/chart-visualizer";

/*
  Generated class for the DashboardItems page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard-items',
  templateUrl: 'dashboard-items.html',
  providers : [User,Dashboard,HttpClient,ChartVisualizer]
})
export class DashboardItems {

  public dashBordName : string = "DashBoard Name";
  public options : any;
  public chartType : any;

  public currentUser : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public selectedDashBoard :any;
  public selectedDashBoardData : any;//{dashBoardItemId : analyticData}
  public dashBoardItemObjects : any;
  public chartsObjects : any;


  constructor(public user : User,public params : NavParams,
              private ChartVisualizer : ChartVisualizer,
              public toastCtrl:ToastController,public dashboard : Dashboard,
              public httpClient : HttpClient) {

    this.dashBordName = "DashBoard Name";
    this.chartType = {};
    this.chartsObjects = {};
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.dashBordName = this.params.get("dashBordName");
      this.selectedDashBoard = this.params.get("selectedDashBoard");
      this.selectedDashBoardData = {};
      this.getDashBoardItemObjectsAndData(this.selectedDashBoard);
    });
  }

  ionViewDidLoad() {}

  getDashBoardItemObjectsAndData(selectedDashBoard){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading dashboard items metadata");
    this.dashboard.getDashBoardItemObjects(selectedDashBoard.dashboardItems,this.currentUser).then((dashBoardItemObjects:any)=>{
      this.dashBoardItemObjects = dashBoardItemObjects;
      this.setLoadingMessages("Loading dashboard items data");
      this.dashboard.getAnalyticDataForDashBoardItems(dashBoardItemObjects,this.currentUser).then((analyticData : any)=>{
        this.selectedDashBoardData = analyticData;
        this.setChartsObjects(this.selectedDashBoardData,this.dashBoardItemObjects);
      },error=>{
        this.loadingData = false;
        this.setToasterMessage("Fail to load dashBoardItem data from server " + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load dashboard items metadata from server " + JSON.stringify(error));
    });
  }

  setChartsObjects(analyticData,dashBoardItemObjects){
    this.chartsObjects = {};
    this.setLoadingMessages("Prepare charts for visualization");
    this.ChartVisualizer.getChartObjects(analyticData,dashBoardItemObjects).then(chartObjects=>{
      this.chartsObjects = chartObjects;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to set charts on the view " + JSON.stringify(error));
    });
  }

  changeChart(dashBoardItemId){
    let dashBoardItemObject;
    let chartType = this.chartType[dashBoardItemId];
    for (let dashBoardItem of this.dashBoardItemObjects){
      if(dashBoardItem.id == dashBoardItemId){
        dashBoardItemObject = dashBoardItem;
      }
    }
    let chartObject =  this.ChartVisualizer.getChartObject(this.selectedDashBoardData[dashBoardItemObject.id],dashBoardItemObject.category,[],dashBoardItemObject.series,[],dashBoardItemObject.name,chartType);
    this.chartsObjects[dashBoardItemId].options = {};
    this.chartsObjects[dashBoardItemId] = chartObject;
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
