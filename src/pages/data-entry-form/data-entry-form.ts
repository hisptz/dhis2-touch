import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {DataEntryFormProvider} from "../../providers/data-entry-form/data-entry-form";
import {SettingsProvider} from "../../providers/settings/settings";
import {DataValuesProvider} from "../../providers/data-values/data-values";

/**
 * Generated class for the DataEntryFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html',
})
export class DataEntryFormPage implements OnInit{

  entryFormParameter : any;

  isLoading : boolean;
  loadingMessage : string;
  currentUser : any;
  appSettings : any;

  indicators : Array<any>;
  sectionIds : Array<string>;
  dataSet : any;
  dataSetAttributeOptionCombo : any;

  entryFormSections : any;
  icons : any = {};
  pager : any = {};

  isDataSetCompleted : boolean;
  isDataSetCompletenessProcessRunning : boolean;

  constructor(private navCtrl: NavController,
              private userProvider : UserProvider,
              private appProvider : AppProvider,
              private modalCtrl : ModalController,
              private dataEntryFormProvider : DataEntryFormProvider,
              private settingsProvider : SettingsProvider,
              private dataValuesProvider : DataValuesProvider,
              private navParams: NavParams) {
  }

  ngOnInit(){
    this.icons["menu"] = "assets/dashboard/menu.png";

    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.entryFormParameter = this.navParams.get("parameter");
    this.userProvider.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.settingsProvider.getSettingsForTheApp(user).then((appSettings:any)=>{
        this.appSettings = appSettings;
        this.loadingDataSetInformation(this.entryFormParameter.dataSet.id);
      });
    },error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  goBack(){
    this.navCtrl.pop();
  }

  loadingDataSetInformation(dataSetId){
    this.loadingMessage = "Loading entry form information";
    this.dataEntryFormProvider.loadingDataSetInformation(dataSetId,this.currentUser).then((dataSetInformation : any)=>{
      this.dataSet = dataSetInformation.dataSet;
      this.sectionIds = dataSetInformation.sectionIds;
      this.loadingMessage = "Loading indicators";
      this.dataEntryFormProvider.getEntryFormIndicators(dataSetInformation.indicatorIds,this.currentUser).then((indicators :any)=>{
        this.indicators = indicators;
        this.loadingEntryForm(this.dataSet,this.sectionIds);
      },error=>{
        this.isLoading = false;
        this.loadingMessage = "";
        this.appProvider.setNormalNotification("Fail to load indicators");
      });
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load entry form information");
    })
  }

  loadingEntryForm(dataSet,sectionIds){
    this.loadingMessage = "Prepare entry form";
    this.dataEntryFormProvider.getEntryForm(sectionIds,dataSet.id,this.appSettings,this.currentUser).then((entryForm : any)=>{
      this.entryFormSections = entryForm;
      this.pager["page"] = 1;
      this.pager["total"] = entryForm.length;
      this.dataSetAttributeOptionCombo = this.dataValuesProvider.getDataValuesSetAttributeOptionCombo(this.entryFormParameter.dataDimension,this.dataSet.categoryCombo.categoryOptionCombos);
      this.isLoading = false;
    },error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to prepare entry form");
    });
  }

  openSectionList(){
    let modal = this.modalCtrl.create('DataEntrySectionSelectionPage',{
      pager : this.pager,
      sections : this.getEntryFormSections(this.entryFormSections)
    });
    modal.onDidDismiss((pager : any)=>{
      if(pager && pager.page){
        this.pager = pager;
      }
    });
    modal.present();
  }

  changePagination(page){
    page = parseInt(page);
    if(page > 0 && page <=this.pager.total){
      this.isLoading = true;
      this.pager.page = page;
      this.isLoading = false;
    }
  }

  updateData(data){
    console.log(JSON.stringify(data));
  }

  updateDataSetCompleteness(){

  }

  getEntryFormSections(entryFormSections){
    let sections = [];
    entryFormSections.forEach((entryFormSection : any)=>{
      sections.push({
        id : entryFormSection.id,name : entryFormSection.name
      })
    });
    return sections;
  }

}
