import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";
import {SqlLite} from "./sql-lite/sql-lite";
import {Observable} from 'rxjs/Rx';
import {User} from "./user/user";
import {DataValues} from "./data-values";
import {Setting} from "./setting";

/*
  Generated class for the Synchronization provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Synchronization {

  public synchronizationTimer : any;

  constructor(public Setting: Setting,public httpClient: HttpClient,public user : User,public dataValues : DataValues) {

  }

  getCurrentUser(){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.user.getCurrentUser().then((user : any)=>{
        resolve(user);
      })
    })
  }

  startSynchronization(){
    let self = this;
    let timeInterval = 1000 * 60 * 2;
    return  new Promise(function(resolve,reject){
      self.Setting.getSynchronization().then((synchronization :any)=>{
        if(synchronization){
          timeInterval = synchronization.time?synchronization.time:timeInterval;
        }
        self.getCurrentUser().then((user : any)=>{
          self.synchronizationTimer = setInterval(() => {
            self.dataValues.getDataValuesByStatus(user,"not synced").then((dataValues : any)=>{
              self.dataValues.uploadDataValues(dataValues,user);
            },error=>{});
          }, timeInterval);
        });
        resolve();
      });

    });


  }

  stopSynchronization(){
    let self = this;
    return  new Promise(function(resolve,reject){
      clearInterval(self.synchronizationTimer);
      resolve()
    });

  }
}
