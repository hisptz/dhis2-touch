import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import {Setting} from "../../providers/setting";
import {Synchronization} from "../../providers/synchronization";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {DataValues} from "../../providers/data-values";
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";

/*
  Generated class for the SettingDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting-detail',
  templateUrl: 'setting-detail.html',
  providers : [Setting,Synchronization,HttpClient,DataValues,HttpClient,User,SqlLite]
})
export class SettingDetail {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public settingKey : string;
  private dataEntrySetting : any = {};
  private synchronizationSetting : any = {};

  constructor(private Synchronization: Synchronization,private navCtrl : NavController,private SqlLite:SqlLite,
              public httpClient: HttpClient,public user : User,public dataValues : DataValues,
              private Setting : Setting,private params:NavParams,
              private toastCtrl:ToastController) {

    this.settingKey = this.params.get('settingKey');
    this.loadingSetting(this.settingKey);
  }

  loadingSetting(settingKey){
    if(settingKey == "dataEntrySetting"){
      this.Setting.getDataEntrySetting().then((dataEntrySetting : any)=>{
        if(dataEntrySetting && dataEntrySetting.label){
          this.dataEntrySetting = dataEntrySetting;
        }else{
          this.dataEntrySetting = {label : "displayName",maxDataElementOnDefaultForm : 4}
        }
      })
    }else if(settingKey == "synchronizationSetting"){
      this.Setting.getSynchronization().then((synchronizationSetting:any)=>{
        if(synchronizationSetting && synchronizationSetting.time){
          this.synchronizationSetting = {
            time:this.getDisplaySynchronizationTime(synchronizationSetting.time,synchronizationSetting.timeType),
            timeType:synchronizationSetting.timeType
          }
        }else{
          this.synchronizationSetting = {
            time:2,timeType:"minutes"
          }
        }
      });
    }
  }

  saveSetting(){
    if(this.settingKey == "dataEntrySetting"){
      this.Setting.setDataEntrySetting(this.dataEntrySetting).then(()=>{
        this.redirectToSettingHome();
      })
    }else if(this.settingKey == "synchronizationSetting"){
      let time =this.getSynchronizationTimeToSave(this.synchronizationSetting.time,this.synchronizationSetting.timeType);
      let timeType = this.synchronizationSetting.timeType;
      this.Setting.setSynchronization(time,timeType).then(()=>{
        this.Synchronization.stopSynchronization().then(()=>{
          this.Synchronization.startSynchronization().then(()=>{
            this.redirectToSettingHome();
          });
        });
      });
    }
  }

  getSynchronizationTimeToSave(time,timeType){
    let value = time;
    if(timeType == "minutes"){
      value = time * 60 * 1000;
    }else if(timeType == "hours"){
      value = time * 60 * 60 * 1000;
    }
    return value;
  }

  getDisplaySynchronizationTime(time,timeType){
    let value = time;
    if(timeType == "minutes"){
      value = time/(60 * 1000);
    }else if(timeType == "hours"){
      value = time/(60 * 60 * 1000);
    }
    return value;
  }


  redirectToSettingHome(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
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

}
