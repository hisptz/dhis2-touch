import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {ReportsProvider} from "../../providers/reports/reports";
import {ReportParameterSelectionPage} from "../report-parameter-selection/report-parameter-selection";
import {ReportViewPage} from "../report-view/report-view";

/**
 * Generated class for the ReportsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public reportList : any;
  public reportListCopy : any;
  icons: any= {};



  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, public appProvider: AppProvider,
              public reportProvider: ReportsProvider) {
  }

  ngOnInit(){
    this.icons.reports = "assets/reports/reports.png";
    this.loadingMessages = [];
    this.loadingData = true;
    this.reportList = [];
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.loadReportsList(user);
    });


  }

  loadReportsList(user) {
    this.setLoadingMessages('Loading reports');
    this.reportProvider.getReportList(user).then((reportList: any) => {
      this.reportList = reportList;
      this.reportListCopy = reportList;
      this.loadingData = false;
    }, error => {
      this.appProvider.setNormalNotification('Fail to load reports');
      this.loadingData = false;
    });

  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  selectReport(report){
    let parameter = {
      id : report.id,name : report.name, reportParams:report.reportParams
    };
    if(this.reportProvider.hasReportRequireParameterSelection(report.reportParams)){
      this.navCtrl.push('ReportParameterSelectionPage',parameter);
    }else{
      this.navCtrl.push('ReportViewPage',parameter);
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



}
