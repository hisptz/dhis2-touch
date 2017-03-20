import { Component,OnInit,ElementRef } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {Report} from "../../providers/report";
import {HttpClient} from "../../providers/http-client/http-client";
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';

declare var dhis2;

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
export class ReportView implements OnInit{

  public reportId : string;
  public reportName : string;
  public _htmlMarkup : any;
  public loadingData : boolean = false;
  public currentUser : any;

  constructor(public navCtrl:NavController,public params:NavParams,public user: User,
              public sanitizer: DomSanitizer,public elementRef : ElementRef,
              public Report:Report,public toastCtrl:ToastController) {

  }

  ngOnInit() {



    this.user.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      dhis2.database = user.currentDatabase;
      this.reportId = this.params.get("id");
      this.reportName = this.params.get("name");
      dhis2.report = {
        organisationUnit :{id : "id",name :"name"},
        organisationUnitChildren : [],
        organisationUnitHierarchy : [],
        period : "2017"
      };

      this.loadReportDesignContent(this.reportId);
    });
  }

  loadReportDesignContent(reportId){
    this.loadingData = true;
    this.Report.getReportId(reportId,this.currentUser).then((report : any)=>{
      this._htmlMarkup = report.designContent;
      let scriptsContents = this.getScriptsContents(this._htmlMarkup);
      this.setScriptsOnHtmlContent(scriptsContents);
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load  report details");
    });
  }

  public get htmlMarkup(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this._htmlMarkup);
  }

  getScriptsContents(html){
    //@todo handling for scripts with href
    var scriptsWithClosingScript = [];
    html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)[0].split("<script>").forEach((scriptFunctionWithCLosingScriptTag:any)=>{
      if(scriptFunctionWithCLosingScriptTag !=""){
        scriptsWithClosingScript.push(scriptFunctionWithCLosingScriptTag.split("</script>")[0]);
      }
    });
    return scriptsWithClosingScript;
  }

  setScriptsOnHtmlContent(scriptsContentsArray){
    scriptsContentsArray.forEach(scriptsContents=>{
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = scriptsContents;
      this.elementRef.nativeElement.appendChild(script);
    });
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
