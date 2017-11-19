import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams,Content} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {DataEntryFormProvider} from "../../providers/data-entry-form/data-entry-form";
import {SettingsProvider} from "../../providers/settings/settings";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {DataSetCompletenessProvider} from "../../providers/data-set-completeness/data-set-completeness";

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
  storageStatus : any;
  dataValuesObject : any;
  dataValuesSavingStatusClass : any;
  dataSetsCompletenessInfo : any;
  isDataSetCompleted : boolean;
  isDataSetCompletenessProcessRunning : boolean;

  @ViewChild(Content) content: Content;

  constructor(private navCtrl: NavController,
              private userProvider : UserProvider,
              private appProvider : AppProvider,
              private modalCtrl : ModalController,
              private dataSetCompletenessProvider : DataSetCompletenessProvider,
              private dataEntryFormProvider : DataEntryFormProvider,
              private settingsProvider : SettingsProvider,
              private dataValuesProvider : DataValuesProvider,
              private navParams: NavParams) {
  }

  ngOnInit(){
    this.icons["menu"] = "assets/dashboard/menu.png";
    this.storageStatus ={
      online : 0, offline : 0
    };
    this.dataSetsCompletenessInfo = {};
    this.isDataSetCompleted = false;
    this.dataValuesObject = {};
    this.dataValuesSavingStatusClass = {};
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
      let dataSetId = this.dataSet.id;
      let period = this.entryFormParameter.period.iso;
      let orgUnitId = this.entryFormParameter.orgUnit.id;
      let dataDimension = this.entryFormParameter.dataDimension;
      this.dataSetAttributeOptionCombo = this.dataValuesProvider.getDataValuesSetAttributeOptionCombo(dataDimension,this.dataSet.categoryCombo.categoryOptionCombos);
      this.loadingMessage = "Loading data from the server";
      this.dataValuesProvider.getDataValueSetFromServer(dataSetId,period,orgUnitId,this.dataSetAttributeOptionCombo,this.currentUser).then((dataValues : any)=>{
        if(dataValues.length > 0){
          dataValues.forEach((dataValue :any)=>{
            dataValue["period"] = this.entryFormParameter.period.name;
            dataValue["orgUnit"] = this.entryFormParameter.orgUnit.name;
          });
          this.loadingMessage = "Saving data form server";
          let syncStatus = 'synced';
          this.dataValuesProvider.saveDataValues(dataValues,dataSetId,period,orgUnitId,dataDimension,syncStatus,this.currentUser).then(()=>{
            this.loadingLocalData(dataSetId, period, orgUnitId,dataDimension);
          },error=>{
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification("Fail to save data from the server");
            this.loadingLocalData(dataSetId, period, orgUnitId,dataDimension);
          });
        }else{
          this.loadingLocalData(dataSetId, period, orgUnitId,dataDimension);
        }
      },error=>{
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification("Fail to load data from the server");
        this.loadingLocalData(dataSetId, period, orgUnitId,dataDimension);
      });
    },error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to prepare entry form");
    });
  }

  loadingLocalData(dataSetId, period, orgUnitId,dataDimension){
    this.loadingMessage = "Loading available local data";
    this.dataValuesProvider.getAllEntryFormDataValuesFromStorage(dataSetId, period, orgUnitId, this.entryFormSections, dataDimension, this.currentUser).then((entryFormDataValues : any)=>{
      entryFormDataValues.forEach((dataValue : any)=>{
        this.dataValuesObject[dataValue.id] = dataValue;
        dataValue.status == "synced" ? this.storageStatus.online ++ :this.storageStatus.offline ++;
      });
      this.loadingDataSetCompleteness();
    },error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load available local data");
    });
  }

  loadingDataSetCompleteness(){
    this.loadingMessage = "Loading entry form completeness information";
    this.isDataSetCompleted = false;
    this.dataSetsCompletenessInfo = {};
    let dataSetId = this.dataSet.id;
    let period = this.entryFormParameter.period.iso;
    let orgUnitId = this.entryFormParameter.orgUnit.id;
    let dataDimension = this.entryFormParameter.dataDimension;
    this.dataSetCompletenessProvider.getDataSetCompletenessInfo(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then((dataSetCompletenessInfo : any)=>{
      this.dataSetsCompletenessInfo = dataSetCompletenessInfo;
      if(dataSetCompletenessInfo && dataSetCompletenessInfo.complete){
        this.isDataSetCompleted = true;
      }
      this.isLoading = false;
    },error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load entry form completeness information");
    })
  }

  openSectionList(){
    let modal = this.modalCtrl.create('DataEntrySectionSelectionPage',{
      pager : this.pager,
      sections : this.getEntryFormSections(this.entryFormSections)
    });
    modal.onDidDismiss((pager : any)=>{
      if(pager && pager.page){
        this.pager = pager;
        //scroll form to the top
        setTimeout(() => {
          this.content.scrollToTop(1300);
        },200);
      }
    });
    modal.present();
  }

  viewUserCompletenessInformation(dataSetsCompletenessInfo){
    let username = (dataSetsCompletenessInfo && dataSetsCompletenessInfo.storedBy) ? dataSetsCompletenessInfo.storedBy: "";
    let modal = this.modalCtrl.create('EntryFormCompletenessPage',{
      username : username,currentUser : this.currentUser
    });
    modal.present();
  }

  viewEntryFormIndicators(indicators){
    if(indicators && indicators.length > 0){
      let modal = this.modalCtrl.create('DataEntryIndicatorsPage',{
        indicators : indicators,dataSet : {id : this.dataSet.id,name : this.dataSet.name }
      });
      modal.onDidDismiss(()=>{
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There are no indicators to view");
    }
  }

  changePagination(page){
    page = parseInt(page);
    if(page > 0 && page <=this.pager.total){
      this.isLoading = true;
      this.pager.page = page;
      this.isLoading = false;
      //scroll form to the top
      setTimeout(() => {
        this.content.scrollToTop(1300);
      },200);
    }
  }

  updateData(updateDataValue){
    let dataValueId = updateDataValue.id;
    let dataSetId = this.dataSet.id;
    let period = this.entryFormParameter.period.iso;
    let orgUnitId = this.entryFormParameter.orgUnit.id;
    let orgUnitName = this.entryFormParameter.orgUnit.name;
    let dataDimension = this.entryFormParameter.dataDimension;
    let newDataValue = [];
    let fieldIdArray = dataValueId.split("-");
    newDataValue.push({
      orgUnit : orgUnitName,
      dataElement : fieldIdArray[0],
      categoryOptionCombo : fieldIdArray[1],
      value :updateDataValue.value,
      period : this.entryFormParameter.period.name
    });
    this.dataValuesProvider.saveDataValues(newDataValue,dataSetId,period,orgUnitId,dataDimension,updateDataValue.status,this.currentUser).then(()=>{
      if(this.dataValuesObject[dataValueId] && this.dataValuesObject[dataValueId].status == "synced" ){
        this.storageStatus.online --;
        this.storageStatus.offline ++;
      }else if(!this.dataValuesObject[dataValueId]){
        this.storageStatus.offline ++;
      }
      this.dataValuesSavingStatusClass[dataValueId] ="input-field-container-success";
      this.dataValuesObject[dataValueId] = updateDataValue;
    },error=>{
      this.dataValuesSavingStatusClass[dataValueId] ="input-field-container-failed";
    });
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

  //@todo support offline completeness and un completeness of form
  updateDataSetCompleteness(){
    this.content.scrollToBottom(1000);
    this.isDataSetCompletenessProcessRunning = true;
    let dataSetId = this.dataSet.id;
    let period = this.entryFormParameter.period.iso;
    let orgUnitId = this.entryFormParameter.orgUnit.id;
    let dataDimension = this.entryFormParameter.dataDimension;
    if(this.isDataSetCompleted){
      this.dataSetCompletenessProvider.unDoCompleteOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then(()=>{
        this.dataSetsCompletenessInfo = {};
        this.isDataSetCompletenessProcessRunning = false;
        this.isDataSetCompleted = false;
        this.content.scrollToBottom(1000);
      },error=>{
        this.isDataSetCompletenessProcessRunning = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification("Fail to un complete entry form");
      });
    }else{
      this.dataSetCompletenessProvider.completeOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then(()=>{
        this.dataSetCompletenessProvider.getDataSetCompletenessInfo(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then((dataSetCompletenessInfo : any)=>{
          this.dataSetsCompletenessInfo = dataSetCompletenessInfo;
          if(dataSetCompletenessInfo && dataSetCompletenessInfo.complete){
            this.isDataSetCompleted = true;
            this.content.scrollToBottom(1000);
          }
          this.isDataSetCompletenessProcessRunning = false;
          this.uploadDataValuesOnComplete(period,orgUnitId,dataDimension);
        },error=>{
          console.log(JSON.stringify(error));
          this.isDataSetCompletenessProcessRunning = false;
          this.appProvider.setNormalNotification("Fail to load entry form completeness information");
        });
      },error=>{
        this.isDataSetCompletenessProcessRunning = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification("Fail to complete entry form");
      });
    }
  }

  uploadDataValuesOnComplete(period,orgUnitId,dataDimension){
    let dataValues = [];
    if(this.dataValuesObject){
      Object.keys(this.dataValuesObject).forEach((fieldId:any)=>{
        let fieldIdArray = fieldId.split("-");
        if(this.dataValuesObject[fieldId]){
          let dataValue = this.dataValuesObject[fieldId];
          if(dataValue.status !="synced"){
            dataValues.push({
              de: fieldIdArray[0],
              co: fieldIdArray[1],
              pe: period,
              ou: orgUnitId,
              cc: dataDimension.cc,
              cp: dataDimension.cp,
              value: dataValue.value
            });
          }
        }
      });
    }
    if(dataValues.length > 0){
      this.loadingMessage = "Uploading data";
      let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(dataValues);
      this.dataValuesProvider.uploadDataValues(formattedDataValues,formattedDataValues,this.currentUser).then(()=>{
        this.storageStatus.offline = 0;
        this.storageStatus.online += dataValues.length;
        console.log("Success uploading data");
      }).catch(error=>{
        console.log("Fail to upload data");
      });

    }
  }


}
