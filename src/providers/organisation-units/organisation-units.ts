import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {AppProvider} from "../app/app";

/*
  Generated class for the OrganisationUnitsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export interface OrganisationUnitModel {
  id: string;
  name: string;
  level: string;
  path : string;
  openingDate : string;
  closedDate : string;
  children: Array<any>;
  dataSets: Array<any>;
  programs: Array<any>;
  ancestors: Array<any>;
  parent : Array<any>;
}

@Injectable()
export class OrganisationUnitsProvider {

  organisationUnits : OrganisationUnitModel[];
  lastSelectedOrgUnit : OrganisationUnitModel;
  resource : string;

  constructor(private sqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider, private appProvider: AppProvider) {
    this.resource = "organisationUnits";
  }



  /**
   * reset organisation unit
   */
  resetOrganisationUnit(){
    this.organisationUnits = [];
    this.lastSelectedOrgUnit = null;
  }

  /**
   * downloadingOrganisationUnitsFromServer
   * @param orgUnitIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  downloadingOrganisationUnitsFromServer(orgUnitIds,currentUser){
    let orgUnits= [];
    return new Promise((resolve, reject)=> {
      let counts = 0;
      for(let orgUnitId of orgUnitIds){
        let fields ="fields=id,name,path,ancestors[id,name],dataSets,programs,openingDate,closedDate,level,children[id,name,children[id]],parent";
        let filter="filter=path:ilike:";
        let url = "/api/25/"+this.resource+".json?paging=false&";
        url += fields + "&" + filter + orgUnitId;
        this.HttpClient.get(url,currentUser).then((response:any)=>{
          response = JSON.parse(response.data);
          counts = counts + 1;
          orgUnits = this.appendOrgUnitsFromServerToOrgUnitArray(orgUnits,response);
          this.appProvider.setNormalNotification("Wozaaaaaaa");
          if(counts == orgUnitIds.length){
            resolve(orgUnits);
          }
        },error=>{
          reject(error);
        })
      }
    });
  }

  /**
   * appendOrgUnitsFromServerToOrgUnitArray
   * @param orgUnitArray
   * @param orgUnitResponse
   * @returns {any}
   */
  appendOrgUnitsFromServerToOrgUnitArray(orgUnitArray,orgUnitResponse){
    if(orgUnitResponse[this.resource]){
      for(let orgUnit of orgUnitResponse[this.resource]){
        orgUnitArray.push(orgUnit);
      }
    }
    return orgUnitArray;
  }

  /**
   * savingOrganisationUnitsFromServer
   * @param orgUnits
   * @param currentUser
   * @returns {Promise<T>}
   */
  savingOrganisationUnitsFromServer(orgUnits,currentUser){
    return new Promise((resolve, reject)=> {
      this.sqlLite.insertBulkDataOnTable(this.resource,orgUnits,currentUser.currentDatabase).then(()=>{
        resolve();
      },error=>{
        console.log(JSON.stringify(error));
        reject(error);
      });
    });
  }

  /**
   *setLastSelectedOrganisationUnitUnit
   * @param lastSelectedOrgUnit
   */
  setLastSelectedOrganisationUnitUnit(lastSelectedOrgUnit){
    this.lastSelectedOrgUnit = lastSelectedOrgUnit;
  }


  /**
   * get user assigned organisation unit
   * @param currentUser
   */
  getOrganisationUnits(currentUser){
    let userOrgUnitIds = currentUser.userOrgUnitIds;
    return new Promise((resolve, reject)=> {
      if(this.organisationUnits && this.organisationUnits.length > 0){
        resolve({organisationUnits : this.organisationUnits,lastSelectedOrgUnit :  this.lastSelectedOrgUnit})
      }else{
        if( userOrgUnitIds && userOrgUnitIds.length > 0){
          this.sqlLite.getDataFromTableByAttributes(this.resource,"id",userOrgUnitIds,currentUser.currentDatabase).then((organisationUnits : any)=>{
            this.getSortedOrganisationUnits(organisationUnits).then((organisationUnits:any)=>{
              if(organisationUnits.length > 0){
                this.organisationUnits = organisationUnits;
                this.setLastSelectedOrganisationUnitUnit(organisationUnits[0]);
                resolve({organisationUnits : organisationUnits,lastSelectedOrgUnit : organisationUnits[0]})
              }else{
                resolve({organisationUnits : [],lastSelectedOrgUnit : {}})
              }
            });
          },error=>{
            console.log(error);
            reject(error);
          });
        }else{
          resolve([]);
        }
      }
    });
  }

  /**
   * getOrganisationUnitsByIds
   * @param organisationUnitIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  getOrganisationUnitsByIds(organisationUnitIds,currentUser){
    return new Promise((resolve, reject)=> {
      if( organisationUnitIds && organisationUnitIds.length > 0){
        this.sqlLite.getDataFromTableByAttributes(this.resource,"id",organisationUnitIds,currentUser.currentDatabase).then((organisationUnits : any)=>{
          this.getSortedOrganisationUnits(organisationUnits).then((organisationUnits:any)=>{
            if(organisationUnits && organisationUnits.length > 0) {
              if (organisationUnits[0].children && organisationUnits[0].children.length > 0 && organisationUnits[0].children[0].children) {
                resolve(organisationUnits);
              } else {
                //support for old tree
                let orgUnitIds = [];
                for (let organisationUnit of organisationUnits) {
                  if (organisationUnit && organisationUnit.children) {
                    for (let child of organisationUnit.children) {
                      orgUnitIds.push(child.id);
                    }
                  }
                }
                this.getOrganisationUnitsByIds(orgUnitIds, currentUser).then((childrenOrganisationUnits:any)=> {
                  let childrenOrganisationUnitsMapper = {};
                  for (let childrenOrganisationUnit of childrenOrganisationUnits) {
                    childrenOrganisationUnitsMapper[childrenOrganisationUnit.id] = childrenOrganisationUnit;
                  }
                  organisationUnits.forEach((organisationUnit:any)=> {
                    if (organisationUnit && organisationUnit.children) {
                      organisationUnit.children.forEach((child:any)=> {
                        if (childrenOrganisationUnitsMapper[child.id]) {
                          child = childrenOrganisationUnitsMapper[child.id];
                        }
                      })
                    }
                  });
                  resolve(organisationUnits);
                }, error=> {
                  reject(error);
                });
              }
            }
          });
        },error=>{
          reject(error);
        });
      }else{
        resolve([]);
      }
    });
  }

  getOrganisationUnitsByLevels(parentIds,currentUser){
    let organisationUnitIdToOrganisationUnits = {};
    return new Promise((resolve, reject) =>{
      this.getOrganisationUnitsByIds(parentIds,currentUser).then((organisationUnits : any)=>{
        for(let organisationUnit of organisationUnits){
          organisationUnitIdToOrganisationUnits[organisationUnit.id] = organisationUnit;
        }
        let parentId = parentIds.splice(0,1)[0];
        let orgUnitTree = organisationUnitIdToOrganisationUnits[parentId];
        this.recursiveFetch(parentIds,organisationUnitIdToOrganisationUnits,orgUnitTree);
        resolve(orgUnitTree);

      },error=>{
        reject();
      });
    });
  }


  recursiveFetch(parentIds,organisationUnitIdToOrganisationUnits,orgUnit){
    let self = this;
    let parentId = parentIds.splice(0,1)[0];
    let newChildren = [];
    if(orgUnit && orgUnit.children){
      orgUnit.children.forEach(function(child){
        if(child.id == parentId){
          newChildren.push(organisationUnitIdToOrganisationUnits[parentId]);
        }else{
          newChildren.push(child);
        }
      });
      orgUnit.children = newChildren;
      orgUnit.children.forEach(function(child){
        if(child.id == parentId){
          self.recursiveFetch(parentIds,organisationUnitIdToOrganisationUnits,child);
        }
      })
    }
  }


  /**
   * getSortedOrganisationUnits
   * @param organisationUnits
   * @returns {Promise<T>}
   */
  getSortedOrganisationUnits(organisationUnits){
    return new Promise((resolve, reject)=>{
      organisationUnits.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
      organisationUnits.forEach((organisationUnit:any)=>{
        this.sortOrganisationUnits(organisationUnit);
      });
      resolve(organisationUnits);
    });
  }

  /**
   * organisation unit sorter
   * @param organisationUnit
   */
  sortOrganisationUnits(organisationUnit) {
    if (organisationUnit.children) {
      organisationUnit.children.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
      organisationUnit.children.forEach((child) => {
        this.sortOrganisationUnits(child);
      })
    }
  }
}
