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

  /**
   * get user assigned organisation unit
   * @param currentUser
     */
  getOrganisationUnits(currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sqlLite.getAllDataFromTable(self.resource,currentUser.currentDatabase).then((organisationUnits : any)=>{
        self.getSortedOrganisationUnits(organisationUnits).then((organisationUnits:any)=>{
          resolve(organisationUnits)
        });
      },error=>{
        reject(error);
      });
    });
  }

  /**
   * get sorted orgnanisation units
   * @param organisationUnits
   * @returns {Promise<T>}
     */
  getSortedOrganisationUnits(organisationUnits){
    let self = this;
    return new Promise(function(resolve, reject) {
      organisationUnits.forEach((organisationUnit:any)=>{
        self.sortOrganisationUnits(organisationUnit);
      });
      resolve(organisationUnits);
    });
  }

  /**
   * organisation unit sorter
   * @param organisationUnit
     */
  sortOrganisationUnits(organisationUnit) {
    let self = this;
     if (organisationUnit.children) {
      organisationUnit.children.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      organisationUnit.children.forEach((child) => {
        self.sortOrganisationUnits(child);
      })
    }
  }

}
