import { Component } from '@angular/core';
import { ToastController,NavParams } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {Dashboard} from "../../providers/dashboard";
import {User} from "../../providers/user/user";

/*
  Generated class for the DashboardItems page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard-items',
  templateUrl: 'dashboard-items.html',
  providers : [User,Dashboard,HttpClient]
})
export class DashboardItems {

  public dashBordName : string = "DashBoard Name";
  public options : any;
  public chartType : string;

  public currentUser : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public dashBoardData :any;

  constructor(public user : User,public params : NavParams,
              public toastCtrl:ToastController,public dashboard : Dashboard,
              public httpClient : HttpClient) {

    this.dashBordName = "DashBoard Name";
    this.chartType = "";
    this.drawChart();
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.dashBordName = this.params.get("dashBordName");
      this.dashBoardData = this.params.get("dashBoard");
      this.getDashBoardItemObjects(this.dashBoardData);
    });
  }

  ionViewDidLoad() {}

  getDashBoardItemObjects(dashBoardData){
    this.dashboard.getDashBoardObject(dashBoardData.dashboardItems[0],this.currentUser).then((dashboardObject:any)=>{
      alert(dashboardObject.url);
      alert(JSON.stringify(dashboardObject));
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load dashBoard object from server");
    });
  }

  changeType(type){
    this.options = {};
    this.options = this.dashboard.getDefaultDashBoard(type);
  }

  changeChart(){
    this.changeType(this.chartType);
  }

  drawChart(){
    this.options = {};
    this.options = this.dashboard.getDefaultDashBoard("");
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
