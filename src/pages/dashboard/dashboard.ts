import { Component, OnInit} from '@angular/core';
import { IonicPage, ModalController, MenuController } from 'ionic-angular';
import {DashboardServiceProvider} from "../../providers/dashboard-service/dashboard-service";
import {NetworkAvailabilityProvider} from "../../providers/network-availability/network-availability";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit{

  currentUser:any;
  loadingMessage:string;
  isLoading:boolean;
  isDashboardItemsLoading:boolean;

  currentDashboardName:string;
  currentDashboardId:string;
  dashboards:any = [];
  dashBoardToDashboardItem:any = {};
  dashBoardItemObjectsAndData:any = {};
  dashBoardVisualizationData:any = {};
  openedDashboardIds:any = {};

  emptyListMessage : any;

  constructor(public modalCtrl:ModalController,
              private appProvider:AppProvider, private userProvider:UserProvider,
              private DashboardService:DashboardServiceProvider,
              private NetworkAvailability:NetworkAvailabilityProvider,
              private menu:MenuController) {
  }

  ngOnInit() {
    this.menu.enable(true);
    this.isLoading = true;
    this.loadingMessage = "Loading current user information";
    this.userProvider.getCurrentUser().then(currentUser=> {
      this.currentUser = currentUser;
      this.loadingListOfAllDashboards(currentUser);
    }, error=> {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to loading current user information");
    });
  }


  loadingListOfAllDashboards(currentUser) {
    this.isLoading = true;
    let network = this.NetworkAvailability.getNetWorkStatus();
    this.currentDashboardName = '';
    this.currentDashboardId = '';
    if (network.isAvailable) {
      this.loadingMessage = "Loading dashboards from server";
      this.dashboards = [];
      this.DashboardService.allDashboards(currentUser).then((dashboards:any)=> {
        this.dashboards = dashboards;
        if (dashboards.length > 0) {
          this.currentDashboardName = dashboards[0].name;
          for (let dashboard of  dashboards) {
            this.dashBoardToDashboardItem[dashboard.id] = dashboard.dashboardItems;
          }
          this.getDashboardItemObjectsAndData(dashboards[0].dashboardItems, dashboards[0].id);
        } else {
          this.currentDashboardName = "No dashboard found";
          this.emptyListMessage = "No dashboard found from server";
        }
        this.isLoading = false;
      }, error=> {
        this.isLoading = false;
        this.currentDashboardName = "No dashboard found";
        let message = "Fail to load dashboards from the server";
        this.emptyListMessage = message;
        this.appProvider.setNormalNotification(message);
        console.error(JSON.stringify(error));
      });
    } else {
      //there is no network available
      this.isLoading = false;
      this.appProvider.setNormalNotification(network.message);
    }
  }

  getDashboardItemObjectsAndData(dashboardItems, selectedDashboardId) {
    this.isDashboardItemsLoading = true;
    if (dashboardItems.length > 0) {
      this.loadingMessage = "Loading dashboard items";
      if (this.dashBoardItemObjectsAndData[selectedDashboardId]) {
        this.initiateSelectedDashboardItem(selectedDashboardId);
      } else {
        this.DashboardService.getDashboardItemObjects(dashboardItems, selectedDashboardId, this.currentUser).then((dashBoardItemObjects:any)=> {
          this.dashBoardItemObjectsAndData[selectedDashboardId] = dashBoardItemObjects;
          this.initiateSelectedDashboardItem(selectedDashboardId);
        }, (error:any)=> {
          this.isDashboardItemsLoading = false;
          this.initiateSelectedDashboardItem(selectedDashboardId);
          let message = "Fail to load dashboard items for ";
          if (error.errorMessage) {
            message = error.errorMessage + " ";
          }
          message = message + "in " + this.currentDashboardName;
          this.emptyListMessage = message;
          this.appProvider.setNormalNotification(message);
          console.error(JSON.stringify(error));
        });
      }
    } else {
      this.initiateSelectedDashboardItem(selectedDashboardId);
      this.isDashboardItemsLoading = true;
      let message = "There are no supported dashboard item found for " + this.currentDashboardName;
      this.emptyListMessage = message;
      this.appProvider.setNormalNotification(message);
    }
  }

  initiateSelectedDashboardItem(selectedDashboardId) {
    this.currentDashboardId = selectedDashboardId;
    this.isDashboardItemsLoading = false;
    if(this.dashBoardItemObjectsAndData[selectedDashboardId]){
      let selectedDashboardItems = this.dashBoardItemObjectsAndData[selectedDashboardId];
      if(selectedDashboardItems.length > 0){
        this.openedDashboardIds[selectedDashboardItems[0].id]= true;
      }
    }
  }

  updateDashboardVisualizationData(data,dashboardItemId){
    this.dashBoardVisualizationData[dashboardItemId] = data;
  }

  toggleDashboardItemCard(dashboardItemId) {
    if (!this.openedDashboardIds[dashboardItemId]) {
      this.openedDashboardIds[dashboardItemId] = true;
    }else{
      this.openedDashboardIds[dashboardItemId] = false;
    }
  }

  openDashboardListFilter() {
    if (this.dashboards.length > 0) {
      this.isLoading = true;
      this.loadingMessage = "Please wait ...";
      let modal = this.modalCtrl.create('DashboardFilterPage', {
        currentDashboardName: this.currentDashboardName,
        currentUser: this.currentUser
      });
      modal.onDidDismiss((dashboard:any)=> {
        this.isLoading = false;
        this.loadingMessage = "";
        if (dashboard && dashboard.name) {
          if (dashboard.name != this.currentDashboardName) {
            this.currentDashboardName = dashboard.name;
            let selectedDashboards = this.dashBoardToDashboardItem[dashboard.id];
            this.getDashboardItemObjectsAndData(selectedDashboards, dashboard.id);
          }
        }
      });
      modal.present();
    }
  }

  //@todo handle on close reopen card
  loadVisualization(event){
    if(event){
      let  data = {
        dashboardItem : event.dashboardItem,
        dashboardItemData : event.dashboardItemData,
        analyticData : event.analyticData
      };
      let openedDashboardIds = [];
      Object.keys(this.openedDashboardIds).forEach(key=>{
        if(this.openedDashboardIds[key]){
          openedDashboardIds.push(key);
        }
      });
      this.DashboardService.setOpenedDashboardIds(openedDashboardIds);
      this.DashboardService.setCurrentFullScreenVisualizationData(data);
      this.isLoading = true;
      this.loadingMessage = "Please wait, while preparing awesome data visualization";
      let modal = this.modalCtrl.create('InteractiveDashboardPage', {});
      modal.onDidDismiss((dashboard:any)=> {
        this.isLoading = false;
        this.loadingMessage = "";
      });
      modal.present();
    }
  }

  reLoadDashBoard(refresher){
    this.DashboardService.resetDashboards();
    this.loadingListOfAllDashboards(this.currentUser);
    refresher.complete();
  }

}
