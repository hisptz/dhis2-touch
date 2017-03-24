import { Component,OnInit } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {Report} from "../../providers/report";
import {ReportParameterSelection} from "../report-parameter-selection/report-parameter-selection";
import {ReportView} from "../report-view/report-view";

/*
  Generated class for the ReportHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-home',
  templateUrl: 'report-home.html'
})
export class ReportHomePage implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public reportList : any;
  public reportListCopy : any;

  constructor(public navCtrl: NavController,public toastCtrl:ToastController,
              public user:User,public Report : Report) {}

  ngOnInit() {
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
    if(this.Report.hasReportRequireParameterSelection(report.reportParams)){
      this.navCtrl.push(ReportParameterSelection,parameter);
    }else{
      this.navCtrl.push(ReportView,parameter);
    }
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
