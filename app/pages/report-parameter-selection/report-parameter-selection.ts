import { Component } from '@angular/core';
import { NavController,ToastController,NavParams} from 'ionic-angular';
import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the ReportParameterSelectionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/report-parameter-selection/report-parameter-selection.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
})
export class ReportParameterSelectionPage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private reportName : string;
  private reportId :string;
  private selectedReport : any;
  private currentUser : any;

  constructor(private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private user : User,private appProvider : AppProvider,private sqlLite : SqlLite,private httpClient: HttpClient) {
    this.reportName = this.params.get('reportName');
    this.reportId = this.params.get('reportName');
    this.user.getCurrentUser().then((currentUser:any)=>{
      this.currentUser = currentUser;
      this.loadingSelectedReport();
    });
  }

  loadingSelectedReport(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading selected report');
    let resource = 'reports';
    let attribute = 'id';
    let attributeValue =[];
    attributeValue.push(this.reportId);
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((selectedReportList:any)=>{
      this.selectedReport = selectedReportList[0];
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load selected report');
    });
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
