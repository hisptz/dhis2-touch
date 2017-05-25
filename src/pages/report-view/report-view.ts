import { Component,OnInit,ElementRef } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {User} from "../../providers/user";
import {Report} from "../../providers/report";
import {DataSets} from "../../providers/data-sets";

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
  public periodName : string = "";
  public organisationUnitName : string = "";
  public selectedPeriod : any;
  public selectedOrganisationUnit : any;
  public _htmlMarkup : SafeHtml;
  public hasScriptSet : boolean = false;
  public loadingData : boolean = false;
  public loadingMessage : string = "";
  public currentUser : any;

  constructor(public navCtrl:NavController,public params:NavParams,public user: User,
              public sanitizer: DomSanitizer,public elementRef : ElementRef,
              public DataSets : DataSets,
              public Report:Report,public toastCtrl:ToastController) {

  }

  ngOnInit() {
    this.loadingData = true;
    this.user.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      dhis2.database = user.currentDatabase;
      this.reportId = this.params.get("id");
      this.reportName = this.params.get("name");
      if( this.params.get("period")){
        this.selectedPeriod  =  this.params.get("period");
        this.selectedOrganisationUnit = this.params.get("organisationUnit");
        this.organisationUnitName = (this.selectedOrganisationUnit.name)?this.selectedOrganisationUnit.name:"";
        this.periodName = (this.selectedPeriod.name)?this.selectedPeriod.name : "";
        let ids = [];
        dhis2.report = {
          organisationUnit :this.selectedOrganisationUnit,
          organisationUnitChildren : this.params.get("organisationUnitChildren"),
          organisationUnitHierarchy : this.getOrganisationUnitHierarchy(this.params.get("organisationUnit")),
          period : this.selectedPeriod.iso,
          date : this.selectedPeriod.iso + "-01-01",
          dataSets :[]
        };
        for(let dataSet of this.selectedOrganisationUnit.dataSets){
          ids.push(dataSet.id);
        }
        this.DataSets.getDataSetsByIds(ids,user).then((DataSets:any)=>{
          var dataSets = [];
          for(let dataSet of DataSets){
            dataSets.push({id : dataSet.id,name : dataSet.name});
          }
          dhis2.report.organisationUnit.dataSets = dataSets;
          this.loadReportDesignContent(this.reportId);
        },error=>{});
      }else{
        this.loadReportDesignContent(this.reportId);
      }

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
      if(report && report.designContent){
        let scriptsContents = this.getScriptsContents(report.designContent);
        this.setScriptsOnHtmlContent(scriptsContents);
        this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(report.designContent);
      }
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load  report details");
    });
  }

  getScriptsContents(html){
    var scriptsWithClosingScript = [];
    html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)[0].split("<script>").forEach((scriptFunctionWithCLosingScriptTag:any)=>{
      if(scriptFunctionWithCLosingScriptTag !=""){
        scriptsWithClosingScript.push(scriptFunctionWithCLosingScriptTag.split("</script>")[0]);
      }
    });
    return scriptsWithClosingScript;
  }

  setScriptsOnHtmlContent(scriptsContentsArray){
    if(!this.hasScriptSet){
      scriptsContentsArray.forEach(scriptsContents=>{
        if(scriptsContents.indexOf("<script") > -1){
          let srcUrl = this.getScriptUrl(scriptsContents);
          let script = document.createElement("script");
          script.src = srcUrl;
          this.elementRef.nativeElement.appendChild(script);
        }else {
          let script = document.createElement("script");
          script.type = "text/javascript";
          script.innerHTML = scriptsContents;
          this.elementRef.nativeElement.appendChild(script);
        }
      });
      this.hasScriptSet = true;
    }
  }

  getScriptUrl(scriptsContents){
    let url = "";
    scriptsContents.split("<script").forEach((scriptsContent:any)=>{
      if(scriptsContent !=""){
        url = scriptsContent.split("src=")[1].split(">")[0];
      }
    });
    return url;
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000
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
