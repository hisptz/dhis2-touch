import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";

/*
  Generated class for the TrackedEntityAttributeValuesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackedEntityAttributeValuesProvider {

  resource : string;

  constructor(private sqlLite : SqlLiteProvider){
    this.resource = "trackedEntityAttributeValues";
  }

  /**
   *
   * @param trackedEntityInstance
   * @param trackedEntityAttributeValues
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingTrackedEntityAttributeValues(trackedEntityInstance,trackedEntityAttributeValues,currentUser){
    let payLoad = [];
    trackedEntityAttributeValues.forEach((trackedEntityAttributeValue : any)=>{
      payLoad.push({
        "id" : trackedEntityInstance +"-"+trackedEntityAttributeValue.attribute,
        "trackedEntityInstance" : trackedEntityInstance,
        "attribute": trackedEntityAttributeValue.attribute,
        "value": trackedEntityAttributeValue.value
      });
    });
    return new Promise( (resolve, reject)=> {
      this.sqlLite.insertBulkDataOnTable(this.resource,payLoad,currentUser.currentDatabase).then(()=>{
        resolve();
      }).catch(error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param trackedEntityInstanceIds
   * @param currentUser
   */
  getTrackedEntityAttributeValues(trackedEntityInstanceIds,currentUser){
    return new Promise( (resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,'trackedEntityInstance',trackedEntityInstanceIds,currentUser.currentDatabase).then((trackedEntityAttributeValues : any)=>{
        resolve(trackedEntityAttributeValues);
      }).catch(error=>{
        reject(error);
      })
    });
  }

}
