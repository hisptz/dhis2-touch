import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the Setting provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Setting {

  constructor(private storage : Storage) {

  }

  setSynchronization(time,timeType){
    let self = this;
    return  new Promise(function(resolve,reject){
      let synchronizationSetting = JSON.stringify({time:time,timeType:timeType});
      self.storage.set('synchronizationSetting', synchronizationSetting).then(() => {
        resolve();
      },error=>{
        reject();
      });
    });
  }

  setDataEntrySetting(dataEntrySetting){
    let self = this;
    return  new Promise(function(resolve,reject){
      dataEntrySetting= JSON.stringify(dataEntrySetting);
      self.storage.set('dataEntrySetting', dataEntrySetting).then(() => {
        resolve();
      },error=>{
        reject();
      });
    });
  }

  getSynchronization(){
    let self = this;
    return  new Promise(function(resolve,reject){
      self.storage.get('synchronizationSetting').then(synchronizationSetting=>{
        synchronizationSetting = JSON.parse(synchronizationSetting);
        resolve(synchronizationSetting);
      },err=>{
        reject();
      })
    });
  }

  getDataEntrySetting(){
    let self = this;
    return  new Promise(function(resolve,reject){
      self.storage.get('dataEntrySetting').then(dataEntrySetting=>{
        dataEntrySetting = JSON.parse(dataEntrySetting);
        resolve(dataEntrySetting);
      },err=>{
        reject();
      })
    });
  }

}
