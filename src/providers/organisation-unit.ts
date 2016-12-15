import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite/sql-lite";

/*
  Generated class for the OrganisationUnit provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OrganisationUnit {

  public resource : string;

  constructor(private sqlLite : SqlLite) {
    this.resource = "organisationUnits";
  }

  getOrganisationUnits(currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sqlLite.getAllDataFromTable(self.resource,currentUser.currentDatabase).then((organisationUnits : any)=>{
        resolve(organisationUnits)
      },error=>{
        reject(error);
      })
    });
  }

}
