import { Component,OnInit } from '@angular/core';
import { ToastController,ModalController} from 'ionic-angular';
import {User} from "../../providers/user";
import {DashboardService} from "../../providers/dashboard-service";
import {NetworkAvailability} from "../../providers/network-availability";
import {DashboardSearchPage} from "../dashboard-search/dashboard-search";

/*
 Generated class for the DashBoardHome page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-dash-board-home',
  templateUrl: 'dash-board-home.html'
})
export class DashBoardHomePage implements OnInit{

  public isLoading : boolean = false;
  public loadingMessage : string = "";
  public currentUser : any;
  public dashboards :any = [];
  public dashboardsCopy :any = [];

  public selectedDashboardId : string;
  public selectedDashboardName : string;
  public selectedDashboardItemId : string;
  public dashBoardToDashboardItem : any = {};
  public dashBoardProgressTracker : any = {
    isDashboardsLoaded : false,
    isDashboardItemObjectsAndDataLoaded : false,
    isisVisualizationDataLoaded : false,
    isVisualizationSet : false,
    dashBoardItemObjectsAndData : {},
    dashBoardVisualizationData : {},
    currentStep : ""
  };

  constructor(public modalCtrl: ModalController, public toastCtrl:ToastController,
              public NetworkAvailability : NetworkAvailability,
              public user : User,public DashboardService : DashboardService

  ) {}

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.getAllDashboards(this.currentUser);
    });
  }

  ionViewDidEnter(){

  }

  reloadDashboards(){
    this.getAllDashboards(this.currentUser);
  }

  openDashboardList(){
    if(this.dashboards.length > 0){
      let modal = this.modalCtrl.create(DashboardSearchPage,{selectedDashboardName:this.selectedDashboardName,currentUser : this.currentUser});
      modal.onDidDismiss((dashboard:any)=>{
        if(dashboard && dashboard.name){
          if(dashboard.name != this.selectedDashboardName){
            this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = false;
            this.selectedDashboardId = dashboard.id;
            this.selectedDashboardName = dashboard.name;
            let selectedDashboards = this.dashBoardToDashboardItem[this.selectedDashboardId];
            this.getDashboardItemObjectsAndData(selectedDashboards);
          }
        }
      });
      modal.present();
    }else{
      this.setNotificationToasterMessage("No dashboard found at moment");
    }
  }

  getAllDashboards(currentUser){
    this.dashBoardProgressTracker.isDashboardsLoaded = false;
    this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = false;
    let network = this.NetworkAvailability.getNetWorkStatus();
    if(network.isAvailable){
      this.isLoading = true;
      this.loadingMessage = "Loading dashboards";
      this.DashboardService.allDashboards(currentUser).then((dashboards : any)=>{
        this.dashboards = dashboards;
        this.dashboardsCopy = dashboards;
        if(dashboards.length > 0){
          this.dashBoardProgressTracker.isDashboardsLoaded = true;
          this.selectedDashboardId = dashboards[0].id;
          this.selectedDashboardName = dashboards[0].name;
          for(let dashboard of  this.dashboards){
            this.dashBoardToDashboardItem[dashboard.id] = dashboard.dashboardItems;
          }
          this.getDashboardItemObjectsAndData(this.dashboards[0].dashboardItems);
        }
      },error=>{
        this.dashboards = [];
        this.dashboardsCopy = [];
        this.selectedDashboardName = "There is no dashboard found";
        this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = true;
        this.dashBoardProgressTracker.isDashboardsLoaded = true;
        this.setToasterMessage("Fail to load dashboards from the server");
      });
    }else{
      this.setNotificationToasterMessage(network.message);
      this.selectedDashboardName = "There is no dashboard found";
      this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = true;
      this.dashBoardProgressTracker.isDashboardsLoaded = true;
    }
  }

  hideAndShowVisualizationCard(dashBoardItemId){
    if(this.selectedDashboardItemId == dashBoardItemId){
      this.selectedDashboardItemId = "";
    }else{
      this.selectedDashboardItemId = dashBoardItemId
    }
  }

  getDashboardItemObjectsAndData(dashboardItems){
    if(dashboardItems.length > 0){
      this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = false;
      if(this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashboardId]){
        this.initiateSelectedDashboardItem();
      }else{
        this.DashboardService.getDashboardItemObjects(dashboardItems,this.currentUser).then((dashBoardItemObjects:any)=>{
          this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashboardId] = dashBoardItemObjects;
          this.initiateSelectedDashboardItem();
        },error=>{
          this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = true;
          if(error.errorMessage){
            this.setToasterMessage(error.errorMessage);
          }else{
            this.setToasterMessage("Fail to load dashboard items metadata from server " );
          }
        });
      }
    }else{
      this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = true;
      this.setToasterMessage("There are no supported dashboard item found");
    }
  }

  initiateSelectedDashboardItem(){
    let selectedDashboardItems = this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashboardId];
    if(selectedDashboardItems.length > 0){
      this.selectedDashboardItemId = selectedDashboardItems[0].id;
    }
    this.dashBoardProgressTracker.isDashboardItemObjectsAndDataLoaded = true;
  }

  updateDashboardVisualizationData(analyticData,dashboardItemId){
    this.dashBoardProgressTracker.dashBoardVisualizationData[dashboardItemId] = analyticData;
  }

  setNotificationToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      position : 'top',
      duration: 1500
    });
    toast.present();
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



}
