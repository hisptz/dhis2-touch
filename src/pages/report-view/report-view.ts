import {Component, ElementRef, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {UserProvider} from "../../providers/user/user";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {AppProvider} from "../../providers/app/app";
import {StandardReportProvider} from "../../providers/standard-report/standard-report";

/**
 * Generated class for the ReportViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


declare var dhis2;

@IonicPage()
@Component({
  selector: 'page-report-view',
  templateUrl: 'report-view.html',
})
export class ReportViewPage implements OnInit{

  public reportId : string;
  public reportName : string;
  public selectedPeriod : any;
  public selectedOrganisationUnit : any;
  public _htmlMarkup : SafeHtml;
  public hasScriptSet : boolean = false;
  public isLoading : boolean = false;
  public loadingMessage : string = "";
  public currentUser : any;

  constructor(public navCtrl: NavController, public params: NavParams, public user: UserProvider, public dataSetProvider: DataSetsProvider,
              public reportProvider: StandardReportProvider,  public sanitizer: DomSanitizer, public appProvider: AppProvider, public elementRef : ElementRef) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadingMessage = "Loading user information";
    this.user.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      dhis2.database = user.currentDatabase;
      this.reportId = this.params.get("id");
      this.reportName = this.params.get("name");
      this.isLoading = false;
      if( this.params.get("period")){
        this.selectedPeriod  =  this.params.get("period");
        this.selectedOrganisationUnit = this.params.get("organisationUnit");
        let ids = [];
        let organisationUnitHierarchy = [];
        let periods = [];
        let date = "";
        let period = "";
        if(this.selectedPeriod && this.selectedPeriod.name){
          periods.push(this.selectedPeriod.iso);
          date = this.selectedPeriod.startDate;
          period = this.selectedPeriod.iso;
        }
        if(this.selectedOrganisationUnit && this.selectedOrganisationUnit.id){
          let organisationUnitHierarchy = this.getOrganisationUnitHierarchy(this.params.get("organisationUnit"));
          this.dataSetProvider.getDataSetSource(this.selectedOrganisationUnit.id,user.currentDatabase).then((dataSetSources: any)=>{
            dataSetSources.forEach((dataSetSource : any)=>{
              ids.push(dataSetSource.dataSetId);
            });
            this.dataSetProvider.getDataSetsByIds(ids,user).then((DataSets:any)=>{
              let dataSets = [];
              for(let dataSet of DataSets){
                dataSets.push({id : dataSet.id,name : dataSet.name});
              }
              dhis2.report = {
                organisationUnit :this.selectedOrganisationUnit,
                organisationUnitChildren : this.params.get("organisationUnitChildren"),
                organisationUnitHierarchy : organisationUnitHierarchy,
                periods : periods,
                period : period,
                date : date,
                dataSets :dataSets
              };
              this.loadReportDesignContent(this.reportId);
            },error=>{
              this.isLoading = false;
              this.appProvider.setNormalNotification("Fail to load organisation units information");
            });
          },error=>{
            this.isLoading = false;
            this.appProvider.setNormalNotification("Fail to load organisation units information");
          });
        }else{
          dhis2.report = {
            organisationUnit :this.selectedOrganisationUnit,
            organisationUnitChildren : this.params.get("organisationUnitChildren"),
            organisationUnitHierarchy : organisationUnitHierarchy,
            periods : periods,
            period : period,
            date : date,
            dataSets :[]
          };
          this.loadReportDesignContent(this.reportId);
        }
      }else{
        this.loadReportDesignContent(this.reportId);
      }

    });
  }


  backToPreviousView(){
    this.isLoading = true;
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
    this.isLoading = true;
    console.log("reportId : " + reportId);
    this.loadingMessage = "Loading report metadata";
    this.reportProvider.getReportDesign(reportId,this.currentUser).then((report : any)=>{
      if(report && report.designContent){
        try{
          let scriptsContents = this.getScriptsContents(report.designContent);
          this.setScriptsOnHtmlContent(scriptsContents);
          this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(report.designContent);
          this.isLoading = false;
        }catch (e){
          console.log(JSON.stringify(e));
          this.isLoading = false;
        }
      }

    },error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load  report details");
    });
  }

  getScriptsContents(html){
    let scriptsWithClosingScript = [];
    if(html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)){
      if(html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)[0].split("<script>").length > 0){
        html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)[0].split("<script>").forEach((scriptFunctionWithCLosingScriptTag:any)=>{
          if(scriptFunctionWithCLosingScriptTag !=""){
            scriptsWithClosingScript.push(scriptFunctionWithCLosingScriptTag.split("</script>")[0]);
          }
        });
      }
    }
    return scriptsWithClosingScript;
  }

  setScriptsOnHtmlContent(scriptsContentsArray){
    if(!this.hasScriptSet){
      scriptsContentsArray.forEach(scriptsContents=>{
        if(scriptsContents.indexOf("<script") > -1){
          try{
            let srcUrl = this.getScriptUrl(scriptsContents);
            let script = document.createElement("script");
            script.src = srcUrl;
            this.elementRef.nativeElement.appendChild(script);
          }catch (e){
            console.log("error : " + JSON.stringify(e));
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.innerHTML = scriptsContents;
            this.elementRef.nativeElement.appendChild(script);
          }
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
    if(scriptsContents && scriptsContents.split("<script").length > 0){
      scriptsContents.split("<script").forEach((scriptsContent:any)=>{
        if(scriptsContent !=""){
          url = scriptsContent.split("src=")[1].split(">")[0];
        }
      });
    }
    return url;
  }

}
