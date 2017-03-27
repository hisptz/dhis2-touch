import { Component,OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {Dashboard} from "../../providers/dashboard";
import {NetworkAvailability} from "../../providers/network-availability";
import {User} from "../../providers/user";

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

  public currentUser : any;
  public loadingData : boolean = false;

  public isDashboardListMenuOpen : boolean = false;
  public isDashboardListLoaded : boolean = false;
  public isDashboardItemsLoaded : boolean = false;

  public dashBoards :any = [];
  public dashBoardsCopy : any = [];

  public selectedDashBoardId : string;
  public selectedDashBoardName : string;
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

  constructor(public user : User,
              public NetworkAvailability : NetworkAvailability,
              public toastCtrl:ToastController,public dashboard : Dashboard) {}

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.getAllDataBase();
    });
  }
  getAllDataBase(){
    this.dashBoardProgressTracker.isDashBoardsLoaded = false;
    this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = false;
    this.network = this.NetworkAvailability.getNetWorkStatus();
    if(this.network.isAvailable){
      this.dashboard.getAllDashBoardsFromServer(this.currentUser).then((dashBoardResponse:any)=>{
        this.dashBoards = dashBoardResponse.dashboards;
        this.dashBoardsCopy = dashBoardResponse.dashboards;
        if(dashBoardResponse.dashboards.length > 0){
          this.dashBoardProgressTracker.isDashBoardsLoaded = true;
          this.selectedDashBoardId = this.dashBoards[0].id;
          this.selectedDashBoardName = this.dashBoards[0].name;
          for(let dashBoard of  this.dashBoards){
            this.dashBoardToDashBoardItem[dashBoard.id] = dashBoard.dashboardItems;
          }
          this.getDashBoardItemObjectsAndData(this.dashBoards[0].dashboardItems);
        }
      },error=>{
        this.dashBoards = [];
        this.dashBoardsCopy = [];
        this.selectedDashBoardName = "There is no dashboard found";
        this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = true;
        this.dashBoardProgressTracker.isDashBoardsLoaded = true;
        this.setToasterMessage("Fail to load dashboards from the server");
      });
    }else{
      this.setNotificationToasterMessage(this.network.message);
      this.selectedDashBoardName = "There is no dashboard found";
      this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = true;
      this.dashBoardProgressTracker.isDashBoardsLoaded = true;
    }
  }

  hideAndShowVisualizationCard(dashBoardItemId){
    if(this.selectedDashBoardItemId == dashBoardItemId){
      this.selectedDashBoardItemId = "";
    }else{
      this.selectedDashBoardItemId = dashBoardItemId
    }
  }

  toggleDashBoardList(){
    this.dashBoards = this.dashBoardsCopy;
    this.isDashboardListMenuOpen = !this.isDashboardListMenuOpen;
  }

  setCurrentDashboard(dashboard){
    if(dashboard.name != this.selectedDashBoardName){
      this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = false;
      this.selectedDashBoardId = dashboard.id;
      this.selectedDashBoardName = dashboard.name;
      this.toggleDashBoardList();
      let selectedDashBoards = this.dashBoardToDashBoardItem[this.selectedDashBoardId];
      this.getDashBoardItemObjectsAndData(selectedDashBoards);
    }else{
      this.toggleDashBoardList();
    }
  }

  getDashBoardItemObjectsAndData(dashboardItems){
    this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = false;
    if(this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId]){
      this.initiateSelectedDashBoardItem();
    }else{
      this.dashboard.getDashBoardItemObjects(dashboardItems,this.currentUser).then((dashBoardItemObjects:any)=>{
        this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId] = dashBoardItemObjects;
        this.initiateSelectedDashBoardItem();
      },error=>{
        this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = true;
        if(error.errorMessage){
          this.setToasterMessage(error.errorMessage);
        }else{
          this.setToasterMessage("Fail to load dashboard items metadata from server " );
        }
        console.log(JSON.stringify(error));
      });
    }
  }

  initiateSelectedDashBoardItem(){
    let selectedDashBoardItems = this.dashBoardProgressTracker.dashBoardItemObjectsAndData[this.selectedDashBoardId];
    this.selectedDashBoardItemId = selectedDashBoardItems[0].id;
    this.dashBoardProgressTracker.isDashBoardItemObjectsAndDataLoaded = true;
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.dashBoards = this.dashBoardsCopy;
    if(val && val.trim() != ''){
      this.dashBoards = this.dashBoards.filter((dashBoard:any) => {
        return (dashBoard.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  updateDashBoardVisualizationData(analyticData,dashboardItemId){
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
