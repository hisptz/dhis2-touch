import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {Setting} from "../../providers/setting";
import {Synchronization} from "../../providers/synchronization";

/*
  Generated class for the SettingHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting-home',
  templateUrl: 'setting-home.html',
  providers : [Setting,Synchronization]
})
export class SettingHome {

  public dataEntrySetting : any = {};
  public synchronizationSetting : any = {};

  public settingObject : any = {
    synchronizationSetting : {isExpanded : true,isSaved : true},
    dataEntrySetting : {isExpanded : false,isSaved : true},
    sendDataViaSms : {isExpanded : false,isSaved : true},
    security : {isExpanded : false,isSaved : true}
  };

  constructor(public Synchronization: Synchronization,
              public Setting : Setting,
              public toastCtrl:ToastController) {

    this.loadingSetting();
  }

  ionViewDidLoad() {
  }

  saveSetting(settingKey){
    this.settingObject[settingKey].isSaved = false;
    let successSavingMessages = "Changes has been saved";
    if(settingKey == "dataEntrySetting"){
      this.Setting.setDataEntrySetting(this.dataEntrySetting).then(()=>{
        this.setToasterMessage(successSavingMessages);
        this.settingObject[settingKey].isSaved = true;
        this.settingObject[settingKey].isExpanded = false;
      })
    }else if(settingKey == "synchronizationSetting"){
      let time =this.getSynchronizationTimeToSave(this.synchronizationSetting.time,this.synchronizationSetting.timeType);
      let timeType = this.synchronizationSetting.timeType;
      this.Setting.setSynchronization(time,timeType).then(()=>{
        this.Synchronization.stopSynchronization().then(()=>{
          this.Synchronization.startSynchronization().then(()=>{
            this.setToasterMessage(successSavingMessages);
            this.settingObject[settingKey].isSaved = true;
            this.settingObject[settingKey].isExpanded = false;
          });
        });
      });
    }
  }

  hideAndShowContents(settingKey){
    if(!this.settingObject[settingKey].isExpanded){
      Object.keys(this.settingObject).forEach(key=>{
        if(key != settingKey){
          this.settingObject[key].isExpanded = false;
        }
      });
    }
    this.settingObject[settingKey].isExpanded = !this.settingObject[settingKey].isExpanded;
  }

  loadingSetting(){
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
    this.Setting.getDataEntrySetting().then((dataEntrySetting : any)=>{
      if(dataEntrySetting && dataEntrySetting.label){
        this.dataEntrySetting = dataEntrySetting;
      }else{
        this.dataEntrySetting = {label : "displayName",maxDataElementOnDefaultForm : 4}
      }
    })
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

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
