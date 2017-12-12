import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {ReportParameterSelectionPage} from "../report-parameter-selection/report-parameter-selection";
import {ReportViewPage} from "../report-view/report-view";
import {StandardReportProvider} from "../../providers/standard-report/standard-report";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";

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

  public isLoading : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public reportList : any;
  public reportListCopy : any;
  icons: any= {};
  loadingMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, public appProvider: AppProvider,
              public standardReportProvider: StandardReportProvider,
              private sqLite: SqlLiteProvider) {
  }

  ngOnInit(){
    this.icons.reports = "assets/reports/reports.png";
    this.loadingMessages = [];
    this.isLoading = true;
    this.reportList = [];
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.loadReportsList(user);
    });
  }

  loadReportsList(user) {
    this.setLoadingMessages('Loading reports');
    this.standardReportProvider.getReportList(user).then((reportList: any) => {
      this.reportList = reportList;
      this.reportListCopy = reportList;
      this.isLoading = false;
    }, error => {
      this.appProvider.setNormalNotification('Fail to load reports');
      this.isLoading = false;
    });
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  selectReport(report){
    let parameter = {
      id : report.id,name : report.name, reportParams:report.reportParams, relativePeriods:report.relativePeriods
    };
    if(this.standardReportProvider.hasReportRequireParameterSelection(report.reportParams)){
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

  doRefresh(refresher) {
    refresher.complete();
    this.loadingMessage = "Downloading reports from the server";
    this.isLoading = true;
    let resource = 'reports';
    this.standardReportProvider.downloadReportsFromServer(this.currentUser).then((response:any)=> {
      this.loadingMessage = "Prepare local storage for updates";
      this.sqLite.dropTable(resource, this.currentUser.currentDatabase).then(()=>{
        this.sqLite.createTable(resource,this.currentUser.currentDatabase).then(()=>{
          this.loadingMessage = "Saving reports from server";
          this.standardReportProvider.saveReportsFromServer( response[resource], this.currentUser).then(() => {
            this.loadReportsList(this.currentUser);
          }, error=>{
            this.isLoading = true;
            this.appProvider.setNormalNotification("Fail to save reports")
          });
        },error=>{
          this.isLoading = true;
          this.appProvider.setNormalNotification("Fail to prepare local storage for updates")
        })
      }, error => {
        this.isLoading = true;
        this.appProvider.setNormalNotification("Fail to prepare local storage for updates")
      });
    }, error => {
      this.isLoading = true;
      this.appProvider.setNormalNotification("Fail to download reports")
    });
  }

}


