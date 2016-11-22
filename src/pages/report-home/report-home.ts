import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {Report} from "../../providers/report";

/*
  Generated class for the ReportHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-home',
  templateUrl: 'report-home.html',
  providers : [User,HttpClient,SqlLite,Report],
})
export class ReportHome {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public reportList : any;

  constructor(public navCtrl: NavController,private toastCtrl:ToastController,
              private user:User, private httpClient:HttpClient,
              private sqlLite:SqlLite,private Report : Report) {

    this.loadingMessages = [];
    this.loadingData = true;
    this.reportList = [];
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.setLoadingMessages('Loading reports');
      this.Report.getReportList(user).then((reportList : any)=>{
        this.reportList = reportList;
        this.loadingData = false;
      },error=>{
        this.loadingData = false;
      });
    });
  }


  selectReport(report){
    alert(report.name);
  }

  ionViewDidLoad() {
    //console.log('Hello ReportHome Page');
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

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

}
