import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {DataValues} from "../../providers/data-values";

/*
  Generated class for the DataEntryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html',
  providers : [User,HttpClient,SqlLite,DataValues],
})
export class DataEntryForm {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public dataEntryFormSelectionParameter : any;
  public selectedDataSet : any;
  public dataSetAttributeOptionCombo : any;

  constructor(public params : NavParams,public toastCtrl: ToastController,private user : User,private httpClient: HttpClient,private sqlLite : SqlLite,private dataValues : DataValues) {
    this.user.getCurrentUser().then((user:any)=>{
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
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units');
    })
  }


  ionViewDidLoad() {
    console.log('Hello DataEntryForm Page');
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
