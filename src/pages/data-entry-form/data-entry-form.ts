import { Component,OnInit,ViewChild} from '@angular/core';
import { NavController,NavParams,ToastController,ActionSheetController,Content,ModalController } from 'ionic-angular';

import {DataValues} from "../../providers/data-values";
import {EntryForm} from "../../providers/entry-form";
import {DataSets} from "../../providers/data-sets";
import {NetworkAvailability} from "../../providers/network-availability";
import {User} from "../../providers/user";
import {Setting} from "../../providers/setting";
import {EntryFormSectionListPage} from "../entry-form-section-list/entry-form-section-list";

/*
  Generated class for the DataEntryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html'
})
export class DataEntryForm implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public loadingMessage : string ="";
  public currentUser : any;
  public dataEntryFormSelectionParameter : any;
  public selectedDataSet : any;
  public entryFormSections : any = [];
  public dataSetAttributeOptionCombo : any;
  //entry form data values and storage status
  public entryFormDataValues : any;
  public storageStatus : any = { online :0,local : 0};
  //labels
  public selectedDataSetLabel : string = "";
  public selectedOrganisationUnitLabel : string = "";
  public selectedPeriodLabel : string = "";
  public paginationLabel : string = "";

  //pagination controller
  public currentPage : number ;

  //dataSet completeness
  public isDataSetCompleted : boolean = false;
  public dataSetCompletenessInformation :any = {name:"",date:""};
  public isDataSetCompletenessProcessRunning : boolean = false;
  public dataSetCompletenessProgressMessage :string = "";

  //settings
  public dataEntrySetting : any;

  //network
  public network : any;

  @ViewChild(Content) content: Content;

  constructor(public modalCtrl: ModalController,public navCtrl : NavController,public params:NavParams, public toastCtrl:ToastController,
              public user:User,public DataSets : DataSets,
              public actionSheetCtrl: ActionSheetController,public NetworkAvailability : NetworkAvailability,
              public entryForm:EntryForm,public Setting : Setting,
              public dataValues:DataValues) {

  }

  ngOnInit() {
    this.network = this.NetworkAvailability.getNetWorkStatus();
    this.user.getCurrentUser().then((user:any)=> {
      this.currentUser = user;
      this.currentPage = 0;
      this.dataEntryFormSelectionParameter = this.params.get('data');
      this.loadDataSet(this.dataEntryFormSelectionParameter.formId);
      this.loadEntryFormSetting();
    });
  }

  ionViewDidEnter() {
    if(this.dataEntrySetting && this.dataEntrySetting.label){
      this.loadEntryFormSetting();
    }
  }

  loadEntryFormSetting(){
    this.Setting.getDataEntrySetting().then((dataEntrySetting: any)=>{
      if(dataEntrySetting && dataEntrySetting.label){
        this.dataEntrySetting = dataEntrySetting;
      }else{
        this.dataEntrySetting = {label : "displayName",maxDataElementOnDefaultForm : 4}
      }
    })
  }

  loadDataSet(dataSetId){
    this.loadingData = true;
    this.loadingMessages=[];
    this.setLoadingMessages('Loading entry form details');
    this.DataSets.getDataSetById(dataSetId,this.currentUser).then((dataSet : any)=>{
      this.selectedDataSet = dataSet;
      this.dataSetAttributeOptionCombo = this.dataValues.getDataValuesSetAttributeOptionCombo(this.dataEntryFormSelectionParameter.dataDimension,dataSet.categoryCombo.categoryOptionCombos);
      this.setEntryFormMetaData();
      //setting labels and loading completeness
      this.setHeaderLabel();
      this.setCompletenessInformation();
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units : ' + JSON.stringify(error));
    });
  }

  setEntryFormMetaData(){
    this.setLoadingMessages('Setting Entry form');
    this.entryForm.getEntryFormMetadata(this.selectedDataSet,this.currentUser).then((sections : any)=>{
      this.entryFormSections = sections;
      //setting initial label values
      this.paginationLabel = (this.currentPage + 1) + "/"+this.entryFormSections.length;
      this.network = this.NetworkAvailability.getNetWorkStatus();
      if(!this.network.isAvailable){
        this.getDataValuesFromLocalStorage();
      }else{
        this.setLoadingMessages('Downloading data values from server');
        let dataSetId = this.selectedDataSet.id;
        let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
        let period = this.dataEntryFormSelectionParameter.period.iso;
        this.dataValues.getDataValueSetFromServer(dataSetId,period,orgUnitId,this.dataSetAttributeOptionCombo,this.currentUser)
          .then((dataValues : any)=>{
            if(dataValues.length > 0){
              dataValues.forEach((dataValue)=>{
                dataValue["period"] = this.dataEntryFormSelectionParameter.period.name;
                dataValue["orgUnit"] = this.dataEntryFormSelectionParameter.orgUnit.name;
              });
              this.setLoadingMessages('Saving ' + dataValues.length + " data values from server");
              let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
              this.dataValues.saveDataValues(dataValues,dataSetId,period,orgUnitId,dataDimension,"synced",this.currentUser).then(()=>{
                this.getDataValuesFromLocalStorage();
              },error=>{
                this.setToasterMessage('Fail to save data values from server');
                this.getDataValuesFromLocalStorage();
              });
            }else{
              this.getDataValuesFromLocalStorage();
            }
          },error=>{
            this.setToasterMessage('Fail to download data values from server');
            this.getDataValuesFromLocalStorage();
            console.log("error : " + JSON.stringify(error));
          });
      }
    })
  }

  getDataValuesFromLocalStorage(){
    this.setLoadingMessages('Checking data values');
    let dataSetId = this.selectedDataSet.id;
    let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
    let period = this.dataEntryFormSelectionParameter.period.iso;
    let entryFormSections  = this.entryFormSections;
    let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;

    this.dataValues.getAllEntryFormDataValuesFromStorage(dataSetId,period,orgUnitId,entryFormSections,dataDimension,this.currentUser).then((dataValues : any)=>{
      this.entryFormDataValues = {};
      this.storageStatus.local = 0;
      this.storageStatus.online = 0;
      dataValues.forEach((dataValue : any)=>{
        this.entryFormDataValues[dataValue.id] = dataValue.value;
        dataValue.status == "synced" ? this.storageStatus.online ++ :this.storageStatus.local ++;
      });
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
    });
  }

  //@todo update status notifications in case has failed
  updateValues(fieldId){
    if(this.entryFormDataValues[fieldId]){
      let dataSetId = this.selectedDataSet.id;
      let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
      let period = this.dataEntryFormSelectionParameter.period.iso;
      let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
      let syncStatus = "not synced";

      let fieldIdArray = fieldId.split("-");
      let id = dataSetId + '-' + fieldIdArray[0] + '-' + fieldIdArray[1] + '-' + period + '-' + orgUnitId;
      let newDataValue = [
        {
          orgUnit : this.dataEntryFormSelectionParameter.orgUnit.name,
          dataElement : fieldIdArray[0],
          categoryOptionCombo : fieldIdArray[1],
          value :this.entryFormDataValues[fieldId],
          period : this.dataEntryFormSelectionParameter.period.name
        }
      ];
      this.dataValues.getDataValuesById(id,this.currentUser).then((dataValues : any)=>{
        if(dataValues.length > 0){
          if(dataValues[0].value != this.entryFormDataValues[fieldId]){
            this.dataValues.saveDataValues(newDataValue,dataSetId,period,orgUnitId,dataDimension,syncStatus,this.currentUser).then(()=>{
              if(this.storageStatus.online > 0 && dataValues[0].syncStatus == "synced"){
                this.storageStatus.online --;
                this.storageStatus.local ++;
              }
            },error=>{});
          }
        }else{
          this.dataValues.saveDataValues(newDataValue,dataSetId,period,orgUnitId,dataDimension,syncStatus,this.currentUser).then(()=>{
            this.storageStatus.local ++;
          },error=>{});
        }
      },error =>{});
    }
  }

  //@todo change usage of acton sheet to display tooltips
  showTooltips(dataElement,categoryComboName,programStageDataElement){
    let title = this.getDisplayName(dataElement) + (categoryComboName != 'default' ? " " +categoryComboName:"");
    let subTitle = "";
    if(dataElement.description){
      title = + dataElement.description ;
    }else{
      if(dataElement.description){
        title += ". Description : " + dataElement.description ;
      }
      subTitle += "Value Type : " +dataElement.valueType.toLocaleLowerCase().replace(/_/g," ");
      if(dataElement.optionSet){
        title += ". It has " +dataElement.optionSet.options.length + " options to select.";
      }
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,subTitle:subTitle
    });
    actionSheet.present();
  }

  getDisplayName(dataElement){
    let label = this.dataEntrySetting.label;
    return (dataElement[label])? dataElement[label] :dataElement.displayName;
  }

  openEntryFormSectionList(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Please wait");
    let modal = this.modalCtrl.create(EntryFormSectionListPage,{entryFormSections:this.entryFormSections,currentEntryFormId : this.currentPage});
    modal.onDidDismiss((currentEntry : any)=>{
      if(currentEntry){
        if(currentEntry.currentEntryFormId != this.currentPage){
          this.currentPage = currentEntry.currentEntryFormId;
          this.changePagination(this.currentPage);
        }
      }
      this.loadingData = false;
    });
    modal.present();
  }

  setHeaderLabel(){
    this.selectedDataSetLabel = this.selectedDataSet.name;
    this.selectedOrganisationUnitLabel = this.dataEntryFormSelectionParameter.orgUnit.name;
    this.selectedPeriodLabel = this.dataEntryFormSelectionParameter.period.name;
  }

  changePagination(page){
    page = parseInt(page);
    if(page == -1){
      this.currentPage = 0;
    }else if(page == this.entryFormSections.length){
      this.currentPage = this.entryFormSections.length - 1;
    }else{
      this.currentPage = page;
    }
    this.paginationLabel = (this.currentPage + 1) + "/"+this.entryFormSections.length;
    //scroll form to the top
    setTimeout(() => {
      this.content.scrollToTop(1300);
    },200);
  }

  updateDataSetCompleteness(){
    let network = this.NetworkAvailability.getNetWorkStatus();
    if(!network.isAvailable){
      this.setNotificationToasterMessage(network.message);
    }else {
      this.isDataSetCompletenessProcessRunning = true;
      this.dataSetCompletenessProgressMessage = "Please wait";
      let dataSetId = this.selectedDataSet.id;
      let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
      let period = this.dataEntryFormSelectionParameter.period.iso;
      let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
      if(this.isDataSetCompleted){
        this.dataSetCompletenessProgressMessage = "Undo the completion of  entry form";
        this.dataValues.unDoCompleteOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then(()=>{
          this.isDataSetCompleted = !this.isDataSetCompleted;
          this.isDataSetCompletenessProcessRunning = false;
        },error=>{
          this.isDataSetCompletenessProcessRunning = false;
          this.setToasterMessage("Fail to undo complete  at moment, please try again later");
        });
      }else{
        let dataValues = [];
        if(this.entryFormDataValues){
          Object.keys(this.entryFormDataValues).forEach((fieldId:any)=>{
            let fieldIdArray = fieldId.split("-");
            if(this.entryFormDataValues[fieldId]){
              dataValues.push({
                de: fieldIdArray[0],
                co: fieldIdArray[1],
                pe: period,
                ou: orgUnitId,
                cc: dataDimension.cc,
                cp: dataDimension.cp,
                value: this.entryFormDataValues[fieldId]
              });
            }
          });
        }
        if(dataValues.length > 0){
          this.dataSetCompletenessProgressMessage = "Uploading data to the server";
          this.dataValues.uploadAllDataValuesOnCompleteForm(dataValues,this.currentUser).then((uploadResponse : any)=>{
            this.storageStatus.local = uploadResponse.failOnUploadedDataValues;
            this.storageStatus.online = uploadResponse.uploadedDataValues;
            this.dataSetCompletenessProgressMessage = "Completing entry form";
            this.dataValues.completeOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then((response)=>{
              this.setCompletenessInformation();
            },error=>{
              this.isDataSetCompletenessProcessRunning = false;
              this.setToasterMessage("Fail to complete at moment, please try again later");
            });
          },error=>{
            this.isDataSetCompletenessProcessRunning = false;
            this.setToasterMessage("Fail to upload data to the server");
          });
        }else{
          this.setToasterMessage("You can not complete empty form");
          this.isDataSetCompletenessProcessRunning = false;
        }
      }
    }
  }

  setCompletenessInformation(){
    let dataSetId = this.selectedDataSet.id;
    let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
    let period = this.dataEntryFormSelectionParameter.period.iso;
    let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
    this.dataSetCompletenessProgressMessage = "Update entry form completion status";
    this.dataValues.getDataSetCompletenessInfo(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then((response : any)=>{
      this.isDataSetCompleted = response.complete;
      this.dataSetCompletenessInformation.name = response.storedBy;
      this.dataSetCompletenessInformation.date = response.date;
      this.isDataSetCompletenessProcessRunning = false;
    },error=>{});
  }

  ionViewDidLoad() {
    //console.log('Hello DataEntryForm Page');
  }

  setLoadingMessages(message){
    this.loadingMessage = message;
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

  setNotificationToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      position : 'top',
      duration: 3000
    });
    toast.present();
  }

}
