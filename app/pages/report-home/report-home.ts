import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {ReportViewPage} from '../report-view/report-view';
import {ReportParameterSelectionPage} from '../report-parameter-selection/report-parameter-selection';
/*
  Generated class for the ReportHomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/report-home/report-home.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
})
export class ReportHomePage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private currentUser : any;
  private reportList :any;

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private user : User,private appProvider : AppProvider,private sqlLite : SqlLite,private httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.loadingAvailableReports();
    });
  }

  loadingAvailableReports(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading offline reports');
    let resource = 'reports';

    this.sqlLite.getAllDataFromTable(resource,this.currentUser.currentDatabase).then((reports : any)=>{
      this.reportList = reports;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load offline reports');
    });
  }

  prepareSelectedReport(report){
    let hasReportParams = this.doesReportHasReportParams(report.reportParams);
    let parameter = {
      reportName : report.name,
      reportId : report.id
    };
    if(hasReportParams){
      this.navCtrl.push(ReportParameterSelectionPage,parameter);
    }else{
      this.navCtrl.push(ReportViewPage,parameter);
    }
  }

  doesReportHasReportParams(reportParams){
    let hasReportParams = false;
    if(reportParams.paramReportingPeriod || reportParams.paramOrganisationUnit){
      hasReportParams = true;
    }
    return hasReportParams;
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
