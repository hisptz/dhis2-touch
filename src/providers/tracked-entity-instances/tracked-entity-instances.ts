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

  savingTrackedEntityInstances(trackedEntityId,orgUnitId,currentUser,syncStatus,trackedEntityInstance?){
    if(!trackedEntityInstance){
      trackedEntityInstance = dhis2.util.uid();
    }
    if(!syncStatus){
      syncStatus = "not-synced"
    }
    let payLoad = {
      "trackedEntity": trackedEntityId,
      "orgUnit": orgUnitId,
      "trackedEntityInstance": trackedEntityInstance,
      "deleted": false,
      "inactive": false,
      "enrollments": [],
      "relationships": [],
      "syncStatus": syncStatus
    };
    return new Promise( (resolve, reject)=> {
      console.log("savingTrackedEntityInstances : " + JSON.stringify(payLoad));
      resolve(payLoad);
      // this.sqlLite.insertBulkDataOnTable(this.resource,[payLoad],currentUser.currentDatabase).then(()=>{
      //   resolve(payLoad);
      // }).catch(error=>{
      //   reject(error);
      // });
    });
  }

}
