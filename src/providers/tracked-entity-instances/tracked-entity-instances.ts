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
   * @param orgUnitName
   * @param currentUser
   * @param syncStatus
   * @param trackedEntityInstance
   * @returns {Array}
   */
  getTrackedEntityInstancesPayLoad(trackedEntityId,orgUnitId,orgUnitName,syncStatus,trackedEntityInstance?){
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
    return payLoads;
  }

  /**
   *
   * @param attribute
   * @param attributeArray
   * @param currentUser
   * @returns {Promise<any>}
   */
  getTrackedEntityInstancesByAttribute(attribute,attributeArray,currentUser){
    return new Promise( (resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeArray,currentUser.currentDatabase).then((trackedEntityInstances : any)=>{
        resolve(trackedEntityInstances);
      }).catch(error=>{
        reject(error);
      })
    })
  }


  /**
   *
   * @param trackedEntityInstances
   * @param status
   * @param currentUser
   * @returns {Promise<any>}
   */
  updateSavedTrackedEntityInstancesByStatus(trackedEntityInstances,currentUser,status?){
    return new Promise((resolve,reject)=>{
      const newTrackedEntityInstances = trackedEntityInstances.slice();
      newTrackedEntityInstances.forEach((trackedEntityInstance : any)=>{
        delete trackedEntityInstance.attributes;
        if(status){
          trackedEntityInstance.syncStatus = status;
        }
      });
      this.sqlLite.insertBulkDataOnTable(this.resource,newTrackedEntityInstances,currentUser.currentDatabase).then(()=>{
        resolve();
      }).catch((error)=>{
        reject(error);
      });
    });
  }


}
