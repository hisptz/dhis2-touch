import { Component,OnInit } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {Dashboard} from "../../providers/dashboard";
import {NetworkAvailability} from "../../providers/network-availability";

/*
  Generated class for the DashBoardHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dash-board-home',
  templateUrl: 'dash-board-home.html',
  providers : [User,HttpClient,Dashboard,NetworkAvailability]
})
export class DashBoardHome implements OnInit{

  public currentUser : any;
  public loadingData : boolean = false;
  public dashBoards :any = [];
  public selectedDashBoardId : string;
  public selectedDashBoardItemId : string;
  public dashBoardToDashBoardItem : any = {};
  public dashBoardProgressTracker : any = {
    isDashBoardsLoaded : false,
    isDashBoardItemObjectsAndDataLoaded : false,
    isisVisualizationDataLoaded : false,
    isVisualizationSet : false,
    dashBoardItemObjectsAndData : {},
    dashBoardVisualizationData : {},
    currentStep : ""
  };
  public network : any;

  constructor(public navCtrl: NavController,public user : User,
              public NetworkAvailability : NetworkAvailability,
              public toastCtrl:ToastController,public dashboard : Dashboard,
              public httpClient : HttpClient) {
  }

  ngOnInit() {
    this.network = this.NetworkAvailability.getNetWorkStatus();
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      if(this.network.isAvailable){
        this.getAllDataBase();
      }else{
        this.setToasterMessage(this.network.message);
      }
    });
  }

  getAllDataBase(){
    this.loadingData = true;
    this.dashBoardProgressTracker.currentStep = 'dashBoards';
    this.dashboard.getAllDashBoardsFromServer(this.currentUser).then((dashBoardResponse:any)=>{
      this.loadingData = false;
      this.dashBoards = dashBoardResponse.dashboards;
      if(dashBoardResponse.dashboards.length > 0){
        this.dashBoardProgressTracker.isDashBoardsLoaded = true;
        this.selectedDashBoardId = this.dashBoards[0].id;
        for(let dashBoard of  this.dashBoards){
          this.dashBoardToDashBoardItem[dashBoard.id] = dashBoard.dashboardItems;
        }
        this.selectedDashBoardItemId = this.dashBoards[0].dashboardItems[0].id;
        this.getDashBoardItemObjectsAndData(this.dashBoards[0].dashboardItems);
      }
    },error=>{
      this.loadingData = false;
      this.dashBoards = [];
      this.setToasterMessage("Fail to load dashboards from the server");
    });
  }

  hideAndShowVisualizationCard(dashBoardItemId){
    if(this.selectedDashBoardItemId == dashBoardItemId){
      this.selectedDashBoardItemId = "";
    }else{
      this.selectedDashBoardItemId = dashBoardItemId
    }
  }

  changeDashBoard(){
    this.loadingData = true;
    let selectedDashBoards = this.dashBoardToDashBoardItem[this.selectedDashBoardId];
    this.getDashBoardItemObjectsAndData(selectedDashBoards);
  }

  initiateSelectedDashBoardItem(){
    let selectedDashBoardItems = this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId];
    this.selectedDashBoardItemId = selectedDashBoardItems[0].id;
  }

  getDashBoardItemObjectsAndData(dashboardItems){
    this.loadingData = true;
    this.dashBoardProgressTracker.currentStep = "visualizationMetadata";
    if(this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId]){
      this.initiateSelectedDashBoardItem();
      this.loadingData = false;
    }else{
      this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = false;
      this.dashboard.getDashBoardItemObjects(dashboardItems,this.currentUser).then((dashBoardItemObjects:any)=>{
        this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId] = dashBoardItemObjects;
        this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = true;
        this.initiateSelectedDashBoardItem();
        this.loadingData = false;
      },error=>{
        this.loadingData = false;
        this.setToasterMessage("Fail to load dashboard items metadata from server " + JSON.stringify(error));
      });
    }

  }

  getAnalyticDataForDashBoardItems(dashBoardItemObjects){
    this.loadingData = true;
    this.dashBoardProgressTracker.currentStep = 'visualizationData';
    this.dashboard.getAnalyticDataForDashBoardItems(dashBoardItemObjects,this.currentUser).then((analyticData : any)=>{
      this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId] = analyticData;
      this.dashBoardProgressTracker.isisVisualizationDataLoaded = true;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load dashBoardItem data from server " + JSON.stringify(error));
    });
  }

  ionViewDidLoad() {
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
