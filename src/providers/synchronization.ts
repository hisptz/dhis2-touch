import { Injectable } from '@angular/core';
import {Setting} from "./setting";
import {HttpClient} from "./http-client";
import {User} from "./user";
import {DataValues} from "./data-values";

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

    return new Promise((resolve, reject)=> {
      this.user.getCurrentUser().then((user : any)=>{
        resolve(user);
      })
    })
  }

  startSynchronization(){
    let timeInterval = 1000 * 60 * 2;
    return  new Promise((resolve,reject)=>{
      this.Setting.getSynchronization().then((synchronization :any)=>{
        if(synchronization){
          timeInterval = synchronization.time?synchronization.time:timeInterval;
        }
        this.getCurrentUser().then((user : any)=>{
          setInterval(() => {
            this.dataValues.getDataValuesByStatus(user,"not synced").then((dataValues : any)=>{
              this.dataValues.uploadDataValues(dataValues,user);
            },error=>{});
          }, timeInterval);
        });
        resolve();
      });


    });


  }

  stopSynchronization(){
    return  new Promise(function(resolve,reject){
      resolve()
    });

  }
}
