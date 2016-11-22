import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {Report} from "../../providers/report";
import {ReportView} from "../report-view/report-view";
import {ReportParameterSelection} from "../report-parameter-selection/report-parameter-selection";

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
  public reportListCopy : any;

  constructor(public navCtrl: NavController,private toastCtrl:ToastController,
              private user:User, private httpClient:HttpClient,
              private sqlLite:SqlLite,private Report : Report) {

    this.loadingMessages = [];
    this.loadingData = true;
    this.reportList = [];
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.loadReportsList(user);
    });
  }

  loadReportsList(user){
    this.setLoadingMessages('Loading reports');
    this.Report.getReportList(user).then((reportList : any)=>{
      this.reportList = reportList;
      this.reportListCopy = reportList;
      this.loadingData = false;
    },error=>{
      this.setToasterMessage('Fail to load reports');
      this.loadingData = false;
    });
  }

  selectReport(report){
    let parameter = {
      id : report.id,name : report.name, reportParams:report.reportParams
    };
    this.navCtrl.push(ReportView,parameter);
    //if(this.Report.hasReportRequireParameterSelection(report.reportParams)){
    //
    //  this.navCtrl.push(ReportParameterSelection,parameter);
    //}else{
    //  this.navCtrl.push(ReportView,parameter)
    //}
  }


  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.reportList = this.reportListCopy;
    if(val && val.trim() != ''){
      this.reportList = this.reportList.filter((report:any) => {
        return (report.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
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
