import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
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
    this.icons.standardReport = "assets/icon/reports.png";
    this.icons.dataSetReport = "assets/icon/form.png";
    this.loadingMessages = [];
    this.isLoading = true;
    this.reportList = [];
    this.user.getCurrentUser().subscribe((user:any)=>{
      this.currentUser = user;
      this.loadReportsList(user);
    });
  }

  loadReportsList(user) {
    this.loadingMessage = 'loading_reports';
    this.standardReportProvider.getReportList(user).subscribe((reportList: any) => {
      this.reportList = reportList;
      this.reportListCopy = reportList;
      this.isLoading = false;
    }, error => {
      this.appProvider.setNormalNotification('Fail to load reports');
      this.isLoading = false;
    });
  }


  selectReport(report){
    let parameter = {
      id : report.id,
      reportType : report.type,
      name : report.name,
      openFuturePeriods : report.openFuturePeriods,
      reportParams:report.reportParams,
      relativePeriods:report.relativePeriods
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
    this.loadingMessage = "downloading_reports_from_server";
    this.isLoading = true;
    let resource = 'reports';
    this.standardReportProvider.downloadReportsFromServer(this.currentUser).subscribe((response:any)=> {
      this.loadingMessage = "prepare_local_storage_for_updates";
      this.sqLite.dropTable(resource, this.currentUser.currentDatabase).subscribe(()=>{
        this.sqLite.createTable(resource,this.currentUser.currentDatabase).subscribe(()=>{
          this.loadingMessage = "saving_reports_from_server";
          this.standardReportProvider.saveReportsFromServer( response[resource], this.currentUser).subscribe(() => {
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


