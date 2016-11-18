import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {DataValues} from "../../providers/data-values";
import {EntryForm} from "../../providers/entry-form";

/*
  Generated class for the DataEntryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html',
  providers : [User,HttpClient,SqlLite,DataValues,EntryForm],
})
export class DataEntryForm {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public dataEntryFormSelectionParameter : any;
  public selectedDataSet : any;
  public entryFormSections : any;
  public entryFormDataValues : any;
  public dataSetAttributeOptionCombo : any;

  constructor(private params:NavParams, private toastCtrl:ToastController,
              private user:User, private httpClient:HttpClient,
              private entryForm:EntryForm, private sqlLite:SqlLite,
              private dataValues:DataValues) {

    this.user.getCurrentUser().then((user:any)=> {
      this.currentUser = user;
      this.dataEntryFormSelectionParameter = this.params.get('data');
      this.loadDataSet(this.dataEntryFormSelectionParameter.formId);
    });
  }

  loadDataSet(dataSetId){
    this.loadingData = true;
    this.loadingMessages=[];
    this.setLoadingMessages('Loading entry form details');
    let resource  = "dataSets";
    let attribute = "id";
    let attributeValue = [];
    attributeValue.push(dataSetId);
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((dataSets : any)=>{
      this.selectedDataSet = dataSets[0];
      this.dataSetAttributeOptionCombo = this.dataValues.getDataValuesSetAttributeOptionCombo(this.dataEntryFormSelectionParameter.dataDimension,dataSets[0].categoryCombo.categoryOptionCombos);
      this.setEntryFormMetaData();
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units');
    })
  }

  setEntryFormMetaData(){
    this.setLoadingMessages('Setting Entry form');
    this.entryForm.getEntryFormMetadata(this.selectedDataSet,this.currentUser).then((sections : any)=>{
      this.entryFormSections = sections;
      this.setLoadingMessages('Downloading data values form server');
      let dataSetId = this.selectedDataSet.id;
      let orgUnitId = this.dataEntryFormSelectionParameter.orgUnit.id;
      let period = this.dataEntryFormSelectionParameter.period.iso;
      this.dataValues.getDataValueSetFromServer(dataSetId,period,orgUnitId,this.dataSetAttributeOptionCombo,this.currentUser)
        .then((dataValues : any)=>{
          alert("dataValues :: " + JSON.stringify(dataValues));
          this.loadingData = false;
        },error=>{
          this.setToasterMessage('Fail to download data values form server');
          console.log("error : " + JSON.stringify(error));
          this.loadingData = false;
        });
    })
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
