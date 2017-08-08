import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  constructor(private storage : Storage) {
  }

  /**
   *
   * @param currentUser
   * @param appSettings
   * @returns {Promise<any>}
   */
  setSettingsForTheApp(currentUser,appSettings){
    appSettings = JSON.stringify(appSettings);
    return  new Promise((resolve,reject) => {
      let key = 'appSettings'+ (currentUser && currentUser.currentDatabase) ? currentUser.currentDatabase : "";
      this.storage.set(key, appSettings).then(() => {
        resolve();
      },error=>{
        reject();
      });
    });
  }


  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  getSettingsForTheApp(currentUser){
    return  new Promise((resolve,reject) => {
      let key = 'appSettings'+ (currentUser && currentUser.currentDatabase) ? currentUser.currentDatabase : "";
      this.storage.get(key).then(appSettings=>{
        appSettings = JSON.parse(appSettings);
        resolve(appSettings);
      },err=>{
        reject();
      }).catch(err=>{
        reject();
      })
    });
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

  getDefaultSettings(){
    let defaultSettings = {
      entryForm: {
        label: "displayName", maxDataElementOnDefaultForm: 10
      },
      synchronization: {
        time: 2 * 60 * 1000, timeType: "minutes"
      }
    };
    return defaultSettings;
  }

  getSanitizedSettings(appSettings) {
    if (appSettings.entryForm) {
      if(isNaN(appSettings.entryForm.maxDataElementOnDefaultForm) || appSettings.entryForm.maxDataElementOnDefaultForm <= 0){
        appSettings.entryForm.maxDataElementOnDefaultForm = 1;
      }
    }
    if(appSettings.synchronization){
      if(isNaN(appSettings.synchronization.time) || appSettings.synchronization.time < 1){
        appSettings.synchronization.time = 1
      }
      appSettings.synchronization.time = this.getSynchronizationTimeToSave(appSettings.synchronization.time,appSettings.synchronization.timeType);
    }
    return appSettings;
  }

  getSettingContentDetails(){
    let settingContents = [
      {id : 'synchronization',name : 'Synchronization',icon: 'assets/settings-icons/synchronization.png',isLoading : false,loadingMessage: ''},
      {id : 'entryForm',name : 'Entry form',icon: 'assets/settings-icons/entry-form.png',isLoading : false,loadingMessage: ''}
    ];
    return settingContents;
  }

}
