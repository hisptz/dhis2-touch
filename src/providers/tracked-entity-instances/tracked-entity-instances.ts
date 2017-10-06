import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";

declare var dhis2: any;

/*
  Generated class for the TrackedEntityInstancesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackedEntityInstancesProvider {

  resource : string;

  constructor(private sqlLite : SqlLiteProvider){
    this.resource = "trackedEntityInstances";
  }

  /**
   *
   * @param trackedEntityId
   * @param orgUnitId
   * @param currentUser
   * @param syncStatus
   * @param trackedEntityInstance
   * @returns {Promise<any>}
   */
  savingTrackedEntityInstances(trackedEntityId,orgUnitId,orgUnitName,currentUser,syncStatus,trackedEntityInstance?){
    if(!trackedEntityInstance){
      trackedEntityInstance = dhis2.util.uid();
    }
    if(!syncStatus){
      syncStatus = "not-synced"
    }
    let payLoad = {
      "id" : trackedEntityInstance,
      "trackedEntity": trackedEntityId,
      "orgUnit": orgUnitId,
      "orgUnitName" : orgUnitName,
      "trackedEntityInstance": trackedEntityInstance,
      "deleted": false,
      "inactive": false,
      "enrollments": [],
      "relationships": [],
      "syncStatus": syncStatus
    };
    let payLoads = [];
    payLoads.push(payLoad);
    return new Promise( (resolve, reject)=> {
      this.sqlLite.insertBulkDataOnTable(this.resource,payLoads,currentUser.currentDatabase).then(()=>{
        resolve(payLoad);
      }).catch(error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param trackedEntityInstanceIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getTrackedEntityInstances(trackedEntityInstanceIds,currentUser){
    return new Promise( (resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,'trackedEntityInstance',trackedEntityInstanceIds,currentUser.currentDatabase).then((trackedEntityInstances : any)=>{
        resolve(trackedEntityInstances);
      }).catch(error=>{
        reject(error);
      })
    })
  }


}
