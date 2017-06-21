import { Component,OnInit } from '@angular/core';
import { ToastController,AlertController } from 'ionic-angular';
import {Synchronization} from "../../providers/synchronization";
import {Setting} from "../../providers/setting";
import {SqlLite} from "../../providers/sql-lite";
import {User} from "../../providers/user";

/*
  Generated class for the SettingHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting-home',
  templateUrl: 'setting-home.html'
})
export class SettingHomePage implements OnInit{

  public dataEntrySetting : any = {};
  public synchronizationSetting : any = {};
  public currentUser : any;

  public settingObject : any = {
    synchronizationSetting : {isExpanded : true,isSaved : true},
    dataEntrySetting : {isExpanded : false,isSaved : true},
    dataDeletion : {isExpanded : false,isDataCleared : true,selectedItems :{}, itemsToBeDeleted : []},
    security : {isExpanded : false,isSaved : true}
  };

  constructor(public Synchronization: Synchronization,
              public user : User,public alertCtrl: AlertController,
              public Setting : Setting,public SqlLite : SqlLite,
              public toastCtrl:ToastController) {}

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
    });
    this.loadingSetting();
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

  resetDeletedItems(){
    let deletedTable = [];
    for(let key of Object.keys(this.settingObject.dataDeletion.selectedItems)){
      if(this.settingObject.dataDeletion.selectedItems[key])
        deletedTable.push(key);
    }
    this.settingObject.dataDeletion.itemsToBeDeleted = deletedTable;
  }

  clearDataConfirmation(){
    let alert = this.alertCtrl.create({
      title: 'Clear Data Confirmation',
      message: 'Are you want to clear data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Clear',
          handler: () => {
            this.clearData();
          }
        }
      ]
    });
    alert.present();
  }

  clearData(){
    let deletedItemCount = 0;
    let failCount = 0;
    this.settingObject.dataDeletion.isDataCleared = false;
    for(let tableName of this.settingObject.dataDeletion.itemsToBeDeleted){
      this.SqlLite.deleteAllOnTable(tableName,this.currentUser.currentDatabase).then(()=>{
        deletedItemCount = deletedItemCount + 1;
        if((deletedItemCount + failCount) == this.settingObject.dataDeletion.itemsToBeDeleted.length){
          this.setToasterMessage("You have successfully clear data");
          this.settingObject.dataDeletion.selectedItems = {};
          this.settingObject.dataDeletion.isDataCleared = true;
          this.settingObject.dataDeletion.isExpanded = false;
        }
      },error=>{
        console.log("Error : " + JSON.stringify(error));
        failCount = failCount + 1;
        if((deletedItemCount + failCount) == this.settingObject.dataDeletion.itemsToBeDeleted.length){
          this.setToasterMessage("You have successfully clear data");
          this.settingObject.dataDeletion.selectedItems = {};
          this.settingObject.dataDeletion.isDataCleared = true;
          this.settingObject.dataDeletion.isExpanded = false;
        }
      })
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
      duration: 4000
    });
    toast.present();
  }

}
