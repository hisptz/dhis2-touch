import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {Dashboard} from "../../providers/dashboard";
import {DashboardItems} from "../dashboard-items/dashboard-items";

/*
  Generated class for the DashBoardHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dash-board-home',
  templateUrl: 'dash-board-home.html',
  providers : [User,HttpClient,Dashboard]
})
export class DashBoardHome {

  public currentUser : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public dashBoards :any;
  public dashBoardsCopy :any;

  public options : any = {};

  constructor(public navCtrl: NavController,public user : User,
              public toastCtrl:ToastController,public dashboard : Dashboard,
              public httpClient : HttpClient) {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      //this.getAllDataBase();
    });
  }

  getAllDataBase(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading available dashboards from server");
    this.dashboard.getAllDashBoardsFromServer(this.currentUser).then((dashBoardResponse:any)=>{
      this.loadingData = false;
      this.dashBoards = dashBoardResponse.dashboards;
      this.dashBoardsCopy = dashBoardResponse.dashboards;
    },error=>{
      this.loadingData = false;
      this.dashBoards = [];
      this.setToasterMessage("Fail to load dashboards from the server");
    });
  }

  goToDashBoard(dashBoard){
    let params = {
      dashBordName : dashBoard.name,
      selectedDashBoard : dashBoard
    };
    this.navCtrl.push(DashboardItems,params);
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

  ionViewDidLoad() {
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
