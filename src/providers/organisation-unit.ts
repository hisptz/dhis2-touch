import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite";

/*
  Generated class for the OrganisationUnit provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export interface OrganisationUnitModel {
  id: string;
  name: string;
  level: string;
  children: Array<any>;
  dataSets: Array<any>;
  programs: Array<any>;
  ancestors: Array<any>;
}

@Injectable()
export class OrganisationUnit {

  organisationUnits : OrganisationUnitModel[];
  currentOrganisationUnit : OrganisationUnitModel;

  public resource : string;

  constructor(private sqlLite : SqlLite) {
    this.resource = "organisationUnits";
  }

  /**
   * reset organisation unit
   */
  resetOrganisationUnit(){
    this.organisationUnits = [];
    this.currentOrganisationUnit = null;
  }

  /**
   * get user assigned organisation unit
   * @param currentUser
     */
  getOrganisationUnits(currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      if(self.organisationUnits && self.organisationUnits.length > 0){
        resolve(self.organisationUnits);
      }else{
        self.sqlLite.getAllDataFromTable(self.resource,currentUser.currentDatabase).then((organisationUnits : any)=>{
          self.getSortedOrganisationUnits(organisationUnits).then((organisationUnits:any)=>{
            self.organisationUnits = organisationUnits;
            resolve(organisationUnits)
          });
        },error=>{
          reject(error);
        });
      }
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
