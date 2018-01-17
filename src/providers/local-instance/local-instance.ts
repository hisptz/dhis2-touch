import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";



/*
  Generated class for the LocalInstanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalInstanceProvider {

  LOCAL_INSTANCE_KEY : string;

  constructor(private sqlLiteProvider : SqlLiteProvider) {
    this.LOCAL_INSTANCE_KEY = "LOCAL_INSTANCE_KEY";
    this.sqlLiteProvider.createTable(this.LOCAL_INSTANCE_KEY,this.LOCAL_INSTANCE_KEY).then(()=>{
    })
  }

  /**
   *
   * @returns {Promise<any>}
   */
  getLocalInstances(){
    return new Promise((resolve,reject)=>{
      this.sqlLiteProvider.getAllDataFromTable(this.LOCAL_INSTANCE_KEY,this.LOCAL_INSTANCE_KEY).then((localInstances : any)=>{
        resolve(localInstances);
      }).catch((error)=>{
        reject(error);
      })
    })
  }

  /**
   *
   * @param localInstances
   * @param currentUser
   * @param loggedInInInstance
   * @returns {Promise<any>}
   */
  setLocalInstanceInstances(localInstances,currentUser,loggedInInInstance){
    return new Promise((resolve,reject)=>{
      let newInstances  = [];
      newInstances.push({
        id : currentUser.currentDatabase,
        name : loggedInInInstance,
        currentUser : currentUser
      });
      localInstances.forEach((localInstance : any)=>{
        if(newInstances.indexOf(localInstance) == -1){
          newInstances.push(localInstance);
        }
      });
      this.sqlLiteProvider.insertBulkDataOnTable(this.LOCAL_INSTANCE_KEY,newInstances,this.LOCAL_INSTANCE_KEY).then(()=>{
        resolve();
      }).catch((error=>{
        reject(error);
      }));
    })
  }

}
