import { Component } from '@angular/core';
import { NavController,NavParams,ToastController,ActionSheetController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {DataValues} from "../../providers/data-values";
import {EntryForm} from "../../providers/entry-form";
import {DataSets} from "../../providers/data-sets";

/*
  Generated class for the DataEntryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html',
  providers : [User,HttpClient,SqlLite,DataValues,EntryForm,DataSets],
})
export class DataEntryForm {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public dataEntryFormSelectionParameter : any;
  public selectedDataSet : any;
  public entryFormSections : any;
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
  public isDataSetCompletenessUpdated : boolean = false;

  constructor(private params:NavParams, private toastCtrl:ToastController,
              private user:User, private httpClient:HttpClient,
              public navCtrl :NavController,public DataSets : DataSets,
              private actionSheetCtrl: ActionSheetController,
              private entryForm:EntryForm, private sqlLite:SqlLite,
              private dataValues:DataValues) {

    this.user.getCurrentUser().then((user:any)=> {
      this.currentUser = user;
      this.currentPage = 0;
      this.dataEntryFormSelectionParameter = this.params.get('data');
      this.loadDataSet(this.dataEntryFormSelectionParameter.formId);
    });
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
      this.getDataValuesFromLocalStorage();
      //this.setLoadingMessages('Downloading data values from server');
      //let dataSetId = this.selectedDataSet.id;
      //let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
      //let period = this.dataEntryFormSelectionParameter.period.iso;
      //this.dataValues.getDataValueSetFromServer(dataSetId,period,orgUnitId,this.dataSetAttributeOptionCombo,this.currentUser)
      //  .then((dataValues : any)=>{
      //    if(dataValues.length > 0){
      //      this.setLoadingMessages('Saving ' + dataValues.length + " data values from server");
      //      let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
      //      this.dataValues.saveDataValues(dataValues,dataSetId,period,orgUnitId,dataDimension,"synced",this.currentUser).then(()=>{
      //        this.getDataValuesFromLocalStorage();
      //      },error=>{
      //        this.setToasterMessage('Fail to save data values from server');
      //        this.getDataValuesFromLocalStorage();
      //      });
      //    }else{
      //      this.getDataValuesFromLocalStorage();
      //    }
      //  },error=>{
      //    this.setToasterMessage('Fail to download data values from server');
      //    this.getDataValuesFromLocalStorage();
      //    console.log("error : " + JSON.stringify(error));
      //  });

    })
  }

  getDataValuesFromLocalStorage(){
    this.setLoadingMessages('Checking data values');
    let dataSetId = this.selectedDataSet.id;
    let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
    let period = this.dataEntryFormSelectionParameter.period.iso;
    let entryFormSections  = this.entryFormSections;

    this.dataValues.getAllEntryFormDataValuesFromStorage(dataSetId,period,orgUnitId,entryFormSections,this.currentUser).then((dataValues : any)=>{
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

      let fieldIdArray = fieldId.split("-");
      let id = dataSetId + '-' + fieldIdArray[0] + '-' + fieldIdArray[1] + '-' + period + '-' + orgUnitId;
      let newDataValue = [
        {dataElement : fieldIdArray[0],categoryOptionCombo : fieldIdArray[1],value :this.entryFormDataValues[fieldId]}
      ];
      this.dataValues.getDataValuesById(id,this.currentUser).then((dataValues : any)=>{
        if(dataValues.length > 0){
          if(dataValues[0].value != this.entryFormDataValues[fieldId]){
            this.dataValues.saveDataValues(newDataValue,dataSetId,period,orgUnitId,dataDimension,"synced",this.currentUser).then(()=>{
              this.storageStatus.online --;
              this.storageStatus.local ++;
            },error=>{});
          }
        }else{
          this.dataValues.saveDataValues(newDataValue,dataSetId,period,orgUnitId,dataDimension,"not synced",this.currentUser).then(()=>{
            this.storageStatus.local ++;
          },error=>{});
        }
      },error =>{});
    }
  }

  //@todo change usage of acton sheet to display tooltips
  showTooltips(dataElement,categoryComboName,programStageDataElement){
    let title = dataElement.name + (categoryComboName != 'default' ? " " +categoryComboName:"");
    let subTitle = "";
    if(dataElement.description){
      title += ". Description : " + dataElement.description ;
    }
    subTitle += "Value Type : " +dataElement.valueType.toLocaleLowerCase().replace(/_/g," ");
    if(dataElement.optionSet){
      title += ". It has " +dataElement.optionSet.options.length + " options to select.";
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,subTitle:subTitle
    });
    actionSheet.present();
  }

  //todo get input label attribute form setting
  getDisplayName(dataElement){
    return dataElement.displayName;
    //return if()
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
  }

  //@todo handle completeness of dataSet
  updateDataSetCompleteness(){
    this.isDataSetCompletenessUpdated = true;
    let dataSetId = this.selectedDataSet.id;
    let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
    let period = this.dataEntryFormSelectionParameter.period.iso;
    let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
    if(this.isDataSetCompleted){
      this.dataValues.unDoCompleteOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then(()=>{
        this.isDataSetCompleted = !this.isDataSetCompleted;
        this.isDataSetCompletenessUpdated = false;
      },error=>{
        this.isDataSetCompletenessUpdated = false;
        this.setToasterMessage("Fail to undo complete  at moment, please try again later");
      });
    }else{
      this.dataValues.completeOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then((response)=>{
        this.setCompletenessInformation();
      },error=>{
        this.isDataSetCompletenessUpdated = false;
        this.setToasterMessage("Fail to complete at moment, please try again later");
      });
    }
  }

  setCompletenessInformation(){
    let dataSetId = this.selectedDataSet.id;
    let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
    let period = this.dataEntryFormSelectionParameter.period.iso;
    let dataDimension = this.dataEntryFormSelectionParameter.dataDimension;
    this.dataValues.getDataSetCompletenessInfo(dataSetId,period,orgUnitId,dataDimension,this.currentUser).then((response : any)=>{
      this.isDataSetCompleted = response.complete;
      this.dataSetCompletenessInformation.name = response.storedBy;
      this.dataSetCompletenessInformation.date = response.date;
      this.isDataSetCompletenessUpdated = false;
    },error=>{});
  }

  ionViewDidLoad() {
    //console.log('Hello DataEntryForm Page');
  }

  setLoadingMessages(message){
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

}
