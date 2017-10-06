import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";

declare var dhis2: any;

/*
  Generated class for the EnrollmentsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EnrollmentsProvider {

  resource : string;

  constructor(private sqlLite : SqlLiteProvider){
    this.resource = "enrollments";
  }

  savingEnrollments(trackedEntityId,orgUnitId,orgUnitName,programId,enrollmentDate,incidentDate,trackedEntityInstance,currentUser,syncStatus,enrollment?){
    if(!enrollment){
      enrollment = dhis2.util.uid();
    }
    let payLoad = {
      "trackedEntity": trackedEntityId,
      "orgUnit": orgUnitId,
      "program": programId,
      "trackedEntityInstance": trackedEntityInstance,
      "enrollment": enrollment,
      "orgUnitName": orgUnitName,
      "enrollmentDate": enrollmentDate,
      "incidentDate": incidentDate,
      "status": "ACTIVE",
      "attributes": [],
      "events": [],
      "syncStatus": syncStatus
    };
    return new Promise( (resolve, reject)=> {
      this.sqlLite.insertBulkDataOnTable(this.resource,[payLoad],currentUser.currentDatabase).then(()=>{
        resolve(payLoad);
      }).catch(error=>{
        reject(error);
      });
    });
  }

}
