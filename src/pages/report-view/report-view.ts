import { Component } from '@angular/core';
import { NavParams,ToastController } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {Report} from "../../providers/report";
import {HttpClient} from "../../providers/http-client/http-client";

/*
  Generated class for the ReportView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-view',
  templateUrl: 'report-view.html',
  providers : [User,HttpClient,SqlLite,Report],
})
export class ReportView {

  public reportId : string;
  public reportName : string;
  public reportDesignContent : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;

  constructor(private params:NavParams,private user: User,
              private Report:Report,private toastCtrl:ToastController) {


    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.reportId = this.params.get("id");
      this.reportName = this.params.get("name");
      this.loadReportDesignContent(this.reportId);
    });
  }

  loadReportDesignContent(reportId){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading report details');
    this.Report.getReportId(reportId,this.currentUser).then((report : any)=>{
      this.reportDesignContent = report.designContent.replace("\n","");
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load  report details");
    });
  }

  ionViewDidLoad() {
    //console.log('Hello ReportView Page');
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
