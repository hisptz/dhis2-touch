import { Component,OnInit,ElementRef } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {User} from "../../providers/user";
import {Report} from "../../providers/report";

declare var dhis2;

/*
  Generated class for the ReportView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-view',
  templateUrl: 'report-view.html',
})
export class ReportView implements OnInit{

  public reportId : string;
  public reportName : string;
  public _htmlMarkup : any;
  public loadingData : boolean = false;
  public loadingMessage : string = "";
  public currentUser : any;

  constructor(public navCtrl:NavController,public params:NavParams,public user: User,
              public sanitizer: DomSanitizer,public elementRef : ElementRef,
              public Report:Report,public toastCtrl:ToastController) {

  }

  ngOnInit() {
    this.loadingData = true;
    this.user.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      dhis2.database = user.currentDatabase;
      this.reportId = this.params.get("id");
      this.reportName = this.params.get("name");
      dhis2.report = {
        organisationUnit :this.params.get("organisationUnit"),
        organisationUnitChildren : this.params.get("organisationUnitChildren"),
        organisationUnitHierarchy : this.getOrganisationUnitHierarchy(this.params.get("organisationUnit")),
        period : this.params.get("period")
      };
      this.loadReportDesignContent(this.reportId);
    });
  }

  backToPreviousView(){
    this.loadingData = true;
    this.loadingMessage = "Closing report";
    this.navCtrl.pop();
  }

  getOrganisationUnitHierarchy(organisationUnit){
    let organisationUnitHierarchy = [];
    organisationUnitHierarchy.push({id : organisationUnit.id,name : organisationUnit.name});
    if(organisationUnit.ancestors){
      let length = organisationUnit.ancestors.length;
      for(let index = length -1; index >= 0; index --){
        organisationUnitHierarchy.push(organisationUnit.ancestors[index]);
      }
    }
    return organisationUnitHierarchy;
  }

  loadReportDesignContent(reportId){
    this.loadingData = true;
    this.loadingMessage = "Loading report metadata";
    this.Report.getReportId(reportId,this.currentUser).then((report : any)=>{
      this._htmlMarkup = report.designContent;
      let scriptsContents = this.getScriptsContents(this._htmlMarkup);
      this.loadingData = false;
      this.setScriptsOnHtmlContent(scriptsContents);
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
