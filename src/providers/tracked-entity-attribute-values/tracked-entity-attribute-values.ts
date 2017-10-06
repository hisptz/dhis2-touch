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

  savingTrackedEntityAttributeValues(trackedEntityInstance,trackedEntityAttributeValues,currentUser){
    let payLoad = [];
    trackedEntityAttributeValues.forEach((trackedEntityAttributeValue : any)=>{
      payLoad.push({
        "id" : trackedEntityInstance,
        "trackedEntityInstance" : trackedEntityInstance,
        "attribute": trackedEntityAttributeValue.attribute,
        "value": trackedEntityAttributeValue.value
      });
    });
    return new Promise( (resolve, reject)=> {
      console.log("savingTrackedEntityAttributeValues : " + JSON.stringify(payLoad));
      resolve();
      // this.sqlLite.insertBulkDataOnTable(this.resource,payLoad,currentUser.currentDatabase).then(()=>{
      //   resolve();
      // }).catch(error=>{
      //   reject(error);
      // });
    });

  }

}